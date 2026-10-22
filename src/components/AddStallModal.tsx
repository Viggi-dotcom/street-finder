"use client";

import { useState } from "react";

interface AddStallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StallFormData) => Promise<void>;
  userLat: number;
  userLng: number;
}

export interface StallFormData {
  name: string;
  landmark: string;
  specialtyDish: string;
  cuisine: string;
  priceBand: string;
  lat: number;
  lng: number;
}

const CUISINE_OPTIONS = [
  "chaat",
  "south indian",
  "momos",
  "chai",
  "juice",
  "biryani",
  "rolls",
  "vada pav",
];

export function AddStallModal({
  isOpen,
  onClose,
  onSubmit,
  userLat,
  userLng,
}: AddStallModalProps) {
  const [formData, setFormData] = useState<StallFormData>({
    name: "",
    landmark: "",
    specialtyDish: "",
    cuisine: "chaat",
    priceBand: "₹",
    lat: userLat,
    lng: userLng,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        landmark: "",
        specialtyDish: "",
        cuisine: "chaat",
        priceBand: "₹",
        lat: userLat,
        lng: userLng,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add stall");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          lat: Math.round(pos.coords.latitude * 1000000) / 1000000,
          lng: Math.round(pos.coords.longitude * 1000000) / 1000000,
        }));
      },
      () => {
        setError("Could not get your location");
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              📍 Add New Stall
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stall Name *
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Sharma Ji Vada Pav"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landmark *
              </label>
              <input
                type="text"
                required
                maxLength={150}
                value={formData.landmark}
                onChange={(e) =>
                  setFormData({ ...formData, landmark: e.target.value })
                }
                placeholder="e.g., Opposite Gate 3, behind banyan tree"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signature Dish *
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={formData.specialtyDish}
                onChange={(e) =>
                  setFormData({ ...formData, specialtyDish: e.target.value })
                }
                placeholder="e.g., Schezwan Cheese Vada Pav"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisine *
                </label>
                <select
                  value={formData.cuisine}
                  onChange={(e) =>
                    setFormData({ ...formData, cuisine: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none"
                >
                  {CUISINE_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <select
                  value={formData.priceBand}
                  onChange={(e) =>
                    setFormData({ ...formData, priceBand: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none"
                >
                  <option value="₹">₹ Budget (under ₹50)</option>
                  <option value="₹₹">₹₹ Mid (₹50-100)</option>
                  <option value="₹₹₹">₹₹₹ Premium (₹100+)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPS Coordinates
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.000001"
                  required
                  value={formData.lat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lat: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Latitude"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none"
                />
                <input
                  type="number"
                  step="0.000001"
                  required
                  value={formData.lng}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lng: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Longitude"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Use my current location
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {submitting ? "Adding..." : "Add Stall"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
