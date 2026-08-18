import { useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";

type CategoryTabsProps = {
  categories: string[];
  onSelect?: (category: string) => void;
};

export default function CategoryTabs({ categories, onSelect }: CategoryTabsProps) {
  const [active, setActive] = useState(categories[0]);

  const handleSelect = (category: string) => {
    setActive(category);
    onSelect?.(category);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 pb-[30px]"
    >
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <Pressable
            key={category}
            onPress={() => handleSelect(category)}
            className={`h-[31px] px-4 rounded-full justify-center items-center ${
              isActive ? "bg-[#13A7E8]" : "bg-white"
            }`}
          >
            <Text
              className={`text-[10px] font-semibold ${
                isActive ? "text-white" : "text-[#657682]"
              }`}
            >
              {category}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}