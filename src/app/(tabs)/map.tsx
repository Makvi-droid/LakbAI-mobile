import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SpotDetailSheet from "@/components/map/SpotDetailSheet";
import { CROWD_COLORS, MapSpot, mapSpots } from "@/constants/mapSpots"; // now imported, not inline

const REGIONS = ["All", "Luzon", "Visayas", "Mindanao"];
const CATEGORIES = ["All", "Beach", "Heritage", "Adventure", "Cultural"];

export default function MapScreen() {
  const [region, setRegion] = useState("All");
  const [category, setCategory] = useState("All");

  // NEW: track which spot was tapped
  const [selectedSpot, setSelectedSpot] = useState<MapSpot | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  // NEW: filter spots by region/category
  const visibleSpots = mapSpots.filter((spot) => {
    const matchesRegion = region === "All" || spot.region === region;
    const matchesCategory = category === "All" || spot.category === category;
    return matchesRegion && matchesCategory;
  });

  const handlePinPress = (spot: MapSpot) => {
    setSelectedSpot(spot);
    setSheetVisible(true);
  };

  const handleAskLakbAI = (spot: MapSpot) => {
    setSheetVisible(false);
    // pass spot context to the AI tab
    router.push({
      pathname: "/ai",
      params: { spotId: spot.id, spotName: spot.name },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <LinearGradient
        colors={["#DDEBEF", "#E7E8DE", "#DDEBEF"]}
        style={StyleSheet.absoluteFill}
      >
        {visibleSpots.map((spot) => (
          <TouchableOpacity
            key={spot.id}
            style={[styles.pinWrap, { left: `${spot.x}%`, top: `${spot.y}%` }]}
            onPress={() => handlePinPress(spot)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.pinHalo,
                { backgroundColor: `${CROWD_COLORS[spot.crowd]}33` },
              ]}
            >
              <View
                style={[
                  styles.pinDot,
                  { backgroundColor: CROWD_COLORS[spot.crowd] },
                ]}
              >
                <Ionicons name="location" size={14} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </LinearGradient>

      {/* Top card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Map</Text>
          <Text style={styles.subtitle}>{visibleSpots.length} spots</Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Where to next?"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.pillRow}>
          {REGIONS.map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRegion(r)}
              style={[styles.pill, region === r && styles.pillActive]}
            >
              <Text
                style={[styles.pillText, region === r && styles.pillTextActive]}
              >
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.categoryRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setCategory(c)}
            style={[styles.categoryPill, category === c && styles.pillActive]}
          >
            <Text
              style={[styles.pillText, category === c && styles.pillTextActive]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn}>
          <Ionicons name="add" size={20} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn}>
          <Ionicons name="remove" size={20} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn}>
          <Ionicons name="locate" size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.askButton}>
          <Text style={styles.askTitle}>Ask LakbAI</Text>
          <Text style={styles.askSubtitle}>about this area</Text>
        </TouchableOpacity>

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Crowd</Text>
          {(["low", "moderate", "busy"] as const).map((level) => (
            <View key={level} style={styles.legendRow}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: CROWD_COLORS[level] },
                ]}
              />
              <Text style={styles.legendLabel}>
                {level[0].toUpperCase() + level.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* NEW: spot detail bottom sheet */}
      <SpotDetailSheet
        spot={selectedSpot}
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onAskLakbAI={handleAskLakbAI}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E5E7EB" },
  pinWrap: { position: "absolute", marginLeft: -20, marginTop: -20 },
  pinHalo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pinDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    position: "absolute",
    top: 12,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 13, color: "#6B7280" },
  searchBar: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111827" },
  pillRow: { flexDirection: "row", marginTop: 12, gap: 8, flexWrap: "wrap" },

  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  pillActive: { backgroundColor: "#3B82F6" },
  pillText: { fontSize: 13, fontWeight: "500", color: "#6B7280" },
  pillTextActive: { color: "#fff", fontWeight: "600" },

  categoryRow: {
    position: "absolute",
    top: 205,
    left: 16,
    right: 16,
    zIndex: 9,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  controls: { position: "absolute", right: 16, top: 260, zIndex: 8, gap: 10 },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  bottomRow: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  askButton: {
    backgroundColor: "#F5B942",
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: "#F5B942",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  askTitle: { fontSize: 13, fontWeight: "700", color: "#111827" },
  askSubtitle: { fontSize: 11, color: "#4B5563" },

  legend: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
    minWidth: 110,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  legendTitle: { fontSize: 12, fontWeight: "700", color: "#111827" },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 12, color: "#374151" },
});
