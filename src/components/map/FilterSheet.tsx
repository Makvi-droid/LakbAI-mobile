import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { MapFilterState } from "../../types/mapFilters";
import FilterChipGroup from "./FilterChipGroup";

const CROWD_LEVEL_LABELS: Record<string, string> = {
    low: "Low crowd",
    medium: "Moderate crowd",
    high: "Busy",
};

interface FilterSheetProps {
    visible: boolean;
    filters: MapFilterState;
    categoryOptions: string[];
    regionOptions: string[];
    onToggleCategory: (value: string) => void;
    onToggleCrowdLevel: (value: string) => void;
    onToggleRegion: (value: string) => void;
    onClear: () => void;
    onClose: () => void;
}

export default function FilterSheet({
    visible,
    filters,
    categoryOptions,
    regionOptions,
    onToggleCategory,
    onToggleCrowdLevel,
    onToggleRegion,
    onClear,
    onClose,
}: FilterSheetProps) {
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
                <Pressable
                    className="bg-white rounded-t-[28px] px-5 pt-3 pb-8 max-h-[80%]"
                    onPress={(e) => e.stopPropagation()}
                >
                    <View className="items-center mb-3">
                        <View className="w-10 h-1 rounded-full bg-[#E1E7EB]" />
                    </View>

                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-bold text-[#26364D]">Filter Destinations</Text>
                        <Pressable onPress={onClose} className="w-8 h-8 rounded-full bg-[#F0F4F6] items-center justify-center">
                            <Ionicons name="close" size={16} color="#58636B" />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <FilterChipGroup
                            label="Category / Activities"
                            options={categoryOptions}
                            selected={filters.categories}
                            onToggle={onToggleCategory}
                        />

                        <FilterChipGroup
                            label="Crowd Density"
                            options={["low", "medium", "high"]}
                            selected={filters.crowdLevels}
                            onToggle={onToggleCrowdLevel}
                            formatLabel={(v) => CROWD_LEVEL_LABELS[v] ?? v}
                        />

                        <FilterChipGroup
                            label="Location / Region"
                            options={regionOptions}
                            selected={filters.regions}
                            onToggle={onToggleRegion}
                        />
                    </ScrollView>

                    <View className="flex-row gap-3 mt-2 pt-4 border-t border-[#F0F4F6]">
                        <Pressable
                            onPress={onClear}
                            className="flex-1 h-11 rounded-2xl border border-[#E1E7EB] items-center justify-center"
                        >
                            <Text className="text-xs font-semibold text-[#536672]">Clear All</Text>
                        </Pressable>
                        <Pressable
                            onPress={onClose}
                            className="flex-1 h-11 rounded-2xl bg-[#13A7E8] items-center justify-center"
                        >
                            <Text className="text-xs font-semibold text-white">Done</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}