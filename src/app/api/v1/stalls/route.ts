import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stalls } from "@/db/schema";
import { createStallSchema } from "@/lib/validators";

// POST /api/v1/stalls - Register a new street food stall
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createStallSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, landmark, specialtyDish, cuisine, priceBand, lng, lat } =
      parsed.data;

    const [newStall] = await db
      .insert(stalls)
      .values({
        name,
        landmark,
        specialtyDish,
        cuisine,
        priceBand,
        longitude: lng,
        latitude: lat,
      })
      .returning();

    return NextResponse.json(newStall, { status: 201 });
  } catch (error) {
    console.error("Error creating stall:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/v1/stalls - List all stalls (simple list)
export async function GET() {
  try {
    const allStalls = await db.select().from(stalls);
    return NextResponse.json(allStalls);
  } catch (error) {
    console.error("Error fetching stalls:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
