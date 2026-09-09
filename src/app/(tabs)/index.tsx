import { router } from "expo-router";
import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import CategoryTabs from "../../components/home/CategoryTabs";
import DestinationCard from "../../components/home/DestinationCard";
import DestinationCardSkeleton from "../../components/home/DestinationCardSkeleton";
import HiddenGemsCard from "../../components/home/HiddenGemsCard";
import HomeHeader from "../../components/home/HomeHeader";
import SearchBar from "../../components/home/SearchBar";
import SectionHeader from "../../components/home/SectionHeader";
import { categories } from "../../constants/destinations";
import { useDestinations } from "../../hooks/useDestinations";

export default function HomeScreen() {
  const { destinations, loading, error, refetch } = useDestinations();
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [refreshing, setRefreshing] = useState(false);

  const filteredDestinations = useMemo(() => {
    if (activeCategory === "All") return destinations;
    return destinations.filter(
      (destination) =>
        destination.category?.toLowerCase() === activeCategory.toLowerCase(),
    );
  }, [destinations, activeCategory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-[#F0FAFE]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-[55px] pb-[120px]"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#13A7E8"
          />
        }
      >
        <HomeHeader />
        <SearchBar />
        <HiddenGemsCard />
        <CategoryTabs categories={categories} onSelect={setActiveCategory} />

        <SectionHeader title="Explore destinations" />

        {loading && !refreshing ? (
          <>
            <DestinationCardSkeleton />
            <DestinationCardSkeleton />
            <DestinationCardSkeleton />
          </>
        ) : error ? (
          <View className="items-center py-10">
            <Text className="text-sm text-[#81909B] text-center">
              Couldn't load destinations. Pull down to try again.
            </Text>
          </View>
        ) : filteredDestinations.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-sm text-[#81909B] text-center">
              No destinations found for "{activeCategory}" yet.
            </Text>
          </View>
        ) : (
          filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.destination_id}
              destination={destination}
              onPress={() =>
                router.push({
                  pathname: "/destination/[id]",
                  params: { id: String(destination.destination_id) },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}