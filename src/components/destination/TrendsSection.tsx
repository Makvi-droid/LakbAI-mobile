import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { TrendPoint } from "../../types/trend";
import TrendsChart from "./TrendsChart";

type TrendsSectionProps = {
  data: TrendPoint[];
  summary: { title: string; text: string };
};

export default function TrendsSection({ data, summary }: TrendsSectionProps) {
  return (
    <>
      <TrendsChart data={data} />

      <View className="mx-[18px] bg-white rounded-2xl p-[13px] flex-row">
        <View className="w-[31px] h-[31px] rounded-2xl bg-[#E6F7FD] items-center justify-center mr-[10px]">
          <Ionicons name="trending-up" size={16} color="#13A9E9" />
        </View>
        <View className="flex-1">
          <Text className="text-[9px] font-bold text-[#34475A] mb-1">
            {summary.title}
          </Text>
          <Text className="text-[8px] leading-3 text-[#71828D]">{summary.text}</Text>
        </View>
      </View>
    </>
  );
}