import { useState } from "react";
import { ScrollView, View } from "react-native";

import DetailHero from "../../components/destination/DetailHero";
import DetailTabs, { DetailTab } from "../../components/destination/DetailTabs";
import InfoCard from "../../components/destination/InfoCard";
import OverviewSection from "../../components/destination/OverviewSection";
import ReviewsSection from "../../components/destination/ReviewsSection";
import TrendsSection from "../../components/destination/TrendsSection";
import { destinationDetail } from "../../constants/destinationDetail";
import { reviews } from "../../constants/reviews";
import { trendData, trendSummary } from "../../constants/trends";

export default function DestinationDetailScreen() {
  // `id` from the route isn't used yet since data is hardcoded to El Nido.
  // Swap `destinationDetail` for a lookup by id once real data exists.
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  return (
    <View className="flex-1 bg-[#F2FAFD]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-[110px]">
        <DetailHero
          image={destinationDetail.image}
          location={destinationDetail.location}
          title={destinationDetail.name}
        />

        <InfoCard
          stats={[
            { label: "Crowd", value: destinationDetail.crowd },
            { label: "Sentiment", value: destinationDetail.sentiment },
            { label: "Best", value: destinationDetail.bestTimeShort },
          ]}
        />

        <DetailTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === "overview" && (
          <OverviewSection
            description={destinationDetail.description}
            bestTimeFull={destinationDetail.bestTimeFull}
            tags={destinationDetail.tags}
          />
        )}

        {activeTab === "reviews" && <ReviewsSection reviews={reviews} />}

        {activeTab === "trends" && (
          <TrendsSection data={trendData} summary={trendSummary} />
        )}
      </ScrollView>
    </View>
  );
}