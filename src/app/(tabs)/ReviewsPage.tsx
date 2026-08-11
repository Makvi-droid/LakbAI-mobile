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

export default function ReviewsPage() {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HERO */}
        <View style={styles.heroContainer}>
          <Image
            source={require("../../assets/images/beachpls.jpg")}
            style={styles.heroImage}
            resizeMode="cover"
          />

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

          <Pressable style={styles.favoriteButton}>
            <Ionicons
              name="heart-outline"
              size={17}
              color="#F05C67"
            />
          </Pressable>

          <View style={styles.heroLocation}>
            <Ionicons
              name="location"
              size={9}
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

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sentiment</Text>
            <Text style={styles.infoValue}>96%</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Best</Text>
            <Text style={styles.infoValue}>December</Text>
          </View>
        </View>

        {/* TABS */}
<View style={styles.tabs}>
  <Pressable style={styles.tab}>
    <Text style={styles.tabText}>overview</Text>
  </Pressable>

  <Pressable style={styles.activeTab}>
    <Text style={styles.activeTabText}>reviews</Text>
  </Pressable>

  <Pressable style={styles.tab}>
    <Text style={styles.tabText}>trends</Text>
  </Pressable>
</View>

        {/* REVIEW */}
        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View>
              <Text style={styles.reviewerName}>
                Sarah M.
              </Text>

              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star"
                    size={8}
                    color="#F5B942"
                  />
                ))}
              </View>
            </View>

            <Text style={styles.reviewDate}>
              5 days ago
            </Text>
          </View>

          <Text style={styles.reviewText}>
            "Absolutely breathtaking. You have to visit
            the beaches and explore the islands. The views
            are amazing!"
          </Text>
        </View>

        {/* SECOND REVIEW */}
        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View>
              <Text style={styles.reviewerName}>
                Miguel R.
              </Text>

              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star"
                    size={8}
                    color="#F5B942"
                  />
                ))}
              </View>
            </View>

            <Text style={styles.reviewDate}>
              2 weeks ago
            </Text>
          </View>

          <Text style={styles.reviewText}>
            "The scenery was beautiful and the island
            hopping experience was unforgettable."
          </Text>
        </View>

        {/* ADD REVIEW */}
        <Pressable style={styles.addReviewButton}>
          <Ionicons
            name="create-outline"
            size={13}
            color="#13A9E9"
          />

          <Text style={styles.addReviewText}>
            Write a Review
          </Text>
        </Pressable>

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
    paddingBottom: 100,
  },

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
    bottom: 47,
    left: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  heroLocationText: {
    color: "#FFFFFF",
    fontSize: 8,
    marginLeft: 3,
  },

  heroTitle: {
    position: "absolute",
    bottom: 19,
    left: 18,
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
  },

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

  divider: {
    width: 1,
    height: 28,
    backgroundColor: "#E6ECEF",
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    marginTop: 13,
    marginBottom: 18,
  },

  tab: {
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  activeTab: {
    backgroundColor: "#13A9E9",
    borderRadius: 15,
    paddingHorizontal: 17,
    paddingVertical: 7,
  },

  tabText: {
    fontSize: 7,
    color: "#758691",
  },

  activeTabText: {
    fontSize: 7,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  reviewCard: {
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    padding: 13,
    marginBottom: 10,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  reviewerName: {
    fontSize: 9,
    fontWeight: "700",
    color: "#34475A",
  },

  stars: {
    flexDirection: "row",
    gap: 2,
    marginTop: 4,
  },

  reviewDate: {
    fontSize: 7,
    color: "#9AA7AE",
  },

  reviewText: {
    fontSize: 8,
    lineHeight: 13,
    color: "#71828D",
  },

  addReviewButton: {
    height: 37,
    marginHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCECF2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 3,
  },

  addReviewText: {
    fontSize: 8,
    color: "#13A9E9",
    fontWeight: "600",
    marginLeft: 5,
  },

  bottomSpace: {
    height: 30,
  },
});