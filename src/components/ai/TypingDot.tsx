import { useState } from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export function TypingDot({ delay }: { delay: number }) {
    const opacity = useSharedValue(0.3);

    useState(() => {
        opacity.value = withDelay(
            delay,
            withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.3, { duration: 400 })), -1, true)
        );
    });

    const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return <Animated.View style={style} className="w-2 h-2 rounded-full bg-gray-500 mx-0.5" />;
}