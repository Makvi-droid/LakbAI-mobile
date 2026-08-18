import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type OverviewSectionProps = {
  description: string;
  bestTimeFull: string;
  tags: string[];
  onGenerateItinerary?: () => void;
  onTalkToLakbai?: () => void;
  onSaveItinerary?: () => void;
};

export default function OverviewSection({
  description,
  bestTimeFull,
  tags,
  onGenerateItinerary,
  onTalkToLakbai,
  onSaveItinerary,
}: OverviewSectionProps) {
  return (
    <>
      <View className="mx-[18px] mb-3">
        <Text className="text-[8px] leading-[13px] text-[#71828D]">
          {description}
        </Text>
      </View>

      <View className="mx-[18px] p-3 bg-white rounded-[13px] mb-[14px]">
        <Text className="text-[7px] text-[#13A9E9] font-bold mb-[5px]">
          Best Time to Visit
        </Text>
        <Text className="text-[8px] text-[#536672] font-medium">{bestTimeFull}</Text>
      </View>

      <View className="mx-[18px] mb-3">
        <Text className="text-[9px] font-bold text-[#34475A] mb-[7px]">Tags</Text>
        <View className="flex-row flex-wrap gap-[6px]">
          {tags.map((tag) => (
            <View key={tag} className="bg-[#E8F4E8] rounded-xl px-[9px] py-[5px]">
              <Text className="text-[7px] text-[#648268] font-semibold">{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* NOTE: original had no background color set here — added a light
          gold fill so this reads as the primary action. Adjust if you had
          a different color in mind. */}
      <Pressable
        onPress={onGenerateItinerary}
        className="h-9 mx-[18px] rounded-[10px] bg-[#FFF3D6] items-center justify-center flex-row mb-2"
      >
        <Ionicons name="sparkles-outline" size={13} color="#26364D" />
        <Text className="text-[8px] font-semibold text-[#26364D] ml-[5px]">
          Generate Itinerary
        </Text>
      </Pressable>

      <Pressable
        onPress={onTalkToLakbai}
        className="h-9 mx-[18px] rounded-[10px] bg-white border border-[#DCECF2] items-center justify-center flex-row mb-2"
      >
        <Ionicons name="chatbubble-outline" size={13} color="#13A9E9" />
        <Text className="text-[8px] font-semibold text-[#13A9E9] ml-[5px]">
          Talk to LakbAI
        </Text>
      </Pressable>

      <Pressable
        onPress={onSaveItinerary}
        className="h-9 mx-[18px] rounded-[10px] bg-white border border-[#DCECF2] items-center justify-center flex-row mb-2"
      >
        <Ionicons name="bookmark-outline" size={13} color="#13A9E9" />
        <Text className="text-[8px] font-semibold text-[#13A9E9] ml-[5px]">
          Save Itinerary
        </Text>
      </Pressable>
    </>
  );
}