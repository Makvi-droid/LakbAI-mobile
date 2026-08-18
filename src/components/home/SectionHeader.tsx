import { Pressable, Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export default function SectionHeader({
  title,
  actionLabel = "See all",
  onPressAction,
}: SectionHeaderProps) {
  return (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-[17px] font-bold text-[#26364D]">{title}</Text>
      <Pressable onPress={onPressAction}>
        <Text className="text-[11px] font-semibold text-[#13A7E8]">
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}