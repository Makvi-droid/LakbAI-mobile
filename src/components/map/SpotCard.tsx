import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { GeocodingFeature } from "../../types/geocoding";

type SpotCardProps = {
  spot: GeocodingFeature;
  loading: boolean;
  onClose: () => void;
};

// Maps Mapbox's placeType to a more fitting icon + friendlier label.
const PLACE_TYPE_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  poi: { icon: "pin", label: "Point of Interest" },
  address: { icon: "home-outline", label: "Address" },
  place: { icon: "business-outline", label: "City / Town" },
  locality: { icon: "location-outline", label: "Locality" },
  neighborhood: { icon: "map-outline", label: "Neighborhood" },
  region: { icon: "flag-outline", label: "Region" },
  country: { icon: "earth-outline", label: "Country" },
};

export default function SpotCard({ spot, loading, onClose }: SpotCardProps) {
  const [copied, setCopied] = useState(false);
  const meta = PLACE_TYPE_META[spot.placeType] ?? {
    icon: "location-outline" as const,
    label: spot.placeType || "Location",
  };

  const handleCopyAddress = async () => {
    await Clipboard.setStringAsync(spot.fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleGetDirections = () => {
    const [lng, lat] = spot.coordinate;
    const label = encodeURIComponent(spot.name);
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}&q=${label}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

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
        <View className="py-6 items-center">
          <ActivityIndicator size="small" color="#13A7E8" />
          <Text className="text-xs text-[#81909B] mt-2">Looking up this place...</Text>
        </View>
      ) : (
        <>
          {/* Header */}
          <View className="flex-row items-start">
            <View className="w-12 h-12 rounded-2xl bg-[#E7F6FC] items-center justify-center">
              <Ionicons name={meta.icon} size={22} color="#13A7E8" />
            </View>

            <View className="flex-1 ml-3">
              <Text className="text-lg font-bold text-[#26364D]" numberOfLines={2}>
                {spot.name}
              </Text>

              <View className="flex-row items-center mt-1 self-start px-2 py-0.5 rounded-full bg-[#F0F4F6]">
                <Text className="text-[10px] font-semibold text-[#58636B]">
                  {meta.label}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-[#F0F4F6] items-center justify-center"
            >
              <Ionicons name="close" size={16} color="#58636B" />
            </Pressable>
          </View>

          {/* Address */}
          <Pressable
            onPress={handleCopyAddress}
            className="flex-row items-start mt-4 bg-[#F8FAFB] rounded-2xl p-3"
          >
            <Ionicons name="navigate-outline" size={15} color="#81909B" style={{ marginTop: 1 }} />
            <Text className="text-xs text-[#536672] ml-2 flex-1 leading-[18px]">
              {spot.fullAddress}
            </Text>
            <Ionicons
              name={copied ? "checkmark" : "copy-outline"}
              size={15}
              color={copied ? "#4ADE80" : "#B7C7D1"}
            />
          </Pressable>

          {/* Coordinates */}
          <View className="flex-row items-center mt-2 px-1">
            <Ionicons name="locate-outline" size={12} color="#B7C7D1" />
            <Text className="text-[10px] text-[#B7C7D1] ml-1.5">
              {spot.coordinate[1].toFixed(5)}, {spot.coordinate[0].toFixed(5)}
            </Text>
          </View>

          {/* Actions row */}
          <View className="flex-row justify-around mt-4 pt-4 border-t border-[#F0F4F6]">
            <Pressable onPress={handleGetDirections} className="items-center">
              <View className="w-11 h-11 rounded-full bg-[#E7F6FC] items-center justify-center">
                <Ionicons name="navigate" size={17} color="#13A7E8" />
              </View>
              <Text className="text-[10px] text-[#26364D] mt-1.5 font-medium">
                Directions
              </Text>
            </Pressable>

            {/* Save — stubbed until persistence is wired up */}
            <Pressable className="items-center">
              <View className="w-11 h-11 rounded-full bg-[#F0F4F6] items-center justify-center">
                <Ionicons name="bookmark-outline" size={17} color="#26364D" />
              </View>
              <Text className="text-[10px] text-[#26364D] mt-1.5 font-medium">Save</Text>
            </Pressable>

            <Pressable onPress={handleCopyAddress} className="items-center">
              <View className="w-11 h-11 rounded-full bg-[#F0F4F6] items-center justify-center">
                <Ionicons name={copied ? "checkmark" : "copy-outline"} size={17} color="#26364D" />
              </View>
              <Text className="text-[10px] text-[#26364D] mt-1.5 font-medium">
                {copied ? "Copied!" : "Copy"}
              </Text>
            </Pressable>
          </View>

          {/* Ask LakbAI */}
          <Pressable className="flex-row items-center justify-center bg-[#FFF3D6] rounded-2xl py-3 mt-4">
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