import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cards = pgTable("cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  set: text("set").notNull(),
  cardNumber: text("card_number").notNull(),
  condition: text("condition").notNull(),
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }).notNull(),
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

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
  createdAt: true,
});

export const updateCardSchema = insertCardSchema.partial();

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  lastUpdated: true,
});

export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type MarketData = typeof marketData.$inferSelect;
