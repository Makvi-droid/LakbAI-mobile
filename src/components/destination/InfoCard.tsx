import { Fragment } from "react";
import { Text, View } from "react-native";

type InfoStat = {
  label: string;
  value: string;
};

type InfoCardProps = {
  stats: InfoStat[];
};

export default function InfoCard({ stats }: InfoCardProps) {
  return (
    <View
      className="mx-[18px] -mt-[21px] h-[59px] bg-white rounded-2xl flex-row items-center justify-around z-10"
      style={{
        shadowColor: "#607D8B",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {stats.map((stat, index) => (
        <Fragment key={stat.label}>
          <View className="flex-1 items-center">
            <Text className="text-[7px] text-[#91A0A8] mb-1">{stat.label}</Text>
            <Text className="text-[9px] font-semibold text-[#35475A]">
              {stat.value}
            </Text>
          </View>
          {index < stats.length - 1 && (
            <View className="w-px h-7 bg-[#E6ECEF]" />
          )}
        </Fragment>
      ))}
    </View>
  );
}