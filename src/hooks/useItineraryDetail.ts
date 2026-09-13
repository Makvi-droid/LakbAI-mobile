import { supabase } from "@/lib/supabase";
import type { Itinerary, SavedItineraryDay, SavedItineraryDetail } from "@/types/itinerary";
import { useCallback, useEffect, useState } from "react";

export function useItineraryDetail(itineraryId: string | undefined) {
    const [itinerary, setItinerary] = useState<SavedItineraryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDetail = useCallback(async () => {
        if (!itineraryId) return;
        setLoading(true);
        setError(null);

        try {
            const { data: itineraryRow, error: itinErr } = await supabase
                .from("itineraries")
                .select("*")
                .eq("itinerary_id", itineraryId)
                .single();
            if (itinErr) throw itinErr;

            const { data: detailRows, error: detailErr } = await supabase
                .from("itinerary_details")
                .select(
                    `
          detail_id,
          destination_id,
          day_number,
          visit_order,
          estimated_travel_time,
          activity_description,
          estimated_cost,
          destinations ( destination_name, destination_photos, region )
        `
                )
                .eq("itinerary_id", itineraryId)
                .order("day_number", { ascending: true })
                .order("visit_order", { ascending: true });
            if (detailErr) throw detailErr;

            const dayMap = new Map<number, SavedItineraryDay>();
            for (const row of (detailRows ?? []) as any[]) {
                const dest = row.destinations;
                const stop = {
                    detail_id: row.detail_id,
                    destination_id: row.destination_id,
                    destination_name: dest?.destination_name ?? `Destination #${row.destination_id}`,
                    destination_photo: dest?.destination_photos ?? null,
                    region: dest?.region ?? null,
                    day_number: row.day_number,
                    visit_order: row.visit_order,
                    estimated_travel_time: row.estimated_travel_time,
                    activity_description: row.activity_description,
                    estimated_cost: row.estimated_cost,
                };

                if (!dayMap.has(row.day_number)) {
                    dayMap.set(row.day_number, { day_number: row.day_number, stops: [] });
                }
                dayMap.get(row.day_number)!.stops.push(stop);
            }

            const days = Array.from(dayMap.values()).sort((a, b) => a.day_number - b.day_number);

            setItinerary({ ...(itineraryRow as Itinerary), days });
        } catch (e: any) {
            setError(e.message ?? "Failed to load itinerary");
        } finally {
            setLoading(false);
        }
    }, [itineraryId]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    return { itinerary, loading, error, refetch: fetchDetail };
}