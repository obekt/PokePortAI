import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCardSchema } from "@shared/schema";
import { recognizeCard } from "./services/openai";
import { getMarketPrice, getTrendingCards } from "./services/marketData";
import multer from "multer";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all cards
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getAllCards();
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
  app.post("/api/cards/scan", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
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
  app.post("/api/cards", async (req, res) => {
    try {
      const validatedData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(validatedData);
      res.status(201).json(card);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid card data",
        error: (error as Error).message 
      });
    }
  });

  // Update card
  app.patch("/api/cards/:id", async (req, res) => {
    try {
      const updates = insertCardSchema.partial().parse(req.body);
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
  app.delete("/api/cards/:id", async (req, res) => {
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
  app.get("/api/portfolio/stats", async (req, res) => {
    try {
      const cards = await storage.getAllCards();
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
