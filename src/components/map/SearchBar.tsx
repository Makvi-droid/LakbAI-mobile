import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useMapboxSearch } from "../../hooks/useMapboxSearch";
import { GeocodingFeature } from "../../types/geocoding";

type SearchBarProps = {
  onSelectLocation: (feature: GeocodingFeature) => void;
};

export default function SearchBar({ onSelectLocation }: SearchBarProps) {
  const { query, setQuery, results, loading, clearResults } = useMapboxSearch();

  const handleSelect = (feature: GeocodingFeature) => {
    onSelectLocation(feature);
    setQuery(feature.fullAddress);
    clearResults();
  };

  const handleClear = () => {
    setQuery("");
    clearResults();
  };

  return (
    <View>
      <View
        className="h-[46px] rounded-full bg-white flex-row items-center px-[17px]"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <Ionicons name="search-outline" size={18} color="#B7C7D1" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search a place in the Philippines..."
          placeholderTextColor="#B7C7D1"
          className="flex-1 ml-[9px] text-xs text-[#26364D]"
        />
        {loading && <ActivityIndicator size="small" color="#13A7E8" />}
        {!loading && query.length > 0 && (
          <Pressable onPress={handleClear}>
            <Ionicons name="close-circle" size={16} color="#B7C7D1" />
          </Pressable>
        )}
      </View>

      {results.length > 0 && (
        <View
          className="bg-white rounded-2xl mt-2 overflow-hidden"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          {results.map((feature) => (
            <Pressable
              key={feature.id}
              onPress={() => handleSelect(feature)}
              className="flex-row items-center px-4 py-3 border-b border-[#F0F4F6]"
            >
              <Ionicons name="location-outline" size={16} color="#13A7E8" />
              <Text
                className="ml-2 text-xs text-[#26364D] flex-1"
                numberOfLines={1}
              >
                {feature.fullAddress}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}