export interface MapFilterState {
    categories: string[];
    crowdLevels: string[]; // "low" | "medium" | "high"
    regions: string[];
}

export const DEFAULT_MAP_FILTERS: MapFilterState = {
    categories: [],
    crowdLevels: [],
    regions: [],
};