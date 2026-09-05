import { useState } from "react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Itinerary, NewItineraryInput } from "@/types/itinerary";

interface UseCreateItineraryResult {
    createItinerary: (input: NewItineraryInput) => Promise<Itinerary | null>;
    loading: boolean;
    error: string | null;
}

export function useCreateItinerary(): UseCreateItineraryResult {
    const { session } = useAuth();
    const user = session?.user ?? null;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createItinerary = async (
        input: NewItineraryInput
    ): Promise<Itinerary | null> => {
        if (!user) {
            setError("You must be logged in to create an itinerary.");
            return null;
        }

        setLoading(true);
        setError(null);

        const { data, error: insertError } = await supabase
            .from("itineraries")
            .insert({
                user_id: user.id,
                title: input.title,
                start_date: input.start_date,
                end_date: input.end_date,
                total_budget: input.total_budget,
                travel_type: input.travel_type,
                generated_by_ai: false, // flip this on once AI generation is wired up
            })
            .select()
            .single();

        setLoading(false);

        if (insertError) {
            setError(insertError.message);
            return null;
        }

        return data as Itinerary;
    };

    return { createItinerary, loading, error };
}