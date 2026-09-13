import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface FilterButtonProps {
    activeCount: number;
    onPress: () => void;
}

export default function FilterButton({ activeCount, onPress }: FilterButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className="h-[46px] w-[46px] rounded-full bg-white items-center justify-center"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 4,
            }}
        >
            <Ionicons name="options-outline" size={19} color="#26364D" />
            {activeCount > 0 && (
                <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#13A7E8] items-center justify-center">
                    <Text className="text-[9px] font-bold text-white">{activeCount}</Text>
                </View>
            )}
        </Pressable>
    );
}