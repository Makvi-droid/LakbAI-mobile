import { useState } from "react";
import { GeocodingFeature } from "../types/geocoding";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

export function useReverseGeocode() {
  const [loading, setLoading] = useState(false);

  const reverseGeocode = async (
    coordinate: [number, number]
  ): Promise<GeocodingFeature | null> => {
    setLoading(true);
    try {
      const [lng, lat] = coordinate;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&limit=1`;

      const response = await fetch(url);
      const json = await response.json();
      const feature = json.features?.[0];

      if (!feature) return null;

      return {
        id: feature.id,
        name: feature.text ?? feature.place_name,
        fullAddress: feature.place_name,
        placeType: feature.place_type?.[0] ?? "location",
        coordinate,
      };
    } catch (error) {
      console.error("Mapbox reverse geocoding error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { reverseGeocode, loading };
}