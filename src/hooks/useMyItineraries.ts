import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { SavedItinerarySummary } from "@/types/itinerary";
import { useCallback, useEffect, useState } from "react";

export function useMyItineraries() {
    const { session } = useAuth();
    const user = session?.user ?? null;

    const [itineraries, setItineraries] = useState<SavedItinerarySummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItineraries = useCallback(async () => {
        if (!user) {
            setItineraries([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchErr } = await supabase
                .from("itineraries")
                .select(
                    `
          itinerary_id,
          title,
          start_date,
          end_date,
          total_budget,
          travel_type,
          generated_by_ai,
          itinerary_details (
            day_number,
            visit_order,
            destinations ( destination_name, destination_photos, region )
          )
        `
                )
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (fetchErr) throw fetchErr;

            const mapped: SavedItinerarySummary[] = (data ?? []).map((row: any) => {
                const stops = (row.itinerary_details ?? [])
                    .slice()
                    .sort((a: any, b: any) =>
                        a.day_number !== b.day_number ? a.day_number - b.day_number : a.visit_order - b.visit_order
                    );
                const cover = stops[0]?.destinations ?? null;

                return {
                    itinerary_id: row.itinerary_id,
                    title: row.title,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    total_budget: row.total_budget,
                    travel_type: row.travel_type,
                    generated_by_ai: row.generated_by_ai,
                    coverImage: cover?.destination_photos ?? null,
                    coverLocation: cover?.destination_name ?? cover?.region ?? null,
                };
            });

            setItineraries(mapped);
        } catch (e: any) {
            setError(e.message ?? "Failed to load your saved itineraries");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchItineraries();
    }, [fetchItineraries]);

    return { itineraries, loading, error, refetch: fetchItineraries };
}