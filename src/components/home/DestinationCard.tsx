import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { Destination } from "../../types/destination";

type DestinationCardProps = {
  destination: Destination;
  onPress?: () => void;
};

export default function DestinationCard({ destination, onPress }: DestinationCardProps) {
  const isBusy = destination.crowd === "Busy";

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-[20px] p-[9px] mb-[14px]"
      style={{
        shadowColor: "#6B8794",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="h-[155px] rounded-[15px] overflow-hidden relative">
        <Image source={destination.image} className="w-full h-full" resizeMode="cover" />

        {/* Crowd Badge */}
        <View
          className={`absolute top-[9px] left-[9px] h-[22px] px-[9px] rounded-xl flex-row items-center ${
            isBusy ? "bg-[#FFE7E3]" : "bg-[#FFF0C8]"
          }`}
        >
          <View
            className={`w-[5px] h-[5px] rounded-full mr-[5px] ${
              isBusy ? "bg-[#FF5C4D]" : "bg-[#D99A00]"
            }`}
          />
          <Text className="text-[9px] font-bold text-[#58636B]">{destination.crowd}</Text>
        </View>

        {/* Rating */}
        <View className="absolute right-[9px] bottom-[9px] h-[22px] px-2 rounded-xl bg-white/90 flex-row items-center">
          <Ionicons name="sparkles" size={11} color="#2499E8" />
          <Text className="text-[9px] font-bold text-[#2499E8] ml-[3px]">
            {destination.rating}
          </Text>
        </View>
      </View>

      <View className="min-h-[55px] flex-row items-center justify-between px-[6px] pt-[3px]">
        <View>
          <Text className="text-base font-bold text-[#26364D]">{destination.name}</Text>
          <View className="flex-row items-center mt-[3px]">
            <Ionicons name="location-outline" size={13} color="#82919C" />
            <Text className="text-[10px] text-[#81909B] ml-[3px]">{destination.location}</Text>
          </View>
        </View>

        <View className="w-8 h-8 rounded-full bg-[#E7F6FC] items-center justify-center">
          <Ionicons name="arrow-forward" size={16} color="#2499E8" />
        </View>
      </View>
    </Pressable>
  );
}