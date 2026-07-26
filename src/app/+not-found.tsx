import { Link, Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <LinearGradient
          colors={["#0B3D5C", "#1E6E8C", "#3FA9A0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <View style={styles.iconBadge}>
            <Ionicons name="compass-outline" size={40} color="#FF7A45" />
          </View>

          <Text style={styles.title}>You're off the map</Text>
          <Text style={styles.subtitle}>
            This screen doesn't exist or may have been moved.
          </Text>

          <Link href="/" asChild>
            <View style={styles.button}>
              <Ionicons name="home-outline" size={18} color="#FFFFFF" />
              <Text style={styles.buttonText}>Back to home</Text>
            </View>
          </Link>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B3D5C",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconBadge: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 50,
    paddingHorizontal: 24,
    backgroundColor: "#FF7A45",
    borderRadius: 14,
    shadowColor: "#FF7A45",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});