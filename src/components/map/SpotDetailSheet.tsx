import { CROWD_COLORS, MapSpot } from "@/constants/mapSpots";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SpotDetailSheetProps {
  spot: MapSpot | null;
  visible: boolean;
  onClose: () => void;
  onAskLakbAI: (spot: MapSpot) => void;
}

const CROWD_LABELS: Record<string, string> = {
  low: "Low crowd",
  moderate: "Moderate crowd",
  busy: "Busy",
};

export default function SpotDetailSheet({
  spot,
  visible,
  onClose,
  onAskLakbAI,
}: SpotDetailSheetProps) {
  if (!spot) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Image source={{ uri: spot.image }} style={styles.image} />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color="#111827" />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Text style={styles.name}>{spot.name}</Text>
              <View style={styles.crowdPill}>
                <View
                  style={[
                    styles.crowdDot,
                    { backgroundColor: CROWD_COLORS[spot.crowd] },
                  ]}
                />
                <Text style={styles.crowdText}>{CROWD_LABELS[spot.crowd]}</Text>
              </View>
            </View>

            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{spot.category}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{spot.region}</Text>
              </View>
            </View>

            <Text style={styles.description}>{spot.description}</Text>

            <TouchableOpacity
              style={styles.askBtn}
              onPress={() => onAskLakbAI(spot)}
              activeOpacity={0.85}
            >
              <Ionicons name="sparkles" size={16} color="#F5B942" />
              <Text style={styles.askBtnText}>Ask LakbAI about this spot</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingBottom: 24,
  },
  image: { width: "100%", height: 180, backgroundColor: "#E5E7EB" },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  name: { flex: 1, fontSize: 20, fontWeight: "700", color: "#111827" },
  crowdPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  crowdDot: { width: 6, height: 6, borderRadius: 3 },
  crowdText: { fontSize: 11, fontWeight: "600", color: "#374151" },
  tagRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  tag: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { fontSize: 12, fontWeight: "600", color: "#3B82F6" },
  description: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginTop: 14,
  },
  askBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#111827",
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 18,
  },
  askBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
