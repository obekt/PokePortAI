import {
  users,
  cards,
  marketData,
  userProfiles,
  portfolioComments,
  portfolioLikes,
  type User,
  type UpsertUser,
  type Card,
  type InsertCard,
  type MarketData,
  type InsertMarketData,
  type UserProfile,
  type InsertUserProfile,
  type PortfolioComment,
  type InsertComment,
  type PortfolioLike,
  type InsertLike,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

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

  // Social features
  // User profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  upsertUserProfile(userId: string, data: InsertUserProfile): Promise<UserProfile>;
  getPublicProfiles(limit?: number): Promise<(UserProfile & { user: User, cardCount: number, totalValue: number })[]>;
  
  // Portfolio comments  
  getPortfolioComments(portfolioUserId: string): Promise<(PortfolioComment & { commenterName: string, commenterImage?: string })[]>;
  addComment(data: InsertComment): Promise<PortfolioComment>;
  deleteComment(commentId: string, userId: string): Promise<void>;
  
  // Portfolio likes
  toggleLike(portfolioUserId: string, likerUserId: string): Promise<{ liked: boolean }>;
  getPortfolioLikes(portfolioUserId: string): Promise<PortfolioLike[]>;
  isLikedByUser(portfolioUserId: string, userId: string): Promise<boolean>;
  
  // Portfolio views
  incrementPortfolioViews(portfolioUserId: string): Promise<void>;
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

  // Social features implementation
  
  // User profiles
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async upsertUserProfile(userId: string, data: InsertUserProfile): Promise<UserProfile> {
    const [profile] = await db
      .insert(userProfiles)
      .values({ ...data, userId })
      .onConflictDoUpdate({
        target: userProfiles.userId,
        set: {
          ...data,
          updatedAt: sql`now()`,
        },
      })
      .returning();
    return profile;
  }

  async getPublicProfiles(limit: number = 20): Promise<(UserProfile & { user: User, cardCount: number, totalValue: number })[]> {
    const result = await db
      .select({
        profile: userProfiles,
        user: users,
        cardCount: sql<number>`count(${cards.id})::int`,
        totalValue: sql<number>`coalesce(sum(${cards.estimatedValue}::numeric), 0)::int`,
      })
      .from(userProfiles)
      .leftJoin(users, eq(userProfiles.userId, users.id))
      .leftJoin(cards, eq(userProfiles.userId, cards.userId))
      .where(eq(userProfiles.isPublic, true))
      .groupBy(userProfiles.userId, users.id)
      .orderBy(desc(userProfiles.viewCount), desc(userProfiles.likeCount))
      .limit(limit);

    return result.map(row => ({
      ...row.profile,
      user: row.user,
      cardCount: row.cardCount,
      totalValue: row.totalValue,
    }));
  }

  // Portfolio comments
  async getPortfolioComments(portfolioUserId: string): Promise<(PortfolioComment & { commenterName: string, commenterImage?: string })[]> {
    const result = await db
      .select({
        comment: portfolioComments,
        commenterName: sql<string>`coalesce(${users.firstName} || ' ' || ${users.lastName}, ${users.email})`,
        commenterImage: users.profileImageUrl,
      })
      .from(portfolioComments)
      .leftJoin(users, eq(portfolioComments.commenterUserId, users.id))
      .where(eq(portfolioComments.portfolioUserId, portfolioUserId))
      .orderBy(desc(portfolioComments.createdAt));

    return result.map(row => ({
      ...row.comment,
      commenterName: row.commenterName,
      commenterImage: row.commenterImage || undefined,
    }));
  }

  async addComment(data: InsertComment): Promise<PortfolioComment> {
    const [comment] = await db
      .insert(portfolioComments)
      .values(data)
      .returning();
    return comment;
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    await db
      .delete(portfolioComments)
      .where(
        and(
          eq(portfolioComments.id, commentId),
          eq(portfolioComments.commenterUserId, userId)
        )
      );
  }

  // Portfolio likes
  async toggleLike(portfolioUserId: string, likerUserId: string): Promise<{ liked: boolean }> {
    // Check if like exists
    const [existingLike] = await db
      .select()
      .from(portfolioLikes)
      .where(
        and(
          eq(portfolioLikes.portfolioUserId, portfolioUserId),
          eq(portfolioLikes.likerUserId, likerUserId)
        )
      );

    if (existingLike) {
      // Remove like
      await db
        .delete(portfolioLikes)
        .where(
          and(
            eq(portfolioLikes.portfolioUserId, portfolioUserId),
            eq(portfolioLikes.likerUserId, likerUserId)
          )
        );
      
      // Decrement like count
      await db
        .update(userProfiles)
        .set({ likeCount: sql`${userProfiles.likeCount} - 1` })
        .where(eq(userProfiles.userId, portfolioUserId));
      
      return { liked: false };
    } else {
      // Add like
      await db
        .insert(portfolioLikes)
        .values({ portfolioUserId, likerUserId });
      
      // Increment like count
      await db
        .update(userProfiles)
        .set({ likeCount: sql`${userProfiles.likeCount} + 1` })
        .where(eq(userProfiles.userId, portfolioUserId));
      
      return { liked: true };
    }
  }

  async getPortfolioLikes(portfolioUserId: string): Promise<PortfolioLike[]> {
    return await db
      .select()
      .from(portfolioLikes)
      .where(eq(portfolioLikes.portfolioUserId, portfolioUserId));
  }

  async isLikedByUser(portfolioUserId: string, userId: string): Promise<boolean> {
    const [like] = await db
      .select()
      .from(portfolioLikes)
      .where(
        and(
          eq(portfolioLikes.portfolioUserId, portfolioUserId),
          eq(portfolioLikes.likerUserId, userId)
        )
      );
    return !!like;
  }

  // Portfolio views
  async incrementPortfolioViews(portfolioUserId: string): Promise<void> {
    await db
      .update(userProfiles)
      .set({ viewCount: sql`${userProfiles.viewCount} + 1` })
      .where(eq(userProfiles.userId, portfolioUserId));
  }
}

export const storage = new DatabaseStorage();
