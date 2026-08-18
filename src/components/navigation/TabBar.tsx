import { Ionicons } from "@expo/vector-icons";
import type { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type TabBarProps = NonNullable<ComponentProps<typeof Tabs>["tabBar"]> extends (
  props: infer P
) => any
  ? P
  : never;

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "compass-outline",
  map: "map-outline",
  calendar: "calendar-outline",
  profile: "person-outline",
};

function TabIcon({
  isFocused,
  iconName,
}: {
  isFocused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
}) {
  // Reanimated only — the background/scale react to shared changes via
  // useAnimatedStyle, never by reading `.value` inside a plain style prop.
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isFocused ? "#16233F" : "transparent", {
      duration: 200,
    }),
    transform: [{ scale: withSpring(isFocused ? 1 : 0.94) }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="w-12 h-12 rounded-full items-center justify-center"
    >
      <Ionicons
        name={iconName}
        size={22}
        color={isFocused ? "#FFFFFF" : "#8A8A8E"}
      />
    </Animated.View>
  );
}

export default function TabBar({ state, navigation }: TabBarProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 items-center">
      <View
        className="flex-row items-center justify-around w-full bg-white rounded-t-[24px] px-3 pt-3 pb-6"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isAI = route.name === "ai";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isAI) {
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                className="w-14 h-14 rounded-full items-center justify-center -mt-5 bg-white"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: 8,
                }}
              >
                <View className="w-[52px] h-[52px] rounded-full bg-[#16233F] items-center justify-center">
                  <Text className="text-2xl">🤖</Text>
                  <View className="absolute top-0.5 right-0.5 w-[10px] h-[10px] rounded-full bg-[#FF3B30] border-[1.5px] border-white" />
                </View>
              </Pressable>
            );
          }

          const iconName = ICONS[route.name] ?? "ellipse-outline";

          return (
            <Pressable key={route.key} onPress={onPress} hitSlop={8}>
              <TabIcon isFocused={isFocused} iconName={iconName} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}