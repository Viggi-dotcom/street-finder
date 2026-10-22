"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";
import type { StallData } from "./StallCard";

interface RateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stall: StallData | null;
  onSubmit: (stallId: number, rating: number, reviewText: string) => Promise<void>;
}

export function RateModal({ isOpen, onClose, stall, onSubmit }: RateModalProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !stall) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(stall.id, rating, reviewText);
      setRating(0);
      setReviewText("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Rate Stall</h2>
            <button
              onClick={() => {
                setRating(0);
                setReviewText("");
                setError(null);
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="font-semibold text-gray-900">{stall.name}</p>
            <p className="text-sm text-gray-500">{stall.landmark}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex items-center gap-3">
                <StarRating value={rating} onChange={setRating} size={32} />
                {rating > 0 && (
                  <span className="text-lg font-bold text-amber-600">
                    {rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review (optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="e.g., Super crispy! Best vada pav near campus."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                {reviewText.length}/500 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Rating"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
