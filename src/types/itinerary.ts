export type TravelType = "Solo" | "Couple" | "Family" | "Group";

// Mirrors the `itineraries` table in Supabase
export interface Itinerary {
    itinerary_id: string;
    user_id: string;
    title: string;
    start_date: string; // date, e.g. "2026-09-20"
    end_date: string;
    total_budget: number;
    travel_type: TravelType;
    generated_by_ai: boolean;
    created_at: string;
}

// Fields the calendar screen needs to supply when creating a new one
export interface NewItineraryInput {
    title: string;
    start_date: string;
    end_date: string;
    total_budget: number;
    travel_type: TravelType;
}