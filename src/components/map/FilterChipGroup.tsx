import { Pressable, Text, View } from "react-native";

interface FilterChipGroupProps {
    label: string;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
    formatLabel?: (value: string) => string;
}

export default function FilterChipGroup({
    label,
    options,
    selected,
    onToggle,
    formatLabel,
}: FilterChipGroupProps) {
    if (options.length === 0) return null;

    return (
        <View className="mb-5">
            <Text className="text-xs font-semibold text-[#374151] mb-2">{label}</Text>
            <View className="flex-row flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = selected.includes(option);
                    return (
                        <Pressable
                            key={option}
                            onPress={() => onToggle(option)}
                            className={`rounded-full px-3.5 py-2 border ${isSelected ? "bg-[#13A7E8] border-[#13A7E8]" : "bg-white border-[#E1E7EB]"
                                }`}
                        >
                            <Text className={`text-xs font-medium ${isSelected ? "text-white" : "text-[#536672]"}`}>
                                {formatLabel ? formatLabel(option) : option}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}