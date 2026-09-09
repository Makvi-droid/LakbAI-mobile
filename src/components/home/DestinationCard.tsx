import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { DestinationRecord } from "../../types/destination";

type DestinationCardProps = {
  destination: DestinationRecord;
  onPress?: () => void;
};

const CROWD_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Moderate",
  high: "Busy",
};

const CROWD_STYLES: Record<string, { bg: string; dot: string }> = {
  low: { bg: "bg-[#E4F9EE]", dot: "bg-[#34C777]" },
  medium: { bg: "bg-[#FFF0C8]", dot: "bg-[#D99A00]" },
  high: { bg: "bg-[#FFE7E3]", dot: "bg-[#FF5C4D]" },
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=600";

export default function DestinationCard({
  destination,
  onPress,
}: DestinationCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const crowdLevel = destination.crowd_level ?? "medium";
  const crowdLabel = CROWD_LABELS[crowdLevel] ?? "Moderate";
  const crowdStyle = CROWD_STYLES[crowdLevel] ?? CROWD_STYLES.medium;

  const imageUri =
    !imageFailed && destination.destination_photos?.[0]
      ? destination.destination_photos[0]
      : PLACEHOLDER_IMAGE;

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-[20px] p-[9px] mb-[14px]"
      style={({ pressed }) => ({
        shadowColor: "#6B8794",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View className="h-[155px] rounded-[15px] overflow-hidden relative">
        <Image
          source={{ uri: imageUri }}
          onError={() => setImageFailed(true)}
          className="w-full h-full"
          resizeMode="cover"
        />

        <View
          className={`absolute top-[9px] left-[9px] h-[22px] px-[9px] rounded-xl flex-row items-center ${crowdStyle.bg}`}
        >
          <View
            className={`w-[5px] h-[5px] rounded-full mr-[5px] ${crowdStyle.dot}`}
          />
          <Text className="text-[9px] font-bold text-[#58636B]">
            {crowdLabel}
          </Text>
        </View>

        {destination.immersive_support && (
          <View className="absolute right-[9px] bottom-[9px] h-[22px] px-2 rounded-xl bg-white/90 flex-row items-center">
            <Ionicons name="sparkles" size={11} color="#2499E8" />
            <Text className="text-[9px] font-bold text-[#2499E8] ml-[3px]">
              Immersive
            </Text>
          </View>
        )}
      </View>

      <View className="min-h-[55px] flex-row items-center justify-between px-[6px] pt-[3px]">
        <View className="flex-1 pr-2">
          <Text
            className="text-base font-bold text-[#26364D]"
            numberOfLines={1}
          >
            {destination.destination_name}
          </Text>
          <View className="flex-row items-center mt-[3px]">
            <Ionicons name="location-outline" size={13} color="#82919C" />
            <Text
              className="text-[10px] text-[#81909B] ml-[3px]"
              numberOfLines={1}
            >
              {destination.region}
            </Text>
          </View>
        </View>

        <View className="w-8 h-8 rounded-full bg-[#E7F6FC] items-center justify-center">
          <Ionicons name="arrow-forward" size={16} color="#2499E8" />
        </View>
      </View>
    </Pressable>
  );
}