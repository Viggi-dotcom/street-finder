import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stalls } from "@/db/schema";
import { topRatedQuerySchema } from "@/lib/validators";
import { desc, gte, eq, and } from "drizzle-orm";

// GET /api/v1/stalls/top-rated?minReviews=5&limit=10&cuisine=chaat
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const parsed = topRatedQuerySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { minReviews, limit, cuisine } = parsed.data;

    const conditions = [];

    if (minReviews > 0) {
      conditions.push(gte(stalls.reviewCount, minReviews));
    }

    if (cuisine && cuisine !== "all") {
      conditions.push(eq(stalls.cuisine, cuisine.toLowerCase()));
    }

    const whereClause =
      conditions.length === 0
        ? undefined
        : conditions.length === 1
          ? conditions[0]
          : and(...conditions);

    const results = await db
      .select()
      .from(stalls)
      .where(whereClause)
      .orderBy(desc(stalls.avgRating), desc(stalls.reviewCount))
      .limit(limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching top-rated stalls:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
