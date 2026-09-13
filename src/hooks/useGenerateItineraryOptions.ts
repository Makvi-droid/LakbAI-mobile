import { generateItineraryOptions } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import type { AIItineraryOption, ItineraryGenerationParams } from "@/types/itinerary";
import { useCallback, useState } from "react";

export function useGenerateItineraryOptions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [options, setOptions] = useState<AIItineraryOption[] | null>(null);

    const generate = useCallback(async (params: ItineraryGenerationParams) => {
        setLoading(true);
        setError(null);
        setOptions(null);

        try {
            // Pull a reasonable pool of real destinations for Gemini to choose from.
            // Prioritize ones matching the selected interest categories, if any.
            let query = supabase
                .from("destinations")
                .select("destination_id, destination_name, region, category, description")
                .limit(60);

            if (params.interests.length > 0) {
                query = query.in("category", params.interests);
            }

            const { data: matched, error: matchErr } = await query;
            if (matchErr) throw matchErr;

            let candidates = matched ?? [];

            // Fallback: if interest-filtered results are too thin, pull a general pool too.
            if (candidates.length < 8) {
                const { data: general, error: generalErr } = await supabase
                    .from("destinations")
                    .select("destination_id, destination_name, region, category, description")
                    .limit(60);
                if (generalErr) throw generalErr;
                const seen = new Set(candidates.map((c) => c.destination_id));
                candidates = [...candidates, ...(general ?? []).filter((d) => !seen.has(d.destination_id))];
            }

            const result = await generateItineraryOptions(params, candidates);
            setOptions(result);
            return result;
        } catch (e: any) {
            setError(e.message ?? "Failed to generate itinerary options");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setOptions(null);
        setError(null);
    }, []);

    return { generate, reset, loading, error, options };
}