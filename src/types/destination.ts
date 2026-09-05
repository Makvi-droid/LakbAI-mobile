export type SupabaseCrowdLevel = "low" | "medium" | "high";

export interface DestinationRecord {
  destination_id: number;
  destination_name: string;
  region: string;
  category: string;
  crowd_level: SupabaseCrowdLevel;
  description: string;
  latitude: number;
  longitude: number;
  destination_photos: string[];
  immersive_support: boolean;
  max_capacity: number;
}