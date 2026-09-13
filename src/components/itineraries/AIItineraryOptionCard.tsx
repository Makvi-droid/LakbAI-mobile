import type { AIItineraryOption } from "@/types/itinerary";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface AIItineraryOptionCardProps {
    option: AIItineraryOption;
    index: number;
    onChoose: () => void;
    choosing: boolean;
}

export function AIItineraryOptionCard({ option, index, onChoose, choosing }: AIItineraryOptionCardProps) {
    return (
        <Animated.View
            entering={FadeInUp.delay(index * 100).duration(300)}
            className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
            style={{
                shadowColor: "#607D8B",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
            }}
        >
            <Text className="text-base font-bold text-gray-900 mb-1">{option.option_title}</Text>
            <Text className="text-xs text-gray-500 mb-3">{option.summary}</Text>

            {option.days.map((day) => (
                <View key={day.day_number} className="mb-3">
                    <Text className="text-[11px] font-semibold text-[#13A9E9] mb-1.5">
                        Day {day.day_number}
                    </Text>
                    {day.stops.map((stop, i) => (
                        <View key={i} className="flex-row items-start mb-1.5 pl-1">
                            <Ionicons name="location" size={11} color="#758691" style={{ marginTop: 2 }} />
                            <View className="flex-1 ml-1.5">
                                <Text className="text-xs text-gray-800 font-medium">
                                    {stop.destination_name ?? `Destination #${stop.destination_id}`}
                                </Text>
                                <Text className="text-[10px] text-gray-500">{stop.activity_description}</Text>
                            </View>
                            <Text className="text-[10px] text-gray-600 font-medium">
                                ₱{stop.estimated_cost.toLocaleString()}
                            </Text>
                        </View>
                    ))}
                </View>
            ))}

            <View className="border-t border-gray-100 pt-3 mt-1">
                <Text className="text-[11px] font-semibold text-gray-700 mb-1.5">Quotation Breakdown</Text>
                {option.quotation.breakdown.map((item) => (
                    <View key={item.category} className="flex-row justify-between mb-1">
                        <Text className="text-[11px] text-gray-500">{item.category}</Text>
                        <Text className="text-[11px] text-gray-700">₱{item.amount.toLocaleString()}</Text>
                    </View>
                ))}
                <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100">
                    <Text className="text-xs font-bold text-gray-900">Total</Text>
                    <Text className="text-xs font-bold text-gray-900">
                        ₱{option.quotation.total_cost.toLocaleString()}
                    </Text>
                </View>
                <Text className="text-[10px] text-gray-400 mt-0.5">
                    ≈ ₱{option.quotation.per_traveler_cost.toLocaleString()} per traveler
                </Text>
            </View>

            <Pressable
                onPress={onChoose}
                disabled={choosing}
                className="h-10 rounded-[10px] bg-[#13A9E9] items-center justify-center flex-row mt-3"
            >
                {choosing ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <Ionicons name="checkmark-circle-outline" size={15} color="#fff" />
                        <Text className="text-white text-xs font-semibold ml-1.5">Choose this plan</Text>
                    </>
                )}
            </Pressable>
        </Animated.View>
    );
}