import { z } from "zod";

export const createStallSchema = z.object({
  name: z.string().min(1).max(100),
  landmark: z.string().min(1).max(150),
  specialtyDish: z.string().min(1).max(100),
  cuisine: z.string().min(1).max(50).transform((v) => v.toLowerCase()),
  priceBand: z.enum(["₹", "₹₹", "₹₹₹"]).default("₹"),
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});

export const nearbyQuerySchema = z.object({
  lng: z.coerce.number().min(-180).max(180),
  lat: z.coerce.number().min(-90).max(90),
  maxDist: z.coerce.number().min(0).max(50000).default(2000),
  cuisine: z.string().optional().default("all"),
  minRating: z.coerce.number().min(0).max(5).optional(),
  priceBand: z.string().optional(),
  sort: z.enum(["distance", "rating"]).optional().default("distance"),
});

export const rateStallSchema = z.object({
  rating: z.number().min(0).max(5).multipleOf(0.5),
  reviewText: z.string().max(500).optional(),
});

export const topRatedQuerySchema = z.object({
  minReviews: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().min(1).max(50).default(10),
  cuisine: z.string().optional(),
});

export type CreateStallInput = z.infer<typeof createStallSchema>;
export type NearbyQuery = z.infer<typeof nearbyQuerySchema>;
export type RateStallInput = z.infer<typeof rateStallSchema>;
export type TopRatedQuery = z.infer<typeof topRatedQuerySchema>;
