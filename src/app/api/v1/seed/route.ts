import { NextResponse } from "next/server";
import { db } from "@/db";
import { stalls } from "@/db/schema";
import { sql } from "drizzle-orm";

const SEED_STALLS = [
  {
    name: "Sharma Ji Vada Pav",
    landmark: "Opposite Gate 3, behind the banyan tree",
    specialtyDish: "Schezwan Cheese Vada Pav",
    cuisine: "chaat",
    priceBand: "₹",
    longitude: 72.8776,
    latitude: 19.0760,
    avgRating: 4.8,
    totalSum: 48,
    reviewCount: 10,
  },
  {
    name: "Raju Pav Bhaji Center",
    landmark: "Near Library parking, left side",
    specialtyDish: "Butter Pav Bhaji",
    cuisine: "chaat",
    priceBand: "₹₹",
    longitude: 72.8782,
    latitude: 19.0765,
    avgRating: 4.5,
    totalSum: 36,
    reviewCount: 8,
  },
  {
    name: "South Express Dosa",
    landmark: "Canteen Road, first stall on right",
    specialtyDish: "Mysore Masala Dosa",
    cuisine: "south indian",
    priceBand: "₹",
    longitude: 72.8790,
    latitude: 19.0755,
    avgRating: 4.2,
    totalSum: 21,
    reviewCount: 5,
  },
  {
    name: "Momos Junction",
    landmark: "Sports ground entrance, next to cycle stand",
    specialtyDish: "Tandoori Momos",
    cuisine: "momos",
    priceBand: "₹₹",
    longitude: 72.8770,
    latitude: 19.0770,
    avgRating: 4.6,
    totalSum: 46,
    reviewCount: 10,
  },
  {
    name: "Gupta Chai & Maggi",
    landmark: "Behind hostel block A, under the neem tree",
    specialtyDish: "Cheese Maggi with Chai",
    cuisine: "chai",
    priceBand: "₹",
    longitude: 72.8765,
    latitude: 19.0750,
    avgRating: 4.0,
    totalSum: 24,
    reviewCount: 6,
  },
  {
    name: "Fresh Juice Corner",
    landmark: "Main gate entrance, right side",
    specialtyDish: "Mixed Fruit Juice",
    cuisine: "juice",
    priceBand: "₹",
    longitude: 72.8780,
    latitude: 19.0745,
    avgRating: 3.8,
    totalSum: 19,
    reviewCount: 5,
  },
  {
    name: "Biryani House Express",
    landmark: "Opposite Engineering block, near bus stop",
    specialtyDish: "Chicken Dum Biryani",
    cuisine: "biryani",
    priceBand: "₹₹₹",
    longitude: 72.8795,
    latitude: 19.0780,
    avgRating: 4.7,
    totalSum: 47,
    reviewCount: 10,
  },
  {
    name: "Rolls & More",
    landmark: "Food court area, stall #5",
    specialtyDish: "Paneer Tikka Roll",
    cuisine: "rolls",
    priceBand: "₹₹",
    longitude: 72.8785,
    latitude: 19.0758,
    avgRating: 4.3,
    totalSum: 43,
    reviewCount: 10,
  },
  {
    name: "Campus Frankie Center",
    landmark: "Near Admin block, basement parking exit",
    specialtyDish: "Chicken Frankie",
    cuisine: "rolls",
    priceBand: "₹₹",
    longitude: 72.8772,
    latitude: 19.0762,
    avgRating: 4.1,
    totalSum: 28.7,
    reviewCount: 7,
  },
  {
    name: "Sweet Dreams Lassi",
    landmark: "Beside the old well, North campus",
    specialtyDish: "Kesar Badam Lassi",
    cuisine: "juice",
    priceBand: "₹",
    longitude: 72.8768,
    latitude: 19.0775,
    avgRating: 4.4,
    totalSum: 35.2,
    reviewCount: 8,
  },
];

export async function POST() {
  try {
    // Check if data already exists
    const existing = await db.execute(
      sql`SELECT count(*) as count FROM ${stalls}`
    );
    const count = Number(existing.rows[0].count);

    if (count > 0) {
      return NextResponse.json({
        message: `Database already has ${count} stalls. Skipping seed.`,
      });
    }

    await db.insert(stalls).values(SEED_STALLS);

    return NextResponse.json({
      message: `Seeded ${SEED_STALLS.length} stalls successfully.`,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
