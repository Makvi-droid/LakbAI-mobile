export interface SavedDestination {
    saved_id: number;
    user_id: string;
    destination_id: number;
    created_at: string;
}

// Joined shape for the profile page list
export interface SavedDestinationSummary {
    destination_id: number;
    destination_name: string;
    region: string;
    category: string;
    crowd_level: string;
    destination_photos: string[];
}