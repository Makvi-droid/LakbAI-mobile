import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BudgetCardProps {
    budgetLabel: string;
    onPress: () => void;
}

export function BudgetCard({ budgetLabel, onPress }: BudgetCardProps) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
            <View style={styles.cardLabelRow}>
                <Ionicons name="pricetag-outline" size={14} color="#6B7280" />
                <Text style={styles.cardLabel}>Budget Range</Text>
            </View>
            <Text style={styles.cardValue}>{budgetLabel}</Text>
        </TouchableOpacity>
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
    cardValue: { fontSize: 16, fontWeight: "600", color: "#111827" },
});