import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";

interface ChatInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    sending: boolean;
}

export function ChatInput({ value, onChangeText, onSend, sending }: ChatInputProps) {
    return (
        <View className="flex-row items-end gap-2 px-4 py-3 border-t border-gray-100">
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder="Ask LakbAI anything..."
                placeholderTextColor="#9ca3af"
                multiline
                className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-base text-gray-900 max-h-28"
                editable={!sending}
            />
            <Pressable
                onPress={onSend}
                disabled={sending || !value.trim()}
                className={`w-11 h-11 rounded-full items-center justify-center ${sending || !value.trim() ? "bg-gray-200" : "bg-blue-600 active:bg-blue-700"
                    }`}
            >
                {sending ? (
                    <ActivityIndicator size="small" color="#6b7280" />
                ) : (
                    <Ionicons name="send" size={18} color={!value.trim() ? "#9ca3af" : "white"} />
                )}
            </Pressable>
        </View>
    );
}