import Animated, { FadeInUp } from "react-native-reanimated";
import { TypingDot } from "./TypingDot";

export function TypingIndicator() {
    return (
        <Animated.View
            entering={FadeInUp.duration(200)}
            className="self-start bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 mb-2 flex-row items-center"
        >
            <TypingDot delay={0} />
            <TypingDot delay={150} />
            <TypingDot delay={300} />
        </Animated.View>
    );
}