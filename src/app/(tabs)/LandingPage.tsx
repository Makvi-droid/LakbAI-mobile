import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Destination = {
  name: string;
  location: string;
  rating: string;
  crowd: "Busy" | "Moderate" | "Quiet";
  image: ImageSourcePropType;
};

const destinations: Destination[] = [
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

const categories = ["All", "Beach", "Heritage", "Adventure", "Nature"];

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Where to in the{"\n"}
            <Text style={styles.titleBlue}>Philippines?</Text>
          </Text>

          <Text style={styles.subtitle}>
            Discover your next adventure.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#B7C7D1" />

          <TextInput
            placeholder="Search destinations..."
            placeholderTextColor="#B7C7D1"
            style={styles.searchInput}
          />
        </View>

        {/* Hidden Gems */}
        <Pressable style={styles.hiddenGems}>
          <View style={styles.gemIcon}>
            <Ionicons name="sparkles-outline" size={18} color="#26364D" />
          </View>

          <View>
            <Text style={styles.gemTitle}>Hidden</Text>
            <Text style={styles.gemTitle}>Gems</Text>
            <Text style={styles.gemSubtitle}>Less crowded</Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#94A5B0"
            style={styles.gemArrow}
          />
        </Pressable>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map((category, index) => (
            <Pressable
              key={category}
              style={[
                styles.category,
                index === 0 && styles.categoryActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  index === 0 && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore destinations</Text>

          <Pressable>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {/* Destination Cards */}
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.name}
            destination={destination}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function DestinationCard({
  destination,
}: {
  destination: Destination;
}) {
  return (
    <Pressable style={styles.destinationCard}>
      <View style={styles.imageContainer}>
        <Image
          source={destination.image}
          style={styles.destinationImage}
          resizeMode="cover"
        />

        {/* Crowd Badge */}
        <View
          style={[
            styles.crowdBadge,
            destination.crowd === "Busy"
              ? styles.busyBadge
              : styles.moderateBadge,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              destination.crowd === "Busy"
                ? styles.busyDot
                : styles.moderateDot,
            ]}
          />

          <Text style={styles.crowdText}>{destination.crowd}</Text>
        </View>

        {/* Rating */}
        <View style={styles.ratingBadge}>
          <Ionicons name="sparkles" size={11} color="#2499E8" />
          <Text style={styles.ratingText}>{destination.rating}</Text>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <View>
          <Text style={styles.destinationName}>
            {destination.name}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={13}
              color="#82919C"
            />

            <Text style={styles.locationText}>
              {destination.location}
            </Text>
          </View>
        </View>

        <View style={styles.arrowButton}>
          <Ionicons
            name="arrow-forward"
            size={16}
            color="#2499E8"
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F0FAFE",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 120,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    lineHeight: 31,
    fontWeight: "700",
    color: "#26364D",
    letterSpacing: -0.7,
  },

  titleBlue: {
    color: "#13A7E8",
  },

  subtitle: {
    marginTop: 7,
    fontSize: 12,
    color: "#81909B",
    fontWeight: "500",
  },

  searchContainer: {
    height: 46,
    borderRadius: 24,
    backgroundColor: "#E7F4F9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    color: "#26364D",
  },

  hiddenGems: {
    height: 68,
    backgroundColor: "#E7F6FA",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 18,
  },

  gemIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F6FBFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  gemTitle: {
    fontSize: 12,
    lineHeight: 13,
    fontWeight: "700",
    color: "#26364D",
  },

  gemSubtitle: {
    fontSize: 9,
    color: "#81909B",
    marginTop: 2,
  },

  gemArrow: {
    marginLeft: "auto",
  },

  categories: {
    gap: 8,
    paddingBottom: 22,
  },

  category: {
    height: 31,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  categoryActive: {
    backgroundColor: "#13A7E8",
  },

  categoryText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#657682",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#26364D",
  },

  seeAll: {
    fontSize: 11,
    fontWeight: "600",
    color: "#13A7E8",
  },

  destinationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 9,
    marginBottom: 14,
    shadowColor: "#6B8794",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  imageContainer: {
    height: 155,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },

  destinationImage: {
    width: "100%",
    height: "100%",
  },

  crowdBadge: {
    position: "absolute",
    top: 9,
    left: 9,
    height: 22,
    paddingHorizontal: 9,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  busyBadge: {
    backgroundColor: "#FFE7E3",
  },

  moderateBadge: {
    backgroundColor: "#FFF0C8",
  },

  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },

  busyDot: {
    backgroundColor: "#FF5C4D",
  },

  moderateDot: {
    backgroundColor: "#D99A00",
  },

  crowdText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#58636B",
  },

  ratingBadge: {
    position: "absolute",
    right: 9,
    bottom: 9,
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.92)",
    flexDirection: "row",
    alignItems: "center",
  },

  ratingText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#2499E8",
    marginLeft: 3,
  },

  cardInfo: {
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingTop: 3,
  },

  destinationName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#26364D",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  locationText: {
    fontSize: 10,
    color: "#81909B",
    marginLeft: 3,
  },

  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E7F6FC",
    alignItems: "center",
    justifyContent: "center",
  },
});