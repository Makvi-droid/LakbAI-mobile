import { Text, View } from "react-native";
import { TrendPoint } from "../../types/trend";

export default function TrendsChart({ data }: { data: TrendPoint[] }) {
  return (
    <View className="mx-[18px] bg-white rounded-2xl p-[13px] mb-3">
      <Text className="text-[8px] font-bold text-[#536672] mb-[14px]">
        CROWD LEVELS BY MONTH
      </Text>

      <View className="h-[135px] relative">
        <View className="absolute left-0 right-0 h-px bg-[#EDF2F4]" style={{ bottom: 20 }} />
        <View className="absolute left-0 right-0 h-px bg-[#EDF2F4]" style={{ bottom: 52 }} />
        <View className="absolute left-0 right-0 h-px bg-[#EDF2F4]" style={{ bottom: 84 }} />

        <View className="absolute bottom-0 left-1 right-1 h-[115px] flex-row justify-around items-end">
          {data.map((point) => (
            <View key={point.month} className="w-7 h-[115px] justify-end items-center">
              <View
                className="w-[18px] rounded-t-[5px] bg-[#70C9ED]"
                style={{ height: point.value }}
              />
              <Text className="text-[6px] text-[#8A9AA3] mt-[5px]">{point.month}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}