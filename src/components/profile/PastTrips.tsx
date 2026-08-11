import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Trip {
  id: string;
  name: string;
  date: string;
  image: string;
}

interface PastTripsProps {
  trips?: Trip[];
}

export default function PastTrips({ trips = [] }: PastTripsProps) {
  if (trips.length === 0) return null;

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm font-semibold text-[#374151]">Past Trips</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text className="text-sm font-semibold text-[#3B82F6]">View all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {trips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            className="w-[150px]"
            activeOpacity={0.85}
            onPress={() => {}}
          >
            <Image
              source={{ uri: trip.image }}
              className="w-[150px] h-[100px] rounded-2xl bg-[#E5E7EB]"
            />
            <Text className="text-sm font-bold text-[#111827] mt-2">
              {trip.name}
            </Text>
            <Text className="text-xs text-[#6B7280] mt-0.5">{trip.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
