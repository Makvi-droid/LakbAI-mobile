import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import DetailHero from "../../components/destination/DetailHero";
import DetailTabs, { DetailTab } from "../../components/destination/DetailTabs";
import InfoCard from "../../components/destination/InfoCard";
import OverviewSection from "../../components/destination/OverviewSection";
import ReviewsSection from "../../components/destination/ReviewsSection";
import TrendsSection from "../../components/destination/TrendsSection";
import { reviews } from "../../constants/reviews";
import { trendData, trendSummary } from "../../constants/trends";
import { useDestination } from "../../hooks/useDestination";
import { useSavedDestinationIds } from "../../hooks/useSavedDestinationIds";
import { useLocalSearchParams } from "expo-router";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800";

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { destination, loading, error } = useDestination(id);
  const { isSaved, toggleSave } = useSavedDestinationIds();

  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  if (loading) {
    return (
      <View className="flex-1 bg-[#F2FAFD] items-center justify-center">
        <ActivityIndicator size="large" color="#13A9E9" />
      </View>
    );
  }

  if (error || !destination) {
    return (
      <View className="flex-1 bg-[#F2FAFD] items-center justify-center px-8">
        <Text className="text-sm text-red-500 text-center">
          {error ?? "Couldn't find this destination."}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F2FAFD]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-[110px]">
        <DetailHero
          image={destination.destination_photos[0] ?? FALLBACK_IMAGE}
          location={destination.region}
          title={destination.destination_name}
          isFavorited={isSaved(destination.destination_id)}
          onFavoritePress={() => toggleSave(destination.destination_id)}
        />

        <InfoCard
          stats={[
            { label: "Category", value: destination.category },
            {
              label: "Crowd",
              value: destination.crowd_level.charAt(0).toUpperCase() + destination.crowd_level.slice(1),
            },
            { label: "Region", value: destination.region },
          ]}
        />

        <DetailTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === "overview" && (
          <OverviewSection
            description={destination.description}
            tags={[destination.category]}
            onTalkToLakbai={() =>
              router.push({ pathname: "/(tabs)/ai", params: { prefill: destination.destination_name } })
            }
          />
        )}

        {activeTab === "reviews" && <ReviewsSection reviews={reviews} />}

        {activeTab === "trends" && <TrendsSection data={trendData} summary={trendSummary} />}
      </ScrollView>
    </View>
  );
}