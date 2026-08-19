import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { GeocodingFeature } from "../../types/geocoding";

type SpotCardProps = {
  spot: GeocodingFeature;
  loading: boolean;
  onClose: () => void;
};

export default function SpotCard({ spot, loading, onClose }: SpotCardProps) {
  return (
    <View
      className="absolute left-0 right-0 bottom-0 bg-white rounded-t-[28px] px-5 pt-3 pb-8"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 10,
      }}
    >
      <Pressable onPress={onClose} className="items-center mb-3">
        <View className="w-10 h-1 rounded-full bg-[#E1E7EB]" />
      </Pressable>

      {loading ? (
        <ActivityIndicator size="small" color="#13A7E8" />
      ) : (
        <>
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#E7F6FC] items-center justify-center">
              <Ionicons name="location" size={18} color="#13A7E8" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-bold text-[#26364D]" numberOfLines={1}>
                {spot.name}
              </Text>
              <Text className="text-xs text-[#81909B] mt-0.5" numberOfLines={2}>
                {spot.fullAddress}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-3">
            <View className="px-2.5 py-1 rounded-xl bg-[#F0F4F6]">
              <Text className="text-[11px] font-semibold text-[#58636B] capitalize">
                {spot.placeType}
              </Text>
            </View>
          </View>

          {/* Route / Save — stubbed until routing + persistence are decided */}
          <View className="flex-row justify-around mt-4 py-3 border-y border-[#F0F4F6]">
            <Pressable className="items-center">
              <Ionicons name="navigate-outline" size={18} color="#26364D" />
              <Text className="text-[10px] text-[#26364D] mt-1">Route</Text>
            </Pressable>
            <Pressable className="items-center">
              <Ionicons name="bookmark-outline" size={18} color="#26364D" />
              <Text className="text-[10px] text-[#26364D] mt-1">Save</Text>
            </Pressable>
          </View>

          <Pressable className="flex-row items-center justify-center bg-[#FFF3D6] rounded-2xl py-2.5 mt-3">
            <Ionicons name="sparkles-outline" size={14} color="#26364D" />
            <Text className="text-xs font-semibold text-[#26364D] ml-1.5">
              Ask LakbAI about {spot.name}
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}