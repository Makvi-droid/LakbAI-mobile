import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

export default function SearchBar() {
  return (
    <View className="h-[46px] rounded-full bg-[#E7F4F9] flex-row items-center px-[17px] mb-[14px]">
      <Ionicons name="search-outline" size={18} color="#B7C7D1" />
      <TextInput
        placeholder="Search destinations..."
        placeholderTextColor="#B7C7D1"
        className="flex-1 ml-[9px] text-xs text-[#26364D]"
      />
    </View>
  );
}