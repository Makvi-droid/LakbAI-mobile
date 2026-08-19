export interface GeocodingFeature {
  id: string;
  name: string; // short label, e.g. "Banaue"
  fullAddress: string; // e.g. "Banaue, Ifugao, Philippines"
  placeType: string; // e.g. "place", "poi", "address" — Mapbox's own category
  coordinate: [number, number]; // [longitude, latitude]
}