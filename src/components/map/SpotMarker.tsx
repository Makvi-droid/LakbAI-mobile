import { PointAnnotation } from "@rnmapbox/maps";
import { View } from "react-native";

type SpotMarkerProps = {
  id: string;
  coordinate: [number, number];
};

export default function SpotMarker({ id, coordinate }: SpotMarkerProps) {
  return (
    <PointAnnotation id={id} coordinate={coordinate}>
      <View className="w-8 h-8 rounded-full items-center justify-center border-2 border-white bg-[#13A7E8]">
        <View className="w-2.5 h-2.5 rounded-full bg-white" />
      </View>
    </PointAnnotation>
  );
}