import { Text, View } from "react-native";

export default function HomeHeader() {
  return (
    <View className="mb-5">
      <Text className="text-[28px] leading-[31px] font-bold text-[#26364D] tracking-[-0.7px]">
        Where to in the{"\n"}
        <Text className="text-[#13A7E8]">Philippines?</Text>
      </Text>
      <Text className="mt-[7px] text-xs text-[#81909B] font-medium">
        Discover your next adventure.
      </Text>
    </View>
  );
}