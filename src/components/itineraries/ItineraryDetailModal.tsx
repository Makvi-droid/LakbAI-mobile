import { ItineraryDetailView } from "@/components/itineraries/ItineraryDetailView";
import { useItineraryDetail } from "@/hooks/useItineraryDetail";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ItineraryDetailModalProps {
    itineraryId: string | null;
    onClose: () => void;
}

export function ItineraryDetailModal({ itineraryId, onClose }: ItineraryDetailModalProps) {
    const { itinerary, loading, error } = useItineraryDetail(itineraryId ?? undefined);

    return (
        <Modal visible={!!itineraryId} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["top"]}>
                <View className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-white">
                    <Pressable onPress={onClose} className="p-1 mr-2">
                        <Ionicons name="chevron-down" size={22} color="#26364D" />
                    </Pressable>
                    <Text className="text-base font-bold text-[#111827] flex-1" numberOfLines={1}>
                        {itinerary?.title ?? "Itinerary"}
                    </Text>
                </View>

                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#1E6E8C" />
                    </View>
                ) : error || !itinerary ? (
                    <View className="flex-1 items-center justify-center px-8">
                        <Text className="text-sm text-red-500 text-center">{error ?? "Couldn't find this itinerary."}</Text>
                    </View>
                ) : (
                    <ItineraryDetailView itinerary={itinerary} />
                )}
            </SafeAreaView>
        </Modal>
    );
}