import { CrowdLevel, MapSpot } from "../constants/mapSpots";
import { DestinationRecord } from "../types/destination";

const CROWD_MAP: Record<string, CrowdLevel> = {
    low: "low",
    medium: "moderate",
    high: "busy",
};

const PLACEHOLDER_IMAGE =
    "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=600";

export function toMapSpot(destination: DestinationRecord): MapSpot {
    return {
        id: String(destination.destination_id),
        name: destination.destination_name,
        description: destination.description,
        image: destination.destination_photos[0] ?? PLACEHOLDER_IMAGE,
        crowd: CROWD_MAP[destination.crowd_level] ?? "low",
        // real region/category are free text ("Cordillera", "Heritage"),
        // MapSpot's types are narrower unions — cast, since SpotDetailSheet
        // only renders these as plain text and doesn't branch on them.
        category: destination.category as MapSpot["category"],
        region: destination.region as MapSpot["region"],
        x: 0,
        y: 0,
    };
}