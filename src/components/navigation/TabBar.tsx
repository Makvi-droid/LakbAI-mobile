import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Tabs } from "expo-router";
import type { ComponentProps } from "react";

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

export default function TabBar({ state, navigation }: TabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
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
              <Pressable key={route.key} onPress={onPress} style={styles.aiTab}>
                <View style={styles.aiAvatarWrapper}>
                  <Text style={styles.aiEmoji}>🤖</Text>
                  <View style={styles.aiBadge} />
                </View>
              </Pressable>
            );
          }

          const iconName = ICONS[route.name] ?? "ellipse-outline";

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.tabActive]}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? "#FFFFFF" : "#8A8A8E"}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  alignItems: "center",
},
bar: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  width: "100%",
  backgroundColor: "#FFFFFF",
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  paddingHorizontal: 12,
  paddingTop: 12,
  paddingBottom: 24, // extra bottom padding to cover the home-indicator area
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 10,
},
  tab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#16233F",
  },
  // center AI tab — elevated above the bar, like a FAB
  aiTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20, // pop it above the bar
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  aiAvatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#16233F",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  aiEmoji: {
    fontSize: 26,
  },
  aiBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
});