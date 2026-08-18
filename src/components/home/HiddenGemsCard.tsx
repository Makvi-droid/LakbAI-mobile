import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type HiddenGemsCardProps = {
  onPress?: () => void;
};

export default function HiddenGemsCard({ onPress }: HiddenGemsCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="h-[68px] bg-[#E7F6FA] rounded-[18px] flex-row items-center px-3 mb-[18px]"
    >
      <View className="w-[38px] h-[38px] rounded-full bg-[#F6FBFC] justify-center items-center mr-[10px]">
        <Ionicons name="sparkles-outline" size={18} color="#26364D" />
      </View>

      <View>
        <Text className="text-xs leading-[13px] font-bold text-[#26364D]">
          Hidden
        </Text>
        <Text className="text-xs leading-[13px] font-bold text-[#26364D]">
          Gems
        </Text>
        <Text className="text-[9px] text-[#81909B] mt-0.5">Less crowded</Text>
      </View>

      <View className="ml-auto">
        <Ionicons name="chevron-forward" size={18} color="#94A5B0" />
      </View>
    </Pressable>
  );
}