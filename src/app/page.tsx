"use client";

import { useState, useEffect, useCallback } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { StallCard, type StallData } from "@/components/StallCard";
import { FilterBar } from "@/components/CuisineFilter";
import { AddStallModal, type StallFormData } from "@/components/AddStallModal";
import { RateModal } from "@/components/RateModal";

export default function HomePage() {
  const { location, error: geoError, loading: geoLoading, permissionDenied } = useGeolocation();

  const [stalls, setStalls] = useState<StallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [cuisine, setCuisine] = useState("all");
  const [priceBand, setPriceBand] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");
  const [maxDist, setMaxDist] = useState(5000);

  // Modals
  const [showAddStall, setShowAddStall] = useState(false);
  const [ratingStall, setRatingStall] = useState<StallData | null>(null);
  const [seeded, setSeeded] = useState(false);

  // Seed data on first load
  useEffect(() => {
    if (seeded) return;
    fetch("/api/v1/seed", { method: "POST" })
      .then(() => setSeeded(true))
      .catch(() => setSeeded(true));
  }, [seeded]);

  // Fetch nearby stalls
  const fetchStalls = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        maxDist: maxDist.toString(),
        cuisine,
        sort: sortBy,
      });

      if (minRating > 0) {
        params.set("minRating", minRating.toString());
      }

      if (priceBand !== "all") {
        params.set("priceBand", priceBand);
      }

      const res = await fetch(`/api/v1/stalls/near?${params}`);
      if (!res.ok) throw new Error("Failed to fetch stalls");

      const data = await res.json();
      setStalls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stalls");
    } finally {
      setLoading(false);
    }
  }, [location, cuisine, priceBand, minRating, sortBy, maxDist]);

  useEffect(() => {
    if (!geoLoading && seeded) {
      const timer = setTimeout(() => {
        fetchStalls();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [geoLoading, seeded, fetchStalls]);

  // Add stall handler
  const handleAddStall = async (data: StallFormData) => {
    const res = await fetch("/api/v1/stalls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        landmark: data.landmark,
        specialtyDish: data.specialtyDish,
        cuisine: data.cuisine,
        priceBand: data.priceBand,
        lat: data.lat,
        lng: data.lng,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add stall");
    }

    fetchStalls();
  };

  // Rate stall handler
  const handleRate = async (
    stallId: number,
    rating: number,
    reviewText: string
  ) => {
    const res = await fetch(`/api/v1/stalls/${stallId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, reviewText: reviewText || undefined }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit rating");
    }

    fetchStalls();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🍜</span>
                Street Food Finder
                <span className="text-amber-500">&</span>
                Rater
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Hyper-local campus street food discovery
              </p>
            </div>
            <button
              onClick={() => setShowAddStall(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Stall
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Location Banner */}
        {(geoError || permissionDenied) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {geoError}
          </div>
        )}

        {/* Search radius */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500 uppercase">Radius:</span>
          <div className="flex gap-1">
            {[
              { value: 500, label: "500m" },
              { value: 1000, label: "1km" },
              { value: 2000, label: "2km" },
              { value: 5000, label: "5km" },
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => setMaxDist(r.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  maxDist === r.value
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/50 shadow-sm">
          <FilterBar
            cuisine={cuisine}
            onCuisineChange={setCuisine}
            priceBand={priceBand}
            onPriceBandChange={setPriceBand}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600">
            {loading ? (
              "Searching nearby stalls..."
            ) : (
              <>
                Found{" "}
                <span className="font-semibold text-gray-900">
                  {stalls.length}
                </span>{" "}
                stall{stalls.length !== 1 ? "s" : ""} within{" "}
                {maxDist >= 1000 ? `${maxDist / 1000}km` : `${maxDist}m`}
              </>
            )}
          </p>
          <button
            onClick={fetchStalls}
            disabled={loading}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
          >
            <svg
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Stall Cards */}
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-amber-50 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : stalls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-lg font-semibold text-gray-700">
              No stalls found
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Try expanding the search radius or adjusting your filters.
            </p>
            <button
              onClick={() => setShowAddStall(true)}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Be the first to add a stall!
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {stalls.map((stall) => (
              <StallCard
                key={stall.id}
                stall={stall}
                onRate={setRatingStall}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddStallModal
        isOpen={showAddStall}
        onClose={() => setShowAddStall(false)}
        onSubmit={handleAddStall}
        userLat={location.lat}
        userLng={location.lng}
      />

      <RateModal
        isOpen={ratingStall !== null}
        onClose={() => setRatingStall(null)}
        stall={ratingStall}
        onSubmit={handleRate}
      />

      {/* Footer */}
      <footer className="mt-8 py-6 border-t border-amber-100 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400">
            Street Food Finder & Rater · v1.0.0 · Crowdsourced hyper-local street food discovery
          </p>
        </div>
      </footer>
    </div>
  );
}
