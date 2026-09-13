import { ItineraryDetailModal } from "@/components/itineraries/ItineraryDetailModal";
import { SavedItineraryCard } from "@/components/itineraries/SavedItineraryCard";
import { useMyItineraries } from "@/hooks/useMyItineraries";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SavedItineraries() {
    const { itineraries, loading, error } = useMyItineraries();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (loading) {
        return (
            <View className="mb-6 items-center py-6">
                <ActivityIndicator color="#1E6E8C" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="mb-6">
                <Text className="text-sm font-semibold text-[#374151] mb-2">Saved Itineraries</Text>
                <Text className="text-xs text-red-500">{error}</Text>
            </View>
        );
    }

    if (itineraries.length === 0) {
        return (
            <View className="mb-6">
                <Text className="text-sm font-semibold text-[#374151] mb-3">Saved Itineraries</Text>
                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/calendar")}
                    className="bg-white border border-dashed border-[#D1D9E0] rounded-2xl py-6 items-center"
                >
                    <Text className="text-sm text-[#6B7280]">No saved trips yet</Text>
                    <Text className="text-xs text-[#9CA3AF] mt-1">Plan a trip with LakbAI to see it here</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="mb-6">
            <Text className="text-sm font-semibold text-[#374151] mb-3">Saved Itineraries</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {itineraries.map((itinerary, index) => (
                    <SavedItineraryCard
                        key={itinerary.itinerary_id}
                        itinerary={itinerary}
                        index={index}
                        onPress={() => setSelectedId(itinerary.itinerary_id)}
                    />
                ))}
            </ScrollView>

            <ItineraryDetailModal itineraryId={selectedId} onClose={() => setSelectedId(null)} />
        </View>
    );
}