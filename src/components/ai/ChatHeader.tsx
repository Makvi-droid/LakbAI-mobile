import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export function ChatHeader({ onNewSession }: { onNewSession: () => void }) {
    return (
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
            <View>
                <Text className="text-lg font-bold text-gray-900">LakbAI 🤖</Text>
                <Text className="text-xs text-gray-400">Your AI travel guide</Text>
            </View>
            <Pressable onPress={onNewSession} className="p-2 active:opacity-60">
                <Ionicons name="add-circle-outline" size={26} color="#2563eb" />
            </Pressable>
        </View>
    );
}