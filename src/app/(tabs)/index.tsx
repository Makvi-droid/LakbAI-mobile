import { router } from "expo-router";
import { ScrollView, View } from "react-native";

import CategoryTabs from "../../components/home/CategoryTabs";
import DestinationCard from "../../components/home/DestinationCard";
import HiddenGemsCard from "../../components/home/HiddenGemsCard";
import HomeHeader from "../../components/home/HomeHeader";
import SearchBar from "../../components/home/SearchBar";
import SectionHeader from "../../components/home/SectionHeader";
import { categories, destinations } from "../../constants/destinations";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-[#F0FAFE]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-[55px] pb-[120px]"
      >
        <HomeHeader />
        <SearchBar />
        <HiddenGemsCard />
        <CategoryTabs categories={categories} />

        <SectionHeader title="Explore destinations" />

        {destinations.map((destination) => (
          <DestinationCard
  key={destination.name}
  destination={destination}
  onPress={() =>
    router.push({
      pathname: "/destination/[id]",
      params: { id: destination.name },
    })
  }
/>
        ))}
      </ScrollView>
    </View>
  );
}