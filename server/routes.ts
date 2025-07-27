import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCardSchema, updateCardSchema, insertUserProfileSchema, insertCommentSchema } from "@shared/schema";
import { recognizeCard } from "./services/openai";
import { getMarketPrice, getTrendingCards } from "./services/marketData";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for high-res images
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get all cards
  app.get("/api/cards", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cards = await storage.getAllCards(userId);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  // Get single card
  app.get("/api/cards/:id", async (req, res) => {
    try {
      const card = await storage.getCard(req.params.id);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch card" });
    }
  });

  // Scan card with AI recognition
  app.post("/api/cards/scan", isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      console.log("Received scan request:");
      console.log("- req.file:", req.file ? `${req.file.size} bytes, ${req.file.mimetype}` : "null");
      console.log("- req.body:", req.body);
      console.log("- Content-Type:", req.headers['content-type']);
      
      if (!req.file) {
        console.log("No file received in request");
        return res.status(400).json({ message: "No image provided" });
      }

      const base64Image = req.file.buffer.toString('base64');
      
      // Use OpenAI to recognize the card
      const recognition = await recognizeCard(base64Image);
      
      // Get market price for the recognized card
      const marketPrice = await getMarketPrice(
        recognition.name,
        recognition.set,
        recognition.condition
      );

      console.log("Market price response:", { 
        hasImageUrl: !!marketPrice.imageUrl,
        imageUrl: marketPrice.imageUrl ? marketPrice.imageUrl.substring(0, 50) + '...' : 'none'
      });

      res.json({
        recognition: {
          ...recognition,
          // Official image from Pokemon TCG API
          imageUrl: marketPrice.imageUrl
        },
        marketPrice,
        // Always prioritize official image, user image only for fallback display
        imageUrl: marketPrice.imageUrl || `data:${req.file.mimetype};base64,${base64Image}`
      });
    } catch (error) {
      console.error("Card scanning error:", error);
      res.status(500).json({ 
        message: "Failed to scan card", 
        error: (error as Error).message 
      });
    }
  });

  // Add card to portfolio
  app.post("/api/cards", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("Creating card for user:", userId);
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      
      const validatedData = insertCardSchema.parse(req.body);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
      
      const card = await storage.createCard(userId, validatedData);
      res.status(201).json(card);
    } catch (error) {
      console.error("Card creation error:", error);
      res.status(400).json({ 
        message: "Invalid card data",
        error: (error as Error).message 
      });
    }
  });

  // Update card
  app.patch("/api/cards/:id", isAuthenticated, async (req: any, res) => {
    try {
      const updates = updateCardSchema.parse(req.body);
      const card = await storage.updateCard(req.params.id, updates);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid update data",
        error: (error as Error).message 
      });
    }
  });

  // Delete card
  app.delete("/api/cards/:id", isAuthenticated, async (req: any, res) => {
    try {
      const deleted = await storage.deleteCard(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete card" });
    }
  });

  // Get portfolio statistics
  app.get("/api/portfolio/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cards = await storage.getAllCards(userId);
      const totalCards = cards.length;
      const totalValue = cards.reduce((sum, card) => sum + parseFloat(card.estimatedValue), 0);
      const totalAddedValue = cards.reduce((sum, card) => sum + parseFloat(card.purchasePrice || "0"), 0);
      const priceChange = totalAddedValue > 0 ? ((totalValue - totalAddedValue) / totalAddedValue) * 100 : 0;
      const topCard = cards.reduce((max, card) => 
        parseFloat(card.estimatedValue) > parseFloat(max.estimatedValue) ? card : max,
        cards[0] || { estimatedValue: "0" }
      );

      res.json({
        totalCards,
        totalValue: totalValue.toFixed(2),
        priceChange: priceChange.toFixed(2),
        topCard: topCard ? parseFloat(topCard.estimatedValue).toFixed(2) : "0.00"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate portfolio stats" });
    }
  });

  // Get market trends
  app.get("/api/market/trends", async (req, res) => {
    try {
      const trendingCards = await getTrendingCards();
      res.json(trendingCards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market trends" });
    }
  });

  // Get market data for specific card
  app.get("/api/market/:cardName/:set", async (req, res) => {
    try {
      const { cardName, set } = req.params;
      const condition = req.query.condition as string || "Near Mint";
      
      const marketPrice = await getMarketPrice(cardName, set, condition);
      res.json(marketPrice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // Social features API endpoints

  // Get user profile
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Update user profile
  app.put("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("Updating profile for user:", userId);
      console.log("Request body:", req.body);
      
      const validatedData = insertUserProfileSchema.parse({
        userId: userId,
        ...req.body
      });
      console.log("Validated data:", validatedData);
      
      const profile = await storage.upsertUserProfile(userId, validatedData);
      res.json(profile);
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(400).json({ 
        message: "Invalid profile data",
        error: (error as Error).message 
      });
    }
  });

  // Get public portfolios (community feed)
  app.get("/api/community/portfolios", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const publicProfiles = await storage.getPublicProfiles(limit);
      res.json(publicProfiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch public portfolios" });
    }
  });

  // Get portfolio details with cards (for viewing public portfolios)
  app.get("/api/portfolio/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const viewerUserId = (req as any).user?.claims?.sub;

      // Check if portfolio is public
      const profile = await storage.getUserProfile(userId);
      if (!profile?.isPublic) {
        return res.status(403).json({ message: "Portfolio is private" });
      }

      // Increment view count if different user
      if (viewerUserId && viewerUserId !== userId) {
        await storage.incrementPortfolioViews(userId);
      }

      const [cards, user, comments, isLiked] = await Promise.all([
        storage.getAllCards(userId),
        storage.getUser(userId),
        storage.getPortfolioComments(userId),
        viewerUserId ? storage.isLikedByUser(userId, viewerUserId) : false,
      ]);

      res.json({
        profile,
        user,
        cards,
        comments,
        isLiked,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Add comment to portfolio
  app.post("/api/portfolio/:userId/comments", isAuthenticated, async (req: any, res) => {
    try {
      const { userId: portfolioUserId } = req.params;
      const commenterUserId = req.user.claims.sub;
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: "Comment content is required" });
      }

      // Check if portfolio is public
      const profile = await storage.getUserProfile(portfolioUserId);
      if (!profile?.isPublic) {
        return res.status(403).json({ message: "Cannot comment on private portfolio" });
      }

      const commentData = insertCommentSchema.parse({
        portfolioUserId,
        commenterUserId,
        content: content.trim(),
      });

      const comment = await storage.addComment(commentData);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Failed to add comment" });
    }
  });

  // Delete comment
  app.delete("/api/comments/:commentId", isAuthenticated, async (req: any, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user.claims.sub;
      
      await storage.deleteComment(commentId, userId);
      res.json({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Toggle like on portfolio
  app.post("/api/portfolio/:userId/like", isAuthenticated, async (req: any, res) => {
    try {
      const { userId: portfolioUserId } = req.params;
      const likerUserId = req.user.claims.sub;

      if (portfolioUserId === likerUserId) {
        return res.status(400).json({ message: "Cannot like your own portfolio" });
      }

      // Check if portfolio is public
      const profile = await storage.getUserProfile(portfolioUserId);
      if (!profile?.isPublic) {
        return res.status(403).json({ message: "Cannot like private portfolio" });
      }

      const result = await storage.toggleLike(portfolioUserId, likerUserId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
