import type { ChatMessageRow } from "@/types/chat";
import { Text } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export function MessageBubble({ message }: { message: ChatMessageRow }) {
    const isUser = message.sender === "user";

    return (
        <Animated.View
            entering={isUser ? FadeInDown.duration(250) : FadeInUp.duration(250)}
            className={`max-w-[80%] rounded-2xl px-4 py-3 mb-2 ${isUser ? "self-end bg-blue-600 rounded-br-sm" : "self-start bg-gray-100 rounded-bl-sm"
                }`}
        >
            <Text className={isUser ? "text-white text-base" : "text-gray-900 text-base"}>
                {message.message_text}
            </Text>
        </Animated.View>
    );
}