"use client";

import { RatingDisplay } from "./StarRating";
import { formatDistance, estimateWalkTime } from "@/lib/geo";

export interface StallData {
  id: number;
  name: string;
  landmark: string;
  specialtyDish: string;
  cuisine: string;
  priceBand: string;
  longitude: number;
  latitude: number;
  avgRating: number;
  totalSum: number;
  reviewCount: number;
  distanceMeters?: number;
}

interface StallCardProps {
  stall: StallData;
  onRate: (stall: StallData) => void;
}

const CUISINE_COLORS: Record<string, string> = {
  chaat: "bg-orange-100 text-orange-700 border-orange-200",
  "south indian": "bg-green-100 text-green-700 border-green-200",
  momos: "bg-red-100 text-red-700 border-red-200",
  chai: "bg-amber-100 text-amber-700 border-amber-200",
  juice: "bg-lime-100 text-lime-700 border-lime-200",
  biryani: "bg-yellow-100 text-yellow-700 border-yellow-200",
  rolls: "bg-purple-100 text-purple-700 border-purple-200",
  "vada pav": "bg-orange-100 text-orange-700 border-orange-200",
};

const CUISINE_EMOJIS: Record<string, string> = {
  chaat: "🍽️",
  "south indian": "🥘",
  momos: "🥟",
  chai: "☕",
  juice: "🧃",
  biryani: "🍛",
  rolls: "🌯",
  "vada pav": "🍔",
};

function CuisineBadge({ cuisine }: { cuisine: string }) {
  const colorClass =
    CUISINE_COLORS[cuisine] || "bg-gray-100 text-gray-700 border-gray-200";
  const emoji = CUISINE_EMOJIS[cuisine] || "🍴";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
    >
      <span>{emoji}</span>
      {cuisine}
    </span>
  );
}

function PriceBand({ band }: { band: string }) {
  const level = band === "₹₹₹" ? 3 : band === "₹₹" ? 2 : 1;
  return (
    <span className="inline-flex items-center gap-0.5 text-sm" title={`Price: ${band}`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={i <= level ? "text-green-600 font-semibold" : "text-gray-300"}
        >
          ₹
        </span>
      ))}
    </span>
  );
}

export function StallCard({ stall, onRate }: StallCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base truncate">
            {stall.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <svg
              className="w-3 h-3 text-gray-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{stall.landmark}</span>
          </p>
        </div>
        <PriceBand band={stall.priceBand} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <CuisineBadge cuisine={stall.cuisine} />
        {stall.distanceMeters !== undefined && (
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
            📍 {formatDistance(stall.distanceMeters)} · {estimateWalkTime(stall.distanceMeters)}
          </span>
        )}
      </div>

      <div className="bg-amber-50 rounded-lg p-2 mb-3">
        <p className="text-sm font-medium text-amber-800">
          ⭐ Signature: <span className="font-semibold">{stall.specialtyDish}</span>
        </p>
      </div>

      <div className="flex items-center justify-between">
        <RatingDisplay
          rating={stall.avgRating}
          reviewCount={stall.reviewCount}
        />
        <button
          onClick={() => onRate(stall)}
          className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          Rate
        </button>
      </div>
    </div>
  );
}
