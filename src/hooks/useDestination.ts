import { supabase } from "@/lib/supabase";
import { DestinationRecord } from "@/types/destination";
import { useCallback, useEffect, useState } from "react";

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
    return { ...row, crowd_level: (row.crowd_level ?? "medium").toLowerCase(), destination_photos: photos };
}

export function useDestination(destinationId: string | undefined) {
    const [destination, setDestination] = useState<DestinationRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDestination = useCallback(async () => {
        if (!destinationId) return;
        setLoading(true);
        setError(null);

        const { data, error: fetchErr } = await supabase
            .from("destinations")
            .select("*")
            .eq("destination_id", destinationId)
            .single();

        if (fetchErr) {
            setError(fetchErr.message);
        } else {
            setDestination(normalizeDestination(data));
        }
        setLoading(false);
    }, [destinationId]);

    useEffect(() => {
        fetchDestination();
    }, [fetchDestination]);

    return { destination, loading, error, refetch: fetchDestination };
}