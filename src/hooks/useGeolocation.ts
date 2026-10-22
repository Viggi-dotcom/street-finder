"use client";

import { useState, useCallback, useEffect } from "react";

const DEFAULT_COORDS = {
  lat: 19.076090,
  lng: 72.877426,
};

interface GeoLocation {
  lat: number;
  lng: number;
}

interface UseGeolocationReturn {
  location: GeoLocation;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
  refresh: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<GeoLocation>(DEFAULT_COORDS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLocation(DEFAULT_COORDS);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      setError("Location request timed out. Using default campus location.");
      setLocation(DEFAULT_COORDS);
      setLoading(false);
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setPermissionDenied(false);
        setLoading(false);
      },
      (err) => {
        clearTimeout(timeoutId);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setError("Location access denied. Showing stalls near Campus Main Gate.");
        } else {
          setError("Unable to get location. Using default campus location.");
        }
        setLocation(DEFAULT_COORDS);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000,
      }
    );
  }, []);

  useEffect(() => {
    // Invoke asynchronously to avoid cascading sync renders during effect phase
    const timer = setTimeout(() => {
      getPosition();
    }, 0);
    return () => clearTimeout(timer);
  }, [getPosition]);

  return {
    location,
    error,
    loading,
    permissionDenied,
    refresh: getPosition,
  };
}
