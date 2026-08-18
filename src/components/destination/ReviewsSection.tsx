import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Review } from "../../types/review";
import ReviewCard from "./ReviewCard";

type ReviewsSectionProps = {
  reviews: Review[];
  onWriteReview?: () => void;
};

export default function ReviewsSection({ reviews, onWriteReview }: ReviewsSectionProps) {
  return (
    <>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}

      <Pressable
        onPress={onWriteReview}
        className="h-[37px] mx-[18px] rounded-[10px] border border-[#DCECF2] bg-white items-center justify-center flex-row mt-[3px]"
      >
        <Ionicons name="create-outline" size={13} color="#13A9E9" />
        <View className="ml-[5px]">
          <Text className="text-[8px] text-[#13A9E9] font-semibold">
            Write a Review
          </Text>
        </View>
      </Pressable>
    </>
  );
}