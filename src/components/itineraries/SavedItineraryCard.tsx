import { FALLBACK_DESTINATION_IMAGE } from "@/constants/images";
import type { SavedItinerarySummary } from "@/types/itinerary";
import { formatDateRange } from "@/utils/date";
import { Image } from "expo-image";
import { Text, TouchableOpacity } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

interface SavedItineraryCardProps {
    itinerary: SavedItinerarySummary;
    index: number;
    onPress: () => void;
}

export function SavedItineraryCard({ itinerary, index, onPress }: SavedItineraryCardProps) {
    return (
        <Animated.View entering={FadeInRight.delay(index * 80).duration(250)}>
            <TouchableOpacity className="w-[150px]" activeOpacity={0.85} onPress={onPress}>
                <Image
                    source={{ uri: itinerary.coverImage ?? FALLBACK_DESTINATION_IMAGE }}
                    className="w-[150px] h-[100px] rounded-2xl bg-[#E5E7EB]"
                    contentFit="cover"
                />
                <Text className="text-sm font-bold text-[#111827] mt-2" numberOfLines={1}>
                    {itinerary.title}
                </Text>
                <Text className="text-xs text-[#6B7280] mt-0.5">
                    {formatDateRange(itinerary.start_date, itinerary.end_date)}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}