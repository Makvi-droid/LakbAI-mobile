import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ALL_PREFERENCES = [
  "Beach",
  "Heritage",
  "Nature",
  "Food",
  "Adventure",
  "Cultural",
  "Nightlife",
];

interface TravelPreferencesProps {
  initialSelected?: string[];
  onChange?: (selected: string[]) => void;
}

export default function TravelPreferences({
  initialSelected = [],
  onChange,
}: TravelPreferencesProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const toggle = (pref: string) => {
    setSelected((prev) => {
      const next = prev.includes(pref)
        ? prev.filter((p) => p !== pref)
        : [...prev, pref];
      onChange?.(next);
      return next;
    });
    // TODO: persist to your backend, e.g. updateUserPreferences(pref)
  };

  return (
    <View className="mb-6">
      <Text className="text-sm font-semibold text-[#374151] mb-3">
        Travel Preferences
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {ALL_PREFERENCES.map((pref) => {
          const active = selected.includes(pref);
          return (
            <TouchableOpacity
              key={pref}
              onPress={() => toggle(pref)}
              className={`px-4 py-2 rounded-full border ${
                active
                  ? "bg-[#3B82F6] border-[#3B82F6]"
                  : "bg-white border-[#E5E7EB]"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  active ? "text-white" : "text-[#374151]"
                }`}
              >
                {pref}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
