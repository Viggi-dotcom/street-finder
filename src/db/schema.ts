import {
  pgTable,
  serial,
  varchar,
  text,
  doublePrecision,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const stalls = pgTable(
  "stalls",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    landmark: varchar("landmark", { length: 150 }).notNull(),
    specialtyDish: varchar("specialty_dish", { length: 100 }).notNull(),
    cuisine: varchar("cuisine", { length: 50 }).notNull(),
    priceBand: varchar("price_band", { length: 5 }).notNull().default("₹"),
    longitude: doublePrecision("longitude").notNull(),
    latitude: doublePrecision("latitude").notNull(),
    avgRating: doublePrecision("avg_rating").notNull().default(0),
    totalSum: doublePrecision("total_sum").notNull().default(0),
    reviewCount: integer("review_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_stalls_cuisine").on(table.cuisine),
    index("idx_stalls_avg_rating").on(table.avgRating),
    index("idx_stalls_lat_lng").on(table.latitude, table.longitude),
  ]
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    stallId: integer("stall_id")
      .notNull()
      .references(() => stalls.id, { onDelete: "cascade" }),
    rating: doublePrecision("rating").notNull(),
    reviewText: text("review_text"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_reviews_stall_id").on(table.stallId)]
);

export type Stall = typeof stalls.$inferSelect;
export type NewStall = typeof stalls.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
