import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Review } from "../../types/review";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <View className="mx-[18px] bg-white rounded-[13px] p-[13px] mb-[10px]">
      <View className="flex-row justify-between mb-2">
        <View>
          <Text className="text-[9px] font-bold text-[#34475A]">{review.name}</Text>
          <View className="flex-row gap-[2px] mt-1">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Ionicons key={i} name="star" size={8} color="#F5B942" />
            ))}
          </View>
        </View>
        <Text className="text-[7px] text-[#9AA7AE]">{review.date}</Text>
      </View>

      <Text className="text-[8px] leading-[13px] text-[#71828D]">
        &ldquo;{review.text}&rdquo;
      </Text>
    </View>
  );
}