import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

type Traveler = "Solo" | "Couple" | "Family" | "Group";
const TRAVELERS: Traveler[] = ["Solo", "Couple", "Family", "Group"];

type DateMode = "start" | "end";

function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatNumber(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

export default function CalendarScreen() {
  const [traveler, setTraveler] = useState<Traveler>("Solo");

  // Date range state
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>("start");

  // Budget range state
  const [minBudget, setMinBudget] = useState("15,000");
  const [maxBudget, setMaxBudget] = useState("25,000");
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [draftMin, setDraftMin] = useState(minBudget);
  const [draftMax, setDraftMax] = useState(maxBudget);

  const dateLabel =
    startDate && endDate
      ? `${formatDate(startDate)} – ${formatDate(endDate)}`
      : startDate
        ? `${formatDate(startDate)} – Select end date`
        : "Select your dates";

  const budgetLabel =
    minBudget && maxBudget
      ? `₱${minBudget} – ₱${maxBudget}`
      : "Set your budget";

  const handleDayPress = (day: DateData) => {
    if (dateMode === "start") {
      setStartDate(day.dateString);
      if (endDate && day.dateString > endDate) setEndDate(null);
      setDateMode("end");
    } else {
      if (startDate && day.dateString < startDate) {
        setStartDate(day.dateString);
        setEndDate(null);
        setDateMode("end");
      } else {
        setEndDate(day.dateString);
      }
    }
  };

  const RANGE_COLOR = "#9CA3AF"; // medium-dark gray, adjust to taste
  const RANGE_TEXT_COLOR = "#fff";

  const getMarkedDates = () => {
    if (!startDate) return {};
    if (!endDate) {
      return {
        [startDate]: {
          startingDay: true,
          endingDay: true,
          color: RANGE_COLOR,
          textColor: RANGE_TEXT_COLOR,
        },
      };
    }
    const marked: Record<string, any> = {};
    let current = new Date(startDate + "T00:00:00");
    const last = new Date(endDate + "T00:00:00");
    while (current <= last) {
      const key = toDateString(current);
      marked[key] = {
        color: RANGE_COLOR,
        textColor: RANGE_TEXT_COLOR,
        startingDay: key === startDate,
        endingDay: key === endDate,
      };
      current.setDate(current.getDate() + 1);
    }
    return marked;
  };

  const openDateModal = (mode: DateMode) => {
    setDateMode(mode);
    setDateModalVisible(true);
  };

  const openBudgetModal = () => {
    setDraftMin(minBudget);
    setDraftMax(maxBudget);
    setBudgetModalVisible(true);
  };

  const saveBudget = () => {
    const minVal = Number(draftMin.replace(/,/g, "")) || 0;
    const maxVal = Number(draftMax.replace(/,/g, "")) || 0;
    if (minVal > maxVal) {
      setMinBudget(draftMax);
      setMaxBudget(draftMin);
    } else {
      setMinBudget(draftMin);
      setMaxBudget(draftMax);
    }
    setBudgetModalVisible(false);
  };

  const canGenerate = !!(startDate && endDate && minBudget && maxBudget);

  return (
    <LinearGradient colors={["#E8F4F1", "#EAF6FB"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.content}>
          <Text style={styles.heading}>Plan your{"\n"}Perfect Trip</Text>

          {/* Travel dates card */}
          <View style={styles.card}>
            <View style={styles.cardLabelRow}>
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text style={styles.cardLabel}>Travel Dates</Text>
            </View>
            <View style={styles.dateButtonsRow}>
              <TouchableOpacity
                style={styles.dateButton}
                activeOpacity={0.8}
                onPress={() => openDateModal("start")}
              >
                <Text style={styles.dateButtonLabel}>Start</Text>
                <Text style={styles.dateButtonValue}>
                  {startDate ? formatDate(startDate) : "Select"}
                </Text>
              </TouchableOpacity>

              <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />

              <TouchableOpacity
                style={styles.dateButton}
                activeOpacity={0.8}
                onPress={() => openDateModal("end")}
              >
                <Text style={styles.dateButtonLabel}>End</Text>
                <Text style={styles.dateButtonValue}>
                  {endDate ? formatDate(endDate) : "Select"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Budget card */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={openBudgetModal}
          >
            <View style={styles.cardLabelRow}>
              <Ionicons name="pricetag-outline" size={14} color="#6B7280" />
              <Text style={styles.cardLabel}>Budget Range</Text>
            </View>
            <Text style={styles.cardValue}>{budgetLabel}</Text>
          </TouchableOpacity>

          {/* Who's going */}
          <Text style={styles.sectionLabel}>Who's going?</Text>
          <View style={styles.pillWrap}>
            {TRAVELERS.map((t) => {
              const active = t === traveler;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTraveler(t)}
                  style={[styles.pill, active && styles.pillActive]}
                >
                  <Text
                    style={[styles.pillText, active && styles.pillTextActive]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Generate button */}
          <TouchableOpacity
            style={[
              styles.generateBtn,
              !canGenerate && styles.generateBtnDisabled,
            ]}
            activeOpacity={0.85}
            disabled={!canGenerate}
            onPress={() => {
              // TODO: call your trip-generation backend / navigate to results
              console.log({
                startDate,
                endDate,
                minBudget,
                maxBudget,
                traveler,
              });
            }}
          >
            <Ionicons name="sparkles" size={18} color="#F5B942" />
            <Text style={styles.generateText}>Generate Magic</Text>
          </TouchableOpacity>
          {!canGenerate && (
            <Text style={styles.hintText}>
              Pick your dates and budget to continue
            </Text>
          )}
        </View>

        {/* Date picker modal */}
        <Modal visible={dateModalVisible} animationType="slide" transparent>
          <Pressable
            style={styles.backdrop}
            onPress={() => setDateModalVisible(false)}
          >
            <Pressable
              style={styles.modalCard}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>Select your travel dates</Text>

              <View style={styles.modeToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.modeToggleBtn,
                    dateMode === "start" && styles.modeToggleBtnActive,
                  ]}
                  onPress={() => setDateMode("start")}
                >
                  <Text
                    style={[
                      styles.modeToggleText,
                      dateMode === "start" && styles.modeToggleTextActive,
                    ]}
                  >
                    Start Date{startDate ? `: ${formatDate(startDate)}` : ""}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modeToggleBtn,
                    dateMode === "end" && styles.modeToggleBtnActive,
                  ]}
                  onPress={() => setDateMode("end")}
                >
                  <Text
                    style={[
                      styles.modeToggleText,
                      dateMode === "end" && styles.modeToggleTextActive,
                    ]}
                  >
                    End Date{endDate ? `: ${formatDate(endDate)}` : ""}
                  </Text>
                </TouchableOpacity>
              </View>

              <Calendar
                markingType="period"
                markedDates={getMarkedDates()}
                onDayPress={handleDayPress}
                minDate={toDateString(new Date())}
                theme={{
                  todayTextColor: "#111827",
                  arrowColor: "#111827",
                  selectedDayBackgroundColor: "#111827",
                }}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalSecondaryBtn}
                  onPress={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setDateMode("start");
                  }}
                >
                  <Text style={styles.modalSecondaryText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => setDateModalVisible(false)}
                >
                  <Text style={styles.modalPrimaryText}>Done</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Budget range modal */}
        <Modal visible={budgetModalVisible} animationType="slide" transparent>
          <Pressable
            style={styles.backdrop}
            onPress={() => setBudgetModalVisible(false)}
          >
            <Pressable
              style={styles.modalCard}
              onPress={(e) => e.stopPropagation()}
            >
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
                      onChangeText={(v) => setDraftMin(formatNumber(v))}
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
                      onChangeText={(v) => setDraftMax(formatNumber(v))}
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalSecondaryBtn}
                  onPress={() => setBudgetModalVisible(false)}
                >
                  <Text style={styles.modalSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={saveBudget}
                >
                  <Text style={styles.modalPrimaryText}>Save</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 24 },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 34,
    marginBottom: 24,
  },

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

  sectionLabel: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    marginTop: 6,
    marginBottom: 10,
  },
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
  hintText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 10,
  },

  // Modal shared styles
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
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

  // Date mode toggle
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

  // Budget range modal
  budgetRangeRow: { flexDirection: "row", gap: 12 },
  budgetInputWrap: { flex: 1 },
  budgetInputLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 6,
  },
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
