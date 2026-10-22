import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stalls, reviews } from "@/db/schema";
import { rateStallSchema } from "@/lib/validators";
import { eq, sql } from "drizzle-orm";

// POST /api/v1/stalls/:id/rate - Submit star rating with atomic update
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid stall ID" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = rateStallSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { rating, reviewText } = parsed.data;

    // Check if stall exists
    const [existingStall] = await db
      .select()
      .from(stalls)
      .where(eq(stalls.id, id))
      .limit(1);

    if (!existingStall) {
      return NextResponse.json({ error: "Stall not found" }, { status: 404 });
    }

    // Insert the review
    await db.insert(reviews).values({
      stallId: id,
      rating,
      reviewText: reviewText || null,
    });

    // Atomic update of rating stats
    const [updatedStall] = await db
      .update(stalls)
      .set({
        totalSum: sql`${stalls.totalSum} + ${rating}`,
        reviewCount: sql`${stalls.reviewCount} + 1`,
        avgRating: sql`(${stalls.totalSum} + ${rating}) / (${stalls.reviewCount} + 1)`,
        updatedAt: new Date(),
      })
      .where(eq(stalls.id, id))
      .returning();

    return NextResponse.json({
      id: updatedStall.id,
      ratingStats: {
        avgRating: Math.round(updatedStall.avgRating * 100) / 100,
        totalSum: updatedStall.totalSum,
        reviewCount: updatedStall.reviewCount,
      },
    });
  } catch (error) {
    console.error("Error rating stall:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
