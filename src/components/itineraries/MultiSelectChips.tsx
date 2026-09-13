import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface MultiSelectChipsProps {
    label: string;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
}

export function MultiSelectChips({ label, options, selected, onToggle }: MultiSelectChipsProps) {
    return (
        <View className="mb-4">
            <Text className="text-[13px] text-gray-700 font-medium mb-2">{label}</Text>
            <View className="flex-row flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = selected.includes(option);
                    return (
                        <Animated.View key={option} entering={FadeIn.duration(150)}>
                            <Pressable
                                onPress={() => onToggle(option)}
                                className={`rounded-full px-3.5 py-2 border ${isSelected
                                        ? "bg-[#13A9E9] border-[#13A9E9]"
                                        : "bg-white border-gray-200"
                                    }`}
                            >
                                <Text
                                    className={`text-xs font-medium ${isSelected ? "text-white" : "text-gray-600"
                                        }`}
                                >
                                    {option}
                                </Text>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>
        </View>
    );
}