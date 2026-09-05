import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

export type DateMode = "start" | "end";

interface DatePickerModalProps {
    visible: boolean;
    dateMode: DateMode;
    startDate: string | null;
    endDate: string | null;
    markedDates: Record<string, any>;
    minDate: string;
    onSetMode: (mode: DateMode) => void;
    onDayPress: (day: DateData) => void;
    onClear: () => void;
    onDone: () => void;
    onClose: () => void;
    formatDate: (dateStr: string) => string;
}

export function DatePickerModal({
    visible,
    dateMode,
    startDate,
    endDate,
    markedDates,
    minDate,
    onSetMode,
    onDayPress,
    onClear,
    onDone,
    onClose,
    formatDate,
}: DatePickerModalProps) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.modalTitle}>Select your travel dates</Text>

                    <View style={styles.modeToggleRow}>
                        <TouchableOpacity
                            style={[styles.modeToggleBtn, dateMode === "start" && styles.modeToggleBtnActive]}
                            onPress={() => onSetMode("start")}
                        >
                            <Text style={[styles.modeToggleText, dateMode === "start" && styles.modeToggleTextActive]}>
                                Start Date{startDate ? `: ${formatDate(startDate)}` : ""}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modeToggleBtn, dateMode === "end" && styles.modeToggleBtnActive]}
                            onPress={() => onSetMode("end")}
                        >
                            <Text style={[styles.modeToggleText, dateMode === "end" && styles.modeToggleTextActive]}>
                                End Date{endDate ? `: ${formatDate(endDate)}` : ""}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Calendar
                        markingType="period"
                        markedDates={markedDates}
                        onDayPress={onDayPress}
                        minDate={minDate}
                        theme={{
                            todayTextColor: "#111827",
                            arrowColor: "#111827",
                            selectedDayBackgroundColor: "#111827",
                        }}
                    />

                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.modalSecondaryBtn} onPress={onClear}>
                            <Text style={styles.modalSecondaryText}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalPrimaryBtn} onPress={onDone}>
                            <Text style={styles.modalPrimaryText}>Done</Text>
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
    modeToggleRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
    modeToggleBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
    },
    modeToggleBtnActive: { backgroundColor: "#111827" },
    modeToggleText: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
    modeToggleTextActive: { color: "#fff" },
});