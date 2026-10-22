import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stalls } from "@/db/schema";
import { nearbyQuerySchema } from "@/lib/validators";
import { sql } from "drizzle-orm";

// GET /api/v1/stalls/near?lng=72.87&lat=19.07&maxDist=2000&cuisine=all&minRating=0&sort=distance
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const parsed = nearbyQuerySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { lng, lat, maxDist, cuisine, minRating, priceBand, sort } =
      parsed.data;

    // Use Haversine formula in SQL for accurate distance calculation
    // Earth radius = 6371000 meters
    const distanceExpr = sql<number>`(
      6371000 * acos(
        cos(radians(${lat})) * cos(radians(${stalls.latitude})) *
        cos(radians(${stalls.longitude}) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(${stalls.latitude}))
      )
    )`;

    // Build WHERE conditions
    const conditions = [sql`${distanceExpr} <= ${maxDist}`];

    if (cuisine && cuisine !== "all") {
      conditions.push(sql`${stalls.cuisine} = ${cuisine.toLowerCase()}`);
    }

    if (minRating !== undefined && minRating > 0) {
      conditions.push(sql`${stalls.avgRating} >= ${minRating}`);
    }

    if (priceBand && priceBand !== "all") {
      conditions.push(sql`${stalls.priceBand} = ${priceBand}`);
    }

    const whereClause = sql.join(conditions, sql` AND `);

    const orderBy =
      sort === "rating"
        ? sql`${stalls.avgRating} DESC`
        : sql`${distanceExpr} ASC`;

    const results = await db.execute(sql`
      SELECT
        ${stalls.id} as id,
        ${stalls.name} as name,
        ${stalls.landmark} as landmark,
        ${stalls.specialtyDish} as "specialtyDish",
        ${stalls.cuisine} as cuisine,
        ${stalls.priceBand} as "priceBand",
        ${stalls.longitude} as longitude,
        ${stalls.latitude} as latitude,
        ${stalls.avgRating} as "avgRating",
        ${stalls.totalSum} as "totalSum",
        ${stalls.reviewCount} as "reviewCount",
        ${stalls.createdAt} as "createdAt",
        ${distanceExpr} as "distanceMeters"
      FROM ${stalls}
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT 50
    `);

    return NextResponse.json(results.rows);
  } catch (error) {
    console.error("Error fetching nearby stalls:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
