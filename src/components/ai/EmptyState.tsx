import { AI_SUGGESTIONS } from "@/constants/aiSuggestions";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export function EmptyState({ onPickSuggestion }: { onPickSuggestion: (text: string) => void }) {
    return (
        <Animated.View entering={FadeInUp.duration(300)} className="flex-1 items-center justify-center px-6">
            <Text className="text-4xl mb-2">🤖</Text>
            <Text className="text-xl font-semibold text-gray-900 mb-1">Kumusta! I'm LakbAI</Text>
            <Text className="text-gray-500 text-center mb-6">
                Ask me about destinations, itineraries, or local travel tips.
            </Text>
            <View className="flex-row flex-wrap justify-center gap-2">
                {AI_SUGGESTIONS.map((s) => (
                    <Pressable
                        key={s}
                        onPress={() => onPickSuggestion(s)}
                        className="bg-gray-100 rounded-full px-4 py-2 active:bg-gray-200"
                    >
                        <Text className="text-gray-700 text-sm">{s}</Text>
                    </Pressable>
                ))}
            </View>
        </Animated.View>
    );
}