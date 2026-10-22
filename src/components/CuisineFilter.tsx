"use client";

const CUISINES = [
  { value: "all", label: "All", emoji: "🍽️" },
  { value: "chaat", label: "Chaat", emoji: "🍽️" },
  { value: "south indian", label: "South Indian", emoji: "🥘" },
  { value: "momos", label: "Momos", emoji: "🥟" },
  { value: "chai", label: "Chai", emoji: "☕" },
  { value: "juice", label: "Juice", emoji: "🧃" },
  { value: "biryani", label: "Biryani", emoji: "🍛" },
  { value: "rolls", label: "Rolls", emoji: "🌯" },
  { value: "vada pav", label: "Vada Pav", emoji: "🍔" },
];

const PRICE_BANDS = [
  { value: "all", label: "All Prices" },
  { value: "₹", label: "₹ Budget" },
  { value: "₹₹", label: "₹₹ Mid" },
  { value: "₹₹₹", label: "₹₹₹ Premium" },
];

interface FilterBarProps {
  cuisine: string;
  onCuisineChange: (cuisine: string) => void;
  priceBand: string;
  onPriceBandChange: (band: string) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  sortBy: "distance" | "rating";
  onSortChange: (sort: "distance" | "rating") => void;
}

export function FilterBar({
  cuisine,
  onCuisineChange,
  priceBand,
  onPriceBandChange,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Cuisine pills */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Cuisine
        </p>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <button
              key={c.value}
              onClick={() => onCuisineChange(c.value)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                cuisine === c.value
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300 hover:bg-amber-50"
              }`}
            >
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Price band */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">Budget:</span>
          <div className="flex gap-1">
            {PRICE_BANDS.map((p) => (
              <button
                key={p.value}
                onClick={() => onPriceBandChange(p.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  priceBand === p.value
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Min rating */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            Min Rating:
          </span>
          <select
            value={minRating}
            onChange={(e) => onMinRatingChange(Number(e.target.value))}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none"
          >
            <option value={0}>Any ⭐</option>
            <option value={3}>≥ 3.0 ⭐</option>
            <option value={3.5}>≥ 3.5 ⭐</option>
            <option value={4}>≥ 4.0 ⭐</option>
            <option value={4.5}>≥ 4.5 ⭐</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">Sort:</span>
          <div className="flex gap-1">
            <button
              onClick={() => onSortChange("distance")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                sortBy === "distance"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
              }`}
            >
              📍 Nearest
            </button>
            <button
              onClick={() => onSortChange("rating")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                sortBy === "rating"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
              }`}
            >
              ⭐ Top Rated
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
