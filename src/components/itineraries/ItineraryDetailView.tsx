import { FALLBACK_DESTINATION_IMAGE } from "@/constants/images";
import type { SavedItineraryDetail } from "@/types/itinerary";
import { formatDateRange } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export function ItineraryDetailView({ itinerary }: { itinerary: SavedItineraryDetail }) {
    const quotation = itinerary.quotation_breakdown;

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            <View className="flex-row items-center flex-wrap mb-4 gap-2">
                <View className="bg-[#E6F7FD] rounded-full px-3 py-1.5 flex-row items-center">
                    <Ionicons name="calendar-outline" size={12} color="#13A9E9" />
                    <Text className="text-[11px] text-[#13A9E9] font-semibold ml-1">
                        {formatDateRange(itinerary.start_date, itinerary.end_date)}
                    </Text>
                </View>
                <View className="bg-[#F0F6F5] rounded-full px-3 py-1.5 flex-row items-center">
                    <Ionicons name="people-outline" size={12} color="#1E6E8C" />
                    <Text className="text-[11px] text-[#1E6E8C] font-semibold ml-1">{itinerary.travel_type}</Text>
                </View>
                {itinerary.generated_by_ai && (
                    <View className="bg-[#FFF3D6] rounded-full px-3 py-1.5 flex-row items-center">
                        <Ionicons name="sparkles-outline" size={12} color="#B8860B" />
                        <Text className="text-[11px] text-[#B8860B] font-semibold ml-1">AI Planned</Text>
                    </View>
                )}
            </View>

            {itinerary.days.map((day, i) => (
                <Animated.View key={day.day_number} entering={FadeInUp.delay(i * 80).duration(250)} className="mb-4">
                    <Text className="text-[13px] font-bold text-[#34475A] mb-2">Day {day.day_number}</Text>

                    {day.stops.map((stop) => (
                        <View
                            key={stop.detail_id}
                            className="bg-white rounded-2xl p-3 mb-2.5 flex-row"
                            style={{
                                shadowColor: "#607D8B",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.06,
                                shadowRadius: 6,
                                elevation: 2,
                            }}
                        >
                            <Image
                                source={{ uri: stop.destination_photo ?? FALLBACK_DESTINATION_IMAGE }}
                                className="w-14 h-14 rounded-xl bg-[#E5E7EB]"
                                contentFit="cover"
                            />
                            <View className="flex-1 ml-3">
                                <Text className="text-[13px] font-semibold text-[#111827]">{stop.destination_name}</Text>
                                <Text className="text-[11px] text-[#71828D] mt-0.5" numberOfLines={2}>
                                    {stop.activity_description}
                                </Text>
                                <View className="flex-row items-center justify-between mt-1.5">
                                    {stop.estimated_travel_time != null ? (
                                        <Text className="text-[10px] text-[#9AA7AE]">~{stop.estimated_travel_time} min travel</Text>
                                    ) : (
                                        <View />
                                    )}
                                    {stop.estimated_cost != null && (
                                        <Text className="text-[11px] font-semibold text-[#13A9E9]">
                                            ₱{stop.estimated_cost.toLocaleString()}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}
                </Animated.View>
            ))}

            {quotation && (
                <View className="bg-white rounded-2xl p-4 mt-1">
                    <Text className="text-[13px] font-bold text-[#34475A] mb-2">Quotation Breakdown</Text>
                    {quotation.breakdown.map((item) => (
                        <View key={item.category} className="flex-row justify-between mb-1.5">
                            <Text className="text-xs text-[#71828D]">{item.category}</Text>
                            <Text className="text-xs text-[#374151]">₱{item.amount.toLocaleString()}</Text>
                        </View>
                    ))}
                    <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100">
                        <Text className="text-sm font-bold text-[#111827]">Total</Text>
                        <Text className="text-sm font-bold text-[#111827]">₱{quotation.total_cost.toLocaleString()}</Text>
                    </View>
                    <Text className="text-[10px] text-[#9AA7AE] mt-1">
                        ≈ ₱{quotation.per_traveler_cost.toLocaleString()} per traveler
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}