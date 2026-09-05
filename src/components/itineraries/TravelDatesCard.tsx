import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TravelDatesCardProps {
    startLabel: string;
    endLabel: string;
    onPressStart: () => void;
    onPressEnd: () => void;
}

export function TravelDatesCard({
    startLabel,
    endLabel,
    onPressStart,
    onPressEnd,
}: TravelDatesCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardLabelRow}>
                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                <Text style={styles.cardLabel}>Travel Dates</Text>
            </View>
            <View style={styles.dateButtonsRow}>
                <TouchableOpacity
                    style={styles.dateButton}
                    activeOpacity={0.8}
                    onPress={onPressStart}
                >
                    <Text style={styles.dateButtonLabel}>Start</Text>
                    <Text style={styles.dateButtonValue}>{startLabel}</Text>
                </TouchableOpacity>

                <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />

                <TouchableOpacity
                    style={styles.dateButton}
                    activeOpacity={0.8}
                    onPress={onPressEnd}
                >
                    <Text style={styles.dateButtonLabel}>End</Text>
                    <Text style={styles.dateButtonValue}>{endLabel}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    cardLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
    },
    cardLabel: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
    dateButtonsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    dateButton: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    dateButtonLabel: {
        fontSize: 11,
        color: "#6B7280",
        fontWeight: "500",
        marginBottom: 2,
    },
    dateButtonValue: { fontSize: 15, fontWeight: "700", color: "#111827" },
});