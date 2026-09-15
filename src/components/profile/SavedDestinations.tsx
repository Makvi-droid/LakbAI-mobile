import { FALLBACK_DESTINATION_IMAGE } from "@/constants/images";
import type { SavedDestinationSummary } from "@/types/savedDestination";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

interface SavedDestinationsProps {
    destinations: SavedDestinationSummary[];
    loading: boolean;
}

export default function SavedDestinations({ destinations, loading }: SavedDestinationsProps) {
    if (loading) {
        return (
            <View className="mb-6 items-center py-6">
                <ActivityIndicator color="#1E6E8C" />
            </View>
        );
    }

    if (destinations.length === 0) {
        return (
            <View className="mb-6">
                <Text className="text-sm font-semibold text-[#374151] mb-3">Saved Destinations</Text>
                <View className="bg-white border border-dashed border-[#D1D9E0] rounded-2xl py-6 items-center">
                    <Text className="text-sm text-[#6B7280]">No saved destinations yet</Text>
                    <Text className="text-xs text-[#9CA3AF] mt-1">Tap the heart on a destination to save it here</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="mb-6">
            <Text className="text-sm font-semibold text-[#374151] mb-3">Saved Destinations</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {destinations.map((dest, index) => (
                    <Animated.View key={dest.destination_id} entering={FadeInRight.delay(index * 80).duration(250)}>
                        <TouchableOpacity
                            className="w-[150px]"
                            activeOpacity={0.85}
                            onPress={() =>
                                router.push({ pathname: "/destination/[id]", params: { id: String(dest.destination_id) } })
                            }
                        >
                            <Image
                                source={{ uri: dest.destination_photos?.[0] ?? FALLBACK_DESTINATION_IMAGE }}
                                className="w-[150px] h-[100px] rounded-2xl bg-[#E5E7EB]"
                                contentFit="cover"
                            />
                            <Text className="text-sm font-bold text-[#111827] mt-2" numberOfLines={1}>
                                {dest.destination_name}
                            </Text>
                            <Text className="text-xs text-[#6B7280] mt-0.5">{dest.region}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
}