import { Pressable, Text, View } from "react-native";

export type DetailTab = "overview" | "reviews" | "trends";

type DetailTabsProps = {
  active: DetailTab;
  onChange: (tab: DetailTab) => void;
};

const tabs: { key: DetailTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "reviews", label: "Reviews" },
  { key: "trends", label: "Trends" },
];

export default function DetailTabs({ active, onChange }: DetailTabsProps) {
  return (
    <View className="flex-row justify-center gap-7 mt-[13px] mb-[15px]">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            className={`rounded-2xl px-[17px] py-[7px] ${
              isActive ? "bg-[#13A9E9]" : ""
            }`}
          >
            <Text
              className={`text-[10px] ${
                isActive ? "text-white font-semibold" : "text-[#758691] font-medium"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}