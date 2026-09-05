import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import { BudgetCard } from "../../components/itineraries/BudgetCard";
import { BudgetModal } from "../../components/itineraries/BudgetModal";
import { DateMode, DatePickerModal } from "../../components/itineraries/DatePickerModal";
import { GenerateButton } from "../../components/itineraries/GenerateButton";
import { TravelDatesCard } from "../../components/itineraries/TravelDatesCard";
import { TravelerPills } from "../../components/itineraries/TravelerPills";
import { useCreateItinerary } from "../../hooks/useCreateItinerary";
import { TravelType } from "../../types/itinerary";

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

const RANGE_COLOR = "#9CA3AF";
const RANGE_TEXT_COLOR = "#fff";

export default function CalendarScreen() {
  const { createItinerary, loading, error } = useCreateItinerary();

  const [traveler, setTraveler] = useState<TravelType>("Solo");

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>("start");

  const [minBudget, setMinBudget] = useState("15,000");
  const [maxBudget, setMaxBudget] = useState("25,000");
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [draftMin, setDraftMin] = useState(minBudget);
  const [draftMax, setDraftMax] = useState(maxBudget);

  const dateLabel = {
    start: startDate ? formatDate(startDate) : "Select",
    end: endDate ? formatDate(endDate) : "Select",
  };

  const budgetLabel =
    minBudget && maxBudget ? `₱${minBudget} – ₱${maxBudget}` : "Set your budget";

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

  const handleGenerate = async () => {
    if (!startDate || !endDate) return;

    // ASSUMPTION: there's no title field in this screen yet, so we build one.
    // Swap this for a real title input whenever you add one.
    const title = `${traveler} Trip — ${formatDate(startDate)} to ${formatDate(endDate)}`;
    const totalBudget = Number(maxBudget.replace(/,/g, "")) || 0;

    const itinerary = await createItinerary({
      title,
      start_date: startDate,
      end_date: endDate,
      total_budget: totalBudget,
      travel_type: traveler,
    });

    if (!itinerary) {
      Alert.alert("Couldn't create itinerary", error ?? "Please try again.");
      return;
    }

    Alert.alert("Itinerary created!", title);
  };

  return (
    <LinearGradient colors={["#E8F4F1", "#EAF6FB"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.content}>
          <Text style={styles.heading}>Plan your{"\n"}Perfect Trip</Text>

          <TravelDatesCard
            startLabel={dateLabel.start}
            endLabel={dateLabel.end}
            onPressStart={() => openDateModal("start")}
            onPressEnd={() => openDateModal("end")}
          />

          <BudgetCard budgetLabel={budgetLabel} onPress={openBudgetModal} />

          <Text style={styles.sectionLabel}>Who's going?</Text>
          <TravelerPills selected={traveler} onSelect={setTraveler} />

          <GenerateButton
            disabled={!canGenerate}
            loading={loading}
            onPress={handleGenerate}
          />
          {!canGenerate && (
            <Text style={styles.hintText}>Pick your dates and budget to continue</Text>
          )}
        </View>

        <DatePickerModal
          visible={dateModalVisible}
          dateMode={dateMode}
          startDate={startDate}
          endDate={endDate}
          markedDates={getMarkedDates()}
          minDate={toDateString(new Date())}
          onSetMode={setDateMode}
          onDayPress={handleDayPress}
          onClear={() => {
            setStartDate(null);
            setEndDate(null);
            setDateMode("start");
          }}
          onDone={() => setDateModalVisible(false)}
          onClose={() => setDateModalVisible(false)}
          formatDate={formatDate}
        />

        <BudgetModal
          visible={budgetModalVisible}
          draftMin={draftMin}
          draftMax={draftMax}
          onChangeMin={(v) => setDraftMin(formatNumber(v))}
          onChangeMax={(v) => setDraftMax(formatNumber(v))}
          onCancel={() => setBudgetModalVisible(false)}
          onSave={saveBudget}
        />
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
  sectionLabel: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    marginTop: 6,
    marginBottom: 10,
  },
  hintText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 10,
  },
});