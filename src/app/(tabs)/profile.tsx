import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfoCard from "@/components/profile/ProfileInfoCard";
import SavedDestinations from "@/components/profile/SavedDestinations";
import SavedItineraries from "@/components/profile/SavedItineraries";
import SignOutButton from "@/components/profile/SignOutButton";
import TravelPreferences from "@/components/profile/TravelPreferences";
import { useMyItineraries } from "@/hooks/useMyItineraries";
import { useProfile } from "@/hooks/useProfile";
import { useSavedDestinations } from "@/hooks/useSavedDestinations";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const profile = useProfile();
  const { itineraries, loading: itinerariesLoading, refetch: refetchItineraries } = useMyItineraries();
  const { destinations, loading: destinationsLoading, refetch: refetchDestinations } = useSavedDestinations();

  const [refreshing, setRefreshing] = useState(false);

  // Re-fetch every time this tab regains focus — Expo Router keeps tab
  // screens mounted in the background, so a plain useEffect on mount only
  // runs once and goes stale after navigating away and back.
  useFocusEffect(
    useCallback(() => {
      refetchItineraries();
      refetchDestinations();
    }, [refetchItineraries, refetchDestinations])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchItineraries(), refetchDestinations()]);
    setRefreshing(false);
  };

  if (!profile.isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator color="#1E6E8C" size="large" />
      </SafeAreaView>
    );
  }

  if (!profile.isSignedIn) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
        <Text className="text-[#111827] text-base font-semibold text-center">You're not signed in.</Text>
        <Text className="text-[#6B7280] text-sm text-center mt-1">Log in to view your profile.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#1E6E8C" />
        }
      >
        <ProfileHeader profile={profile} />

        <View className="px-5 mt-2">
          <TravelPreferences />
          <SavedItineraries itineraries={itineraries} loading={itinerariesLoading} />
          <SavedDestinations destinations={destinations} loading={destinationsLoading} />

          <ProfileInfoCard profile={profile} />
          <SignOutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}