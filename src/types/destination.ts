import { ImageSourcePropType } from "react-native";

export type CrowdLevel = "Busy" | "Moderate" | "Quiet";

export type Destination = {
  name: string;
  location: string;
  rating: string;
  crowd: CrowdLevel;
  image: ImageSourcePropType;
};