import { type Card, type InsertCard, type MarketData, type InsertMarketData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Card operations
  getCard(id: string): Promise<Card | undefined>;
  getAllCards(): Promise<Card[]>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, updates: Partial<InsertCard>): Promise<Card | undefined>;
  deleteCard(id: string): Promise<boolean>;
  
  // Market data operations
  getMarketData(cardName: string, set: string): Promise<MarketData | undefined>;
  getAllMarketData(): Promise<MarketData[]>;
  createMarketData(data: InsertMarketData): Promise<MarketData>;
  updateMarketData(id: string, updates: Partial<InsertMarketData>): Promise<MarketData | undefined>;
}

export class MemStorage implements IStorage {
  private cards: Map<string, Card>;
  private marketDataMap: Map<string, MarketData>;

  constructor() {
    this.cards = new Map();
    this.marketDataMap = new Map();
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async getAllCards(): Promise<Card[]> {
    return Array.from(this.cards.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const card: Card = { 
      ...insertCard, 
      id,
      createdAt: new Date().toISOString()
    };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: string, updates: Partial<InsertCard>): Promise<Card | undefined> {
    const existing = this.cards.get(id);
    if (!existing) return undefined;
    
    const updated: Card = { ...existing, ...updates };
    this.cards.set(id, updated);
    return updated;
  }

  async deleteCard(id: string): Promise<boolean> {
    return this.cards.delete(id);
  }

  async getMarketData(cardName: string, set: string): Promise<MarketData | undefined> {
    const key = `${cardName}-${set}`;
    return this.marketDataMap.get(key);
  }

  async getAllMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketDataMap.values()).sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  }

  async createMarketData(insertData: InsertMarketData): Promise<MarketData> {
    const id = randomUUID();
    const data: MarketData = { 
      ...insertData, 
      id,
      lastUpdated: new Date().toISOString()
    };
    const key = `${data.cardName}-${data.set}`;
    this.marketDataMap.set(key, data);
    return data;
  }

  async updateMarketData(id: string, updates: Partial<InsertMarketData>): Promise<MarketData | undefined> {
    const existing = Array.from(this.marketDataMap.values()).find(data => data.id === id);
    if (!existing) return undefined;
    
    const updated: MarketData = { ...existing, ...updates, lastUpdated: new Date().toISOString() };
    const key = `${updated.cardName}-${updated.set}`;
    this.marketDataMap.set(key, updated);
    return updated;
  }
}

export const storage = new MemStorage();
