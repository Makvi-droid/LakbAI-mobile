import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type ZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export default function ZoomControls({ onZoomIn, onZoomOut }: ZoomControlsProps) {
  return (
    <View
      className="bg-white rounded-2xl overflow-hidden self-end"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <Pressable
        onPress={onZoomIn}
        className="w-10 h-10 items-center justify-center border-b border-[#F0F4F6]"
      >
        <Ionicons name="add" size={20} color="#26364D" />
      </Pressable>
      <Pressable onPress={onZoomOut} className="w-10 h-10 items-center justify-center">
        <Ionicons name="remove" size={20} color="#26364D" />
      </Pressable>
    </View>
  );
}