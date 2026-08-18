import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ImageSourcePropType, Pressable, Text, View } from "react-native";

type DetailHeroProps = {
  image: ImageSourcePropType;
  location: string;
  title: string;
  onFavoritePress?: () => void;
};

export default function DetailHero({
  image,
  location,
  title,
  onFavoritePress,
}: DetailHeroProps) {
  return (
    <View className="h-[245px] relative overflow-hidden">
      <Image source={image} className="w-full h-full" resizeMode="cover" />

      <Pressable
        onPress={() => router.back()}
        className="absolute top-[42px] left-[14px] w-[31px] h-[31px] rounded-2xl bg-white/90 items-center justify-center"
      >
        <Ionicons name="chevron-back" size={18} color="#26364D" />
      </Pressable>

      <Pressable
        onPress={onFavoritePress}
        className="absolute top-[42px] right-[14px] w-[31px] h-[31px] rounded-2xl bg-white/90 items-center justify-center"
      >
        <Ionicons name="heart-outline" size={17} color="#F05C67" />
      </Pressable>

      <View className="absolute left-[18px] bottom-[47px] flex-row items-center">
        <Ionicons name="location" size={10} color="#FFFFFF" />
        <Text className="text-white text-[9px] font-medium ml-[3px]">
          {location}
        </Text>
      </View>

      <Text className="absolute left-[18px] bottom-5 text-white text-[25px] font-bold">
        {title}
      </Text>
    </View>
  );
}