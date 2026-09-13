import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";

export function useSavedDestinationIds() {
    const { session } = useAuth();
    const user = session?.user ?? null;

    const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);

    const fetchSavedIds = useCallback(async () => {
        if (!user) {
            setSavedIds(new Set());
            setLoading(false);
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from("saved_destinations")
            .select("destination_id")
            .eq("user_id", user.id);

        if (!error && data) {
            setSavedIds(new Set(data.map((row) => row.destination_id)));
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchSavedIds();
    }, [fetchSavedIds]);

    const isSaved = useCallback((destinationId: number) => savedIds.has(destinationId), [savedIds]);

    const toggleSave = useCallback(
        async (destinationId: number) => {
            if (!user) return;

            const currentlySaved = savedIds.has(destinationId);

            // optimistic update
            setSavedIds((prev) => {
                const next = new Set(prev);
                currentlySaved ? next.delete(destinationId) : next.add(destinationId);
                return next;
            });

            if (currentlySaved) {
                const { error } = await supabase
                    .from("saved_destinations")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("destination_id", destinationId);
                if (error) {
                    // revert on failure
                    setSavedIds((prev) => new Set(prev).add(destinationId));
                }
            } else {
                const { error } = await supabase
                    .from("saved_destinations")
                    .insert({ user_id: user.id, destination_id: destinationId });
                if (error) {
                    setSavedIds((prev) => {
                        const next = new Set(prev);
                        next.delete(destinationId);
                        return next;
                    });
                }
            }
        },
        [user, savedIds]
    );

    return { savedIds, isSaved, toggleSave, loading, refetch: fetchSavedIds };
}