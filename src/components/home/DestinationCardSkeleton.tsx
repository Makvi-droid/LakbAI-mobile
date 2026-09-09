import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

export default function DestinationCardSkeleton() {
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            -1,
            true,
        );
    }, [opacity]);

    const shimmerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <View className="bg-white rounded-[20px] p-[9px] mb-[14px]">
            <Animated.View
                className="h-[155px] rounded-[15px] bg-[#E7EEF1]"
                style={shimmerStyle}
            />
            <View className="min-h-[55px] justify-center px-[6px] pt-[8px] gap-2">
                <Animated.View
                    className="h-[14px] w-2/3 rounded-full bg-[#E7EEF1]"
                    style={shimmerStyle}
                />
                <Animated.View
                    className="h-[10px] w-1/3 rounded-full bg-[#E7EEF1]"
                    style={shimmerStyle}
                />
            </View>
        </View>
    );
}