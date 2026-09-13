export type TravelType = "Solo" | "Couple" | "Family" | "Group";

// Used only to estimate traveler count from travel_type — not stored as a column.
export const TRAVELER_COUNT_BY_TYPE: Record<TravelType, number> = {
    Solo: 1,
    Couple: 2,
    Family: 4,
    Group: 6,
};

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
    interests: string[] | null;
    preferred_activities: string[] | null;
    quotation_breakdown: AIItineraryQuotation | null;
    created_at: string;
}

// Fields the calendar screen needs to supply when creating a new one manually
export interface NewItineraryInput {
    title: string;
    start_date: string;
    end_date: string;
    total_budget: number;
    travel_type: TravelType;
}

// Mirrors `itinerary_details`
export interface ItineraryDetail {
    detail_id: string;
    itinerary_id: string;
    destination_id: number;
    day_number: number;
    visit_order: number;
    estimated_travel_time: number | null;
    activity_description: string;
    estimated_cost: number | null;
    created_at: string;
}

// --- AI generation types (not DB tables — these are Gemini's structured output) ---

export interface AIItineraryStop {
    destination_id: number;
    destination_name?: string; // joined client-side after generation, for display
    destination_photo?: string | null;
    visit_order: number;
    estimated_travel_time: number | null;
    activity_description: string;
    estimated_cost: number;
}

export interface AIItineraryDay {
    day_number: number;
    stops: AIItineraryStop[];
}

export interface AIQuotationBreakdownItem {
    category: string;
    amount: number;
}

export interface AIItineraryQuotation {
    currency: string;
    per_traveler_cost: number;
    total_cost: number;
    breakdown: AIQuotationBreakdownItem[];
}

export interface AIItineraryOption {
    option_title: string;
    summary: string;
    days: AIItineraryDay[];
    quotation: AIItineraryQuotation;
}

// Form inputs collected on the calendar screen before generating
export interface ItineraryGenerationParams {
    startDate: string;
    endDate: string;
    travelType: TravelType;
    totalBudgetMax: number;
    interests: string[];
    activities: string[];
}


// --- Saved itinerary types (for viewing/listing what's already in the DB) ---

export interface SavedItinerarySummary {
    itinerary_id: string;
    title: string;
    start_date: string;
    end_date: string;
    total_budget: number;
    travel_type: TravelType;
    generated_by_ai: boolean;
    coverImage: string | null;
    coverLocation: string | null;
}

export interface SavedItineraryStop {
    detail_id: string;
    destination_id: number;
    destination_name: string;
    destination_photo: string | null;
    region: string | null;
    day_number: number;
    visit_order: number;
    estimated_travel_time: number | null;
    activity_description: string;
    estimated_cost: number | null;
}

export interface SavedItineraryDay {
    day_number: number;
    stops: SavedItineraryStop[];
}

export interface SavedItineraryDetail extends Itinerary {
    days: SavedItineraryDay[];
}