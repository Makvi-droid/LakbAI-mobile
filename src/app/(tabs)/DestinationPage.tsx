import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DestinationPage() {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HERO IMAGE */}
        <View style={styles.heroContainer}>
          <Image
            source={require("../../assets/images/beachpls.jpg")}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Back Button */}
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color="#26364D"
            />
          </Pressable>

          {/* Favorite */}
          <Pressable style={styles.favoriteButton}>
            <Ionicons
              name="heart-outline"
              size={17}
              color="#F05C67"
            />
          </Pressable>

          {/* Location */}
          <View style={styles.heroLocation}>
            <Ionicons
              name="location"
              size={10}
              color="#FFFFFF"
            />

            <Text style={styles.heroLocationText}>
              Palawan
            </Text>
          </View>

          <Text style={styles.heroTitle}>El Nido</Text>
        </View>

        {/* INFORMATION CARD */}
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Crowd</Text>
            <Text style={styles.infoValue}>Busy</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Season</Text>
            <Text style={styles.infoValue}>96%</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Best Time</Text>
            <Text style={styles.infoValue}>December</Text>
          </View>
        </View>

        {/* CATEGORY TABS */}
        <View style={styles.destinationTabs}>
          <Pressable style={styles.destinationTabActive}>
            <Text style={styles.destinationTabActiveText}>
              Overview
            </Text>
          </Pressable>

          <Pressable style={styles.destinationTab}>
            <Text style={styles.destinationTabText}>
              Reviews
            </Text>
          </Pressable>

          <Pressable style={styles.destinationTab}>
            <Text style={styles.destinationTabText}>
              Itinerary
            </Text>
          </Pressable>
        </View>

        {/* DESCRIPTION */}
        <View style={styles.section}>
          <Text style={styles.description}>
            Known for its white-sand beaches, coral reefs,
            and as the gateway to the Bacuit archipelago, a
            group of islands with steep karst cliffs.
          </Text>
        </View>

        {/* BEST TIME */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            Best Time to Visit
          </Text>

          <Text style={styles.cardValue}>
            December to May (Dry Season)
          </Text>
        </View>

        {/* TAGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>

          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Beach</Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                Island-Hopping
              </Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                Limestone Cliffs
              </Text>
            </View>
          </View>
        </View>

        {/* GENERATE ITINERARY */}
        <Pressable style={styles.generateButton}>
          <Ionicons
            name="sparkles-outline"
            size={13}
            color="#26364D"
          />

          <Text style={styles.generateText}>
            Generate Itinerary
          </Text>
        </Pressable>

        {/* TALK TO LAKBAI */}
        <Pressable style={styles.actionButton}>
          <Ionicons
            name="chatbubble-outline"
            size={13}
            color="#13A9E9"
          />

          <Text style={styles.actionText}>
            Talk to LakbAI
          </Text>
        </Pressable>

        {/* SAVE ITINERARY */}
        <Pressable style={styles.actionButton}>
          <Ionicons
            name="bookmark-outline"
            size={13}
            color="#13A9E9"
          />

          <Text style={styles.actionText}>
            Save Itinerary
          </Text>
        </Pressable>

        {/* Bottom spacing for TabBar */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2FAFD",
  },

  content: {
    paddingBottom: 110,
  },

  /* HERO */

  heroContainer: {
    height: 245,
    position: "relative",
    overflow: "hidden",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  backButton: {
    position: "absolute",
    top: 42,
    left: 14,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.88)",
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteButton: {
    position: "absolute",
    top: 42,
    right: 14,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.88)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroLocation: {
    position: "absolute",
    left: 18,
    bottom: 47,
    flexDirection: "row",
    alignItems: "center",
  },

  heroLocationText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "500",
    marginLeft: 3,
  },

  heroTitle: {
    position: "absolute",
    left: 18,
    bottom: 20,
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
  },

  /* INFO */

  infoCard: {
    marginHorizontal: 18,
    marginTop: -21,
    height: 59,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 5,

    shadowColor: "#607D8B",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  infoItem: {
    flex: 1,
    alignItems: "center",
  },

  infoLabel: {
    fontSize: 7,
    color: "#91A0A8",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 9,
    fontWeight: "600",
    color: "#35475A",
  },

  infoDivider: {
    height: 28,
    width: 1,
    backgroundColor: "#E6ECEF",
  },

  /* TABS */

  destinationTabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    marginTop: 13,
    marginBottom: 15,
  },

  destinationTabActive: {
    backgroundColor: "#13A9E9",
    borderRadius: 15,
    paddingHorizontal: 17,
    paddingVertical: 7,
  },

  destinationTabActiveText: {
    fontSize: 7,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  destinationTab: {
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  destinationTabText: {
    fontSize: 7,
    fontWeight: "500",
    color: "#758691",
  },

  /* DESCRIPTION */

  section: {
    marginHorizontal: 18,
    marginBottom: 12,
  },

  description: {
    fontSize: 8,
    lineHeight: 13,
    color: "#71828D",
  },

  /* CARDS */

  card: {
    marginHorizontal: 18,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    marginBottom: 14,
  },

  cardLabel: {
    fontSize: 7,
    color: "#13A9E9",
    fontWeight: "700",
    marginBottom: 5,
  },

  cardValue: {
    fontSize: 8,
    color: "#536672",
    fontWeight: "500",
  },

  /* TAGS */

  sectionTitle: {
    fontSize: 9,
    fontWeight: "700",
    color: "#34475A",
    marginBottom: 7,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  tag: {
    backgroundColor: "#E8F4E8",
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  tagText: {
    fontSize: 7,
    color: "#648268",
    fontWeight: "600",
  },

  /* BUTTONS */

  generateButton: {
    height: 36,
    marginHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 8,
  },

  generateText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#34475A",
    marginLeft: 5,
  },

  actionButton: {
    height: 36,
    marginHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCECF2",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 8,
  },

  actionText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#13A9E9",
    marginLeft: 5,
  },

  bottomSpace: {
    height: 30,
  },
});