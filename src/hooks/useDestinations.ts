import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { DestinationRecord } from "../types/destination";

function normalizeDestination(row: any): DestinationRecord {
    let photos: string[] = [];
    if (Array.isArray(row.destination_photos)) {
        photos = row.destination_photos;
    } else if (typeof row.destination_photos === "string") {
        try {
            photos = JSON.parse(row.destination_photos);
        } catch {
            photos = [];
        }
    }

    return {
        ...row,
        crowd_level: (row.crowd_level ?? "medium").toLowerCase(),
        destination_photos: photos,
    };
}

export function useDestinations() {
    const [destinations, setDestinations] = useState<DestinationRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from("destinations")
                .select("*");
            if (fetchError) throw fetchError;
            setDestinations((data ?? []).map(normalizeDestination));
        } catch (err: any) {
            console.warn("Failed to fetch destinations:", err?.message);
            setError(err?.message ?? "Unable to load destinations.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { destinations, loading, error, refetch: load };
}