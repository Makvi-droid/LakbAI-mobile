import { Destination } from "../types/destination";

export const destinations: Destination[] = [
  {
    name: "El Nido",
    location: "Palawan",
    rating: "96%",
    crowd: "Busy",
    image: require("../../assets/images/beachpls.jpg"),
  },
  {
    name: "Boracay",
    location: "Aklan",
    rating: "91%",
    crowd: "Moderate",
    image: require("../../assets/images/beachpls.jpg"),
  },
];

export const categories = ["All", "Beach", "Heritage", "Adventure", "Nature"];