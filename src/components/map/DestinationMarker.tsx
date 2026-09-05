import { PointAnnotation } from "@rnmapbox/maps";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { DestinationRecord } from "../../types/destination";

const CROWD_LEVEL_COLORS: Record<string, string> = {
    low: "#4ADE80",
    medium: "#F5B942",
    high: "#F87171",
};

type DestinationMarkerProps = {
    destination: DestinationRecord;
    onPress: (destination: DestinationRecord) => void;
};

export default function DestinationMarker({
    destination,
    onPress,
}: DestinationMarkerProps) {
    const color = CROWD_LEVEL_COLORS[destination.crowd_level] ?? "#13A7E8";
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 1600, easing: Easing.out(Easing.ease) }),
            -1,
            false,
        );
    }, [pulse]);

    const pulseStyle = useAnimatedStyle(() => ({
        opacity: 0.5 * (1 - pulse.value),
        transform: [{ scale: 1 + pulse.value * 1.4 }],
    }));

    return (
        <PointAnnotation
            id={`destination-${destination.destination_id}`}
            coordinate={[destination.longitude, destination.latitude]}
            onSelected={() => onPress(destination)}
        >
            <View className="w-8 h-8 items-center justify-center">
                <Animated.View
                    className="absolute w-8 h-8 rounded-full"
                    style={[{ backgroundColor: color }, pulseStyle]}
                />
                <View
                    className="w-6 h-6 rounded-full items-center justify-center border-2 border-white"
                    style={{ backgroundColor: color }}
                >
                    <View className="w-2 h-2 rounded-full bg-white" />
                </View>
            </View>
        </PointAnnotation>
    );
}