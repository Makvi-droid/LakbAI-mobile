import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

interface GenerateButtonProps {
    disabled: boolean;
    loading: boolean;
    onPress: () => void;
}

export function GenerateButton({ disabled, loading, onPress }: GenerateButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.generateBtn, disabled && styles.generateBtnDisabled]}
            activeOpacity={0.85}
            disabled={disabled || loading}
            onPress={onPress}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <>
                    <Ionicons name="sparkles" size={18} color="#F5B942" />
                    <Text style={styles.generateText}>Generate Magic</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    generateBtn: {
        marginTop: 28,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#111827",
        borderRadius: 20,
        paddingVertical: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    generateBtnDisabled: { opacity: 0.4 },
    generateText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});