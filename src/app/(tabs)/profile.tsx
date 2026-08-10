import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfoCard from "@/components/profile/ProfileInfoCard";
import SignOutButton from "@/components/profile/SignOutButton";
import { useProfile } from "@/hooks/useProfile";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PastTrips from "@/components/profile/PastTrips";
import TravelPreferences from "@/components/profile/TravelPreferences";

// TODO: replace with real data once trip history has a backend
const PLACEHOLDER_TRIPS = [
  {
    id: "1",
    name: "Bohol",
    date: "Mar 2023",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400",
  },
  {
    id: "2",
    name: "Vigan",
    date: "Dec 2022",
    image: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=400",
  },
];

export default function ProfileScreen() {
  const profile = useProfile();

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
        <Text className="text-[#111827] text-base font-semibold text-center">
          You're not signed in.
        </Text>
        <Text className="text-[#6B7280] text-sm text-center mt-1">
          Log in to view your profile.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <ProfileHeader profile={profile} />

        <View className="px-5 mt-2">
          <TravelPreferences />
          <PastTrips trips={PLACEHOLDER_TRIPS} />

          <ProfileInfoCard profile={profile} />
          <SignOutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
