import type { AIItineraryOption } from "@/types/itinerary";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { AIItineraryOptionCard } from "./AIItineraryOptionCard";

interface AIItineraryOptionsListProps {
    options: AIItineraryOption[];
    choosingIndex: number | null;
    onChoose: (index: number) => void;
    onRegenerate: () => void;
    onBackToEdit: () => void;
}

export function AIItineraryOptionsList({
    options,
    choosingIndex,
    onChoose,
    onRegenerate,
    onBackToEdit,
}: AIItineraryOptionsListProps) {
    return (
        <View className="flex-1">
            <View className="flex-row items-center justify-between px-1 mb-3">
                <Pressable onPress={onBackToEdit} className="flex-row items-center">
                    <Ionicons name="chevron-back" size={16} color="#13A9E9" />
                    <Text className="text-xs text-[#13A9E9] font-medium ml-0.5">Edit preferences</Text>
                </Pressable>
                <Pressable onPress={onRegenerate} className="flex-row items-center">
                    <Ionicons name="refresh" size={14} color="#758691" />
                    <Text className="text-xs text-gray-500 font-medium ml-1">Regenerate</Text>
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {options.map((option, index) => (
                    <AIItineraryOptionCard
                        key={index}
                        option={option}
                        index={index}
                        onChoose={() => onChoose(index)}
                        choosing={choosingIndex === index}
                    />
                ))}
            </ScrollView>
        </View>
    );
}