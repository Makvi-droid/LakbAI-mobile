import { useMemo, useState } from "react";
import { DestinationRecord } from "../types/destination";
import { DEFAULT_MAP_FILTERS, MapFilterState } from "../types/mapFilters";
import { filterDestinations, getUniqueValues } from "../utils/filterDestinations";

export function useMapFilters(destinations: DestinationRecord[]) {
    const [filters, setFilters] = useState<MapFilterState>(DEFAULT_MAP_FILTERS);

    const categoryOptions = useMemo(() => getUniqueValues(destinations, "category"), [destinations]);
    const regionOptions = useMemo(() => getUniqueValues(destinations, "region"), [destinations]);

    const filteredDestinations = useMemo(
        () => filterDestinations(destinations, filters),
        [destinations, filters]
    );

    const activeCount =
        filters.categories.length + filters.crowdLevels.length + filters.regions.length;

    const toggleCategory = (value: string) =>
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(value)
                ? prev.categories.filter((v) => v !== value)
                : [...prev.categories, value],
        }));

    const toggleCrowdLevel = (value: string) =>
        setFilters((prev) => ({
            ...prev,
            crowdLevels: prev.crowdLevels.includes(value)
                ? prev.crowdLevels.filter((v) => v !== value)
                : [...prev.crowdLevels, value],
        }));

    const toggleRegion = (value: string) =>
        setFilters((prev) => ({
            ...prev,
            regions: prev.regions.includes(value)
                ? prev.regions.filter((v) => v !== value)
                : [...prev.regions, value],
        }));

    const clear = () => setFilters(DEFAULT_MAP_FILTERS);

    return {
        filters,
        filteredDestinations,
        categoryOptions,
        regionOptions,
        activeCount,
        toggleCategory,
        toggleCrowdLevel,
        toggleRegion,
        clear,
    };
}