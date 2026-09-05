import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TravelType } from "../../types/itinerary";

const TRAVELERS: TravelType[] = ["Solo", "Couple", "Family", "Group"];

interface TravelerPillsProps {
    selected: TravelType;
    onSelect: (traveler: TravelType) => void;
}

export function TravelerPills({ selected, onSelect }: TravelerPillsProps) {
    return (
        <View style={styles.pillWrap}>
            {TRAVELERS.map((t) => {
                const active = t === selected;
                return (
                    <TouchableOpacity
                        key={t}
                        onPress={() => onSelect(t)}
                        style={[styles.pill, active && styles.pillActive]}
                    >
                        <Text style={[styles.pillText, active && styles.pillTextActive]}>
                            {t}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    pillWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    pill: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    pillActive: { backgroundColor: "#BBF7D0", borderColor: "#BBF7D0" },
    pillText: { fontSize: 14, fontWeight: "500", color: "#374151" },
    pillTextActive: { color: "#065F46", fontWeight: "700" },
});