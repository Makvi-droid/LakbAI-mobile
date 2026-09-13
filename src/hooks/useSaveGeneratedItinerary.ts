import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type {
    AIItineraryOption,
    Itinerary,
    ItineraryGenerationParams,
} from "@/types/itinerary";
import { useState } from "react";

export function useSaveGeneratedItinerary() {
    const { session } = useAuth();
    const user = session?.user ?? null;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const save = async (
        option: AIItineraryOption,
        params: ItineraryGenerationParams
    ): Promise<Itinerary | null> => {
        if (!user) {
            setError("You must be logged in to save an itinerary.");
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const { data: itinerary, error: insertErr } = await supabase
                .from("itineraries")
                .insert({
                    user_id: user.id,
                    title: option.option_title,
                    start_date: params.startDate,
                    end_date: params.endDate,
                    total_budget: params.totalBudgetMax,
                    travel_type: params.travelType,
                    generated_by_ai: true,
                    interests: params.interests,
                    preferred_activities: params.activities,
                    quotation_breakdown: option.quotation,
                })
                .select()
                .single();

            if (insertErr) throw insertErr;

            const detailRows = option.days.flatMap((day) =>
                day.stops.map((stop) => ({
                    itinerary_id: itinerary.itinerary_id,
                    destination_id: stop.destination_id,
                    day_number: day.day_number,
                    visit_order: stop.visit_order,
                    estimated_travel_time: stop.estimated_travel_time,
                    activity_description: stop.activity_description,
                    estimated_cost: stop.estimated_cost,
                }))
            );

            if (detailRows.length > 0) {
                const { error: detailErr } = await supabase.from("itinerary_details").insert(detailRows);
                if (detailErr) throw detailErr;
            }

            return itinerary as Itinerary;
        } catch (e: any) {
            setError(e.message ?? "Failed to save itinerary");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { save, loading, error };
}