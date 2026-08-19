import { useEffect, useRef, useState } from "react";
import { GeocodingFeature } from "../types/geocoding";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 3;

function mapFeature(feature: any): GeocodingFeature {
  return {
    id: feature.id,
    name: feature.text ?? feature.place_name,
    fullAddress: feature.place_name,
    placeType: feature.place_type?.[0] ?? "location",
    coordinate: feature.center,
  };
}

export function useMapboxSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.trim().length < MIN_QUERY_LENGTH) {
      setResults([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_TOKEN}&country=PH&limit=5`;

        const response = await fetch(url);
        const json = await response.json();

        setResults((json.features ?? []).map(mapFeature));
      } catch (error) {
        console.error("Mapbox geocoding error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  const clearResults = () => setResults([]);

  return { query, setQuery, results, loading, clearResults };
}