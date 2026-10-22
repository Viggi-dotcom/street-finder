/**
 * Haversine formula for calculating distance between two GPS coordinates.
 * Returns distance in meters.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Format distance in meters to a human-readable string.
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m away`;
  }
  return `${(meters / 1000).toFixed(1)}km away`;
}

/**
 * Estimate walking time from distance in meters.
 * Average walking speed: ~80m/min
 */
export function estimateWalkTime(meters: number): string {
  const minutes = Math.ceil(meters / 80);
  if (minutes < 1) return "< 1 min walk";
  if (minutes === 1) return "1 min walk";
  return `${minutes} min walk`;
}

// Default campus centroid (Mumbai campus area)
export const DEFAULT_COORDS = {
  lat: 19.076090,
  lng: 72.877426,
};
