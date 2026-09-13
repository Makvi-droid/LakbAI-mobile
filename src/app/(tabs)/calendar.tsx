import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import { AIItineraryOptionsList } from "../../components/itineraries/AIItineraryOptionsList";
import { BudgetCard } from "../../components/itineraries/BudgetCard";
import { BudgetModal } from "../../components/itineraries/BudgetModal";
import { DateMode, DatePickerModal } from "../../components/itineraries/DatePickerModal";
import { GenerateButton } from "../../components/itineraries/GenerateButton";
import { MultiSelectChips } from "../../components/itineraries/MultiSelectChips";
import { TravelDatesCard } from "../../components/itineraries/TravelDatesCard";
import { TravelerPills } from "../../components/itineraries/TravelerPills";
import { PREFERRED_ACTIVITIES } from "../../constants/activities";
import { INTERESTS } from "../../constants/interests";
import { useGenerateItineraryOptions } from "../../hooks/useGenerateItineraryOptions";
import { useSaveGeneratedItinerary } from "../../hooks/useSaveGeneratedItinerary";
import { ItineraryGenerationParams, TravelType } from "../../types/itinerary";

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

type ScreenMode = "form" | "options";

export default function CalendarScreen() {
  const { generate, reset, loading: generating, error: generateError, options } =
    useGenerateItineraryOptions();
  const { save, loading: saving } = useSaveGeneratedItinerary();

  const [mode, setMode] = useState<ScreenMode>("form");
  const [choosingIndex, setChoosingIndex] = useState<number | null>(null);
  const [lastParams, setLastParams] = useState<ItineraryGenerationParams | null>(null);

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

  const [interests, setInterests] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);

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
        [startDate]: { startingDay: true, endingDay: true, color: RANGE_COLOR, textColor: RANGE_TEXT_COLOR },
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

  const toggleInterest = (value: string) => {
    setInterests((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const toggleActivity = (value: string) => {
    setActivities((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const canGenerate = !!(startDate && endDate && minBudget && maxBudget);

  const runGenerate = async () => {
    if (!startDate || !endDate) return;

    const params: ItineraryGenerationParams = {
      startDate,
      endDate,
      travelType: traveler,
      totalBudgetMax: Number(maxBudget.replace(/,/g, "")) || 0,
      interests,
      activities,
    };
    setLastParams(params);

    const result = await generate(params);
    if (result) {
      setMode("options");
    } else {
      Alert.alert("Couldn't generate itinerary", generateError ?? "Please try again.");
    }
  };

  const handleChoose = async (index: number) => {
    if (!options || !lastParams) return;
    setChoosingIndex(index);
    const saved = await save(options[index], lastParams);
    setChoosingIndex(null);

    if (!saved) {
      Alert.alert("Couldn't save itinerary", "Please try again.");
      return;
    }

    Alert.alert("Itinerary saved!", saved.title, [
      { text: "View in profile", onPress: () => router.push("/(tabs)/profile") },
      { text: "OK" },
    ]);

    reset();
    setMode("form");
  };

  return (
    <LinearGradient colors={["#E8F4F1", "#EAF6FB"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {mode === "form" ? (
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

            <MultiSelectChips
              label="What are you interested in?"
              options={INTERESTS}
              selected={interests}
              onToggle={toggleInterest}
            />

            <MultiSelectChips
              label="Preferred activities"
              options={PREFERRED_ACTIVITIES}
              selected={activities}
              onToggle={toggleActivity}
            />

            <GenerateButton disabled={!canGenerate} loading={generating} onPress={runGenerate} />
            {!canGenerate && <Text style={styles.hintText}>Pick your dates and budget to continue</Text>}
          </View>
        ) : (
          <View style={styles.content}>
            {generating || !options ? (
              <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" color="#13A9E9" />
                <Text className="text-xs text-gray-500 mt-3">Crafting your itinerary options...</Text>
              </View>
            ) : (
              <AIItineraryOptionsList
                options={options}
                choosingIndex={choosingIndex}
                onChoose={handleChoose}
                onRegenerate={runGenerate}
                onBackToEdit={() => setMode("form")}
              />
            )}
          </View>
        )}

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
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  heading: { fontSize: 28, fontWeight: "700", color: "#111827", lineHeight: 34, marginBottom: 24 },
  sectionLabel: { fontSize: 13, color: "#374151", fontWeight: "500", marginTop: 6, marginBottom: 10 },
  hintText: { textAlign: "center", fontSize: 12, color: "#6B7280", marginTop: 10 },
});