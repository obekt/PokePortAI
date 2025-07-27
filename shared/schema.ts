import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb, index, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cards = pgTable("cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  set: text("set").notNull(),
  cardNumber: text("card_number").notNull(),
  condition: text("condition").notNull(),
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }).notNull(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).default("0"),
  imageUrl: text("image_url"),
  recognitionData: jsonb("recognition_data"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardName: text("card_name").notNull(),
  set: text("set").notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  priceChange: decimal("price_change", { precision: 5, scale: 2 }),
  lastUpdated: timestamp("last_updated").default(sql`now()`).notNull(),
});

// User profiles for public portfolios
export const userProfiles = pgTable("user_profiles", {
  userId: varchar("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  displayName: varchar("display_name"),
  bio: text("bio"),
  isPublic: boolean("is_public").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

// Portfolio comments
export const portfolioComments = pgTable("portfolio_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioUserId: varchar("portfolio_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  commenterUserId: varchar("commenter_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Portfolio likes/favorites
export const portfolioLikes = pgTable("portfolio_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioUserId: varchar("portfolio_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  likerUserId: varchar("liker_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
}, (table) => [
  index("portfolio_likes_unique").on(table.portfolioUserId, table.likerUserId),
]);

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export const updateCardSchema = insertCardSchema.partial();

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  lastUpdated: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  likeCount: true,
});

export const insertCommentSchema = createInsertSchema(portfolioComments).omit({
  id: true,
  createdAt: true,
});

export const insertLikeSchema = createInsertSchema(portfolioLikes).omit({
  id: true,
  createdAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type MarketData = typeof marketData.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type PortfolioComment = typeof portfolioComments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type PortfolioLike = typeof portfolioLikes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;
