import {
  users,
  cards,
  marketData,
  type User,
  type UpsertUser,
  type Card,
  type InsertCard,
  type MarketData,
  type InsertMarketData,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Card operations
  getCard(id: string): Promise<Card | undefined>;
  getAllCards(userId: string): Promise<Card[]>;
  createCard(userId: string, card: InsertCard): Promise<Card>;
  updateCard(id: string, updates: Partial<InsertCard>): Promise<Card | undefined>;
  deleteCard(id: string): Promise<boolean>;
  
  // Market data operations
  getMarketData(cardName: string, set: string): Promise<MarketData | undefined>;
  getAllMarketData(): Promise<MarketData[]>;
  createMarketData(data: InsertMarketData): Promise<MarketData>;
  updateMarketData(id: string, updates: Partial<InsertMarketData>): Promise<MarketData | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Card operations
  async getCard(id: string): Promise<Card | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    return card;
  }

  async getAllCards(userId: string): Promise<Card[]> {
    return await db.select().from(cards).where(eq(cards.userId, userId));
  }

  async createCard(userId: string, cardData: InsertCard): Promise<Card> {
    const [newCard] = await db
      .insert(cards)
      .values({
        ...cardData,
        userId,
      })
      .returning();
    return newCard;
  }

  async updateCard(id: string, updates: Partial<InsertCard>): Promise<Card | undefined> {
    const [updatedCard] = await db
      .update(cards)
      .set(updates)
      .where(eq(cards.id, id))
      .returning();
    return updatedCard;
  }

  async deleteCard(id: string): Promise<boolean> {
    const result = await db.delete(cards).where(eq(cards.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Market data operations
  async getMarketData(cardName: string, set: string): Promise<MarketData | undefined> {
    const [data] = await db
      .select()
      .from(marketData)
      .where(eq(marketData.cardName, cardName));
    return data;
  }

  async getAllMarketData(): Promise<MarketData[]> {
    return await db.select().from(marketData);
  }

  async createMarketData(insertData: InsertMarketData): Promise<MarketData> {
    const [newData] = await db
      .insert(marketData)
      .values(insertData)
      .returning();
    return newData;
  }

  async updateMarketData(id: string, updates: Partial<InsertMarketData>): Promise<MarketData | undefined> {
    const [updatedData] = await db
      .update(marketData)
      .set(updates)
      .where(eq(marketData.id, id))
      .returning();
    return updatedData;
  }
}

export const storage = new DatabaseStorage();
