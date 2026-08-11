export type CrowdLevel = "low" | "moderate" | "busy";

export interface MapSpot {
  id: string;
  name: string;
  description: string;
  image: string;
  crowd: CrowdLevel;
  category: "Beach" | "Heritage" | "Adventure" | "Cultural";
  region: "Luzon" | "Visayas" | "Mindanao";
  x: number; // % position on placeholder map, 0-100
  y: number;
}

export const CROWD_COLORS: Record<CrowdLevel, string> = {
  low: "#4ADE80",
  moderate: "#F5B942",
  busy: "#F87171",
};

export const mapSpots: MapSpot[] = [
  {
    id: "1",
    name: "Chocolate Hills",
    description:
      "Over 1,000 cone-shaped hills that turn brown in the dry season, giving them their chocolate-drop look.",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600",
    crowd: "moderate",
    category: "Adventure",
    region: "Visayas",
    x: 28,
    y: 26,
  },
  {
    id: "2",
    name: "Panglao Beach",
    description:
      "White sand beach known for calm, clear waters and easy access to nearby dive spots.",
    image: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=600",
    crowd: "moderate",
    category: "Beach",
    region: "Visayas",
    x: 38,
    y: 32,
  },
  {
    id: "3",
    name: "Vigan Heritage Village",
    description:
      "Cobblestone streets and Spanish colonial houses, one of the best-preserved historic towns in Asia.",
    image: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=600",
    crowd: "busy",
    category: "Heritage",
    region: "Luzon",
    x: 22,
    y: 48,
  },
  {
    id: "4",
    name: "Kawasan Falls",
    description:
      "Turquoise, multi-tiered waterfalls popular for canyoneering and cliff jumping.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600",
    crowd: "low",
    category: "Adventure",
    region: "Visayas",
    x: 62,
    y: 55,
  },
  {
    id: "5",
    name: "Cagayan de Oro River",
    description:
      "Whitewater rafting hub in Mindanao, with rapids suited to beginners and experienced paddlers alike.",
    image: "https://images.unsplash.com/photo-1530866495561-507c9faab8e7?w=600",
    crowd: "busy",
    category: "Adventure",
    region: "Mindanao",
    x: 70,
    y: 62,
  },
];
