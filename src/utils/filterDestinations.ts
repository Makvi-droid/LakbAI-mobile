import { DestinationRecord } from "../types/destination";
import { MapFilterState } from "../types/mapFilters";

export function filterDestinations(
    destinations: DestinationRecord[],
    filters: MapFilterState
): DestinationRecord[] {
    return destinations.filter((d) => {
        if (filters.categories.length > 0 && !filters.categories.includes(d.category)) return false;
        if (filters.crowdLevels.length > 0 && !filters.crowdLevels.includes(d.crowd_level)) return false;
        if (filters.regions.length > 0 && !filters.regions.includes(d.region)) return false;
        return true;
    });
}

// Derives filter chip options from whatever data actually exists in the
// table, rather than hardcoding a guessed list of categories/regions.
export function getUniqueValues(
    destinations: DestinationRecord[],
    key: "category" | "region"
): string[] {
    const set = new Set<string>();
    destinations.forEach((d) => {
        const value = d[key];
        if (value) set.add(value);
    });
    return Array.from(set).sort();
}