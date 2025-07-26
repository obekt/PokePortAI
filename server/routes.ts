import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCardSchema, updateCardSchema } from "@shared/schema";
import { recognizeCard } from "./services/openai";
import { getMarketPrice, getTrendingCards } from "./services/marketData";
import { setupGoogleAuth, isAuthenticated } from "./googleAuth";
import multer from "multer";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for high-res images
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupGoogleAuth(app);

  // Note: Auth routes are handled in googleAuth.ts

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

      res.json({
        recognition,
        marketPrice,
        imageUrl: `data:${req.file.mimetype};base64,${base64Image}`
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
      const avgValue = totalCards > 0 ? totalValue / totalCards : 0;
      const topCard = cards.reduce((max, card) => 
        parseFloat(card.estimatedValue) > parseFloat(max.estimatedValue) ? card : max,
        cards[0] || { estimatedValue: "0" }
      );

      res.json({
        totalCards,
        totalValue: totalValue.toFixed(2),
        avgValue: avgValue.toFixed(2),
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

  const httpServer = createServer(app);
  return httpServer;
}
