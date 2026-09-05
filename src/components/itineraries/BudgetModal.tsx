import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface BudgetModalProps {
    visible: boolean;
    draftMin: string;
    draftMax: string;
    onChangeMin: (v: string) => void;
    onChangeMax: (v: string) => void;
    onCancel: () => void;
    onSave: () => void;
}

export function BudgetModal({
    visible,
    draftMin,
    draftMax,
    onChangeMin,
    onChangeMax,
    onCancel,
    onSave,
}: BudgetModalProps) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <Pressable style={styles.backdrop} onPress={onCancel}>
                <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.modalTitle}>Set your budget range</Text>

                    <View style={styles.budgetRangeRow}>
                        <View style={styles.budgetInputWrap}>
                            <Text style={styles.budgetInputLabel}>Min</Text>
                            <View style={styles.budgetInputRow}>
                                <Text style={styles.pesoSign}>₱</Text>
                                <TextInput
                                    style={styles.budgetInput}
                                    keyboardType="number-pad"
                                    value={draftMin}
                                    onChangeText={onChangeMin}
                                    placeholder="0"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        <View style={styles.budgetInputWrap}>
                            <Text style={styles.budgetInputLabel}>Max</Text>
                            <View style={styles.budgetInputRow}>
                                <Text style={styles.pesoSign}>₱</Text>
                                <TextInput
                                    style={styles.budgetInput}
                                    keyboardType="number-pad"
                                    value={draftMax}
                                    onChangeText={onChangeMax}
                                    placeholder="0"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.modalSecondaryBtn} onPress={onCancel}>
                            <Text style={styles.modalSecondaryText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalPrimaryBtn} onPress={onSave}>
                            <Text style={styles.modalPrimaryText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
    modalCard: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 32,
    },
    modalTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 12 },
    modalActions: { flexDirection: "row", gap: 12, marginTop: 16 },
    modalSecondaryBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
        backgroundColor: "#F3F4F6",
    },
    modalSecondaryText: { fontWeight: "600", color: "#374151" },
    modalPrimaryBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
        backgroundColor: "#111827",
    },
    modalPrimaryText: { fontWeight: "700", color: "#fff" },
    budgetRangeRow: { flexDirection: "row", gap: 12 },
    budgetInputWrap: { flex: 1 },
    budgetInputLabel: { fontSize: 12, color: "#6B7280", fontWeight: "500", marginBottom: 6 },
    budgetInputRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 4,
    },
    pesoSign: { fontSize: 16, fontWeight: "700", color: "#111827" },
    budgetInput: { flex: 1, fontSize: 16, fontWeight: "700", color: "#111827" },
});