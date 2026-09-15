import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { SavedDestinationSummary } from "@/types/savedDestination";
import { useCallback, useEffect, useState } from "react";

export function useSavedDestinations() {
    const { session } = useAuth();
    const user = session?.user ?? null;

    const [destinations, setDestinations] = useState<SavedDestinationSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSaved = useCallback(async () => {
        if (!user) {
            setDestinations([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const { data, error } = await supabase
            .from("saved_destinations")
            .select(
                `
        destination_id,
        destinations ( destination_id, destination_name, region, category, crowd_level, destination_photos )
      `
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setDestinations((data as any[]).map((row) => row.destinations).filter(Boolean));
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchSaved();
    }, [fetchSaved]);

    return { destinations, loading, refetch: fetchSaved };
}