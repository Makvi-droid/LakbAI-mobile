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

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const values = [62, 68, 73, 78, 67, 51];

export default function TrendsPage() {
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

        {/* INFO CARD */}
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

  <Pressable style={styles.tab}>
    <Text style={styles.tabText}>reviews</Text>
  </Pressable>

  <Pressable style={styles.activeTab}>
    <Text style={styles.activeTabText}>trends</Text>
  </Pressable>
</View>

        {/* CHART */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            CROWD LEVELS BY MONTH
          </Text>

          <View style={styles.chart}>
            {/* Horizontal guide lines */}
            <View style={[styles.gridLine, { bottom: 20 }]} />
            <View style={[styles.gridLine, { bottom: 52 }]} />
            <View style={[styles.gridLine, { bottom: 84 }]} />

            {/* Bars */}
            <View style={styles.bars}>
              {values.map((value, index) => (
                <View
                  key={months[index]}
                  style={styles.barContainer}
                >
                  <View
                    style={[
                      styles.bar,
                      {
                        height: value,
                      },
                    ]}
                  />

                  <Text style={styles.month}>
                    {months[index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* TREND SUMMARY */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name="trending-up"
              size={16}
              color="#13A9E9"
            />
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>
              Peak Season
            </Text>

            <Text style={styles.summaryText}>
              Crowd levels are highest from March to
              April. Consider visiting earlier or later
              for a quieter experience.
            </Text>
          </View>
        </View>

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

  /* CHART */

  chartCard: {
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 13,
    marginBottom: 12,
  },

  chartTitle: {
    fontSize: 8,
    fontWeight: "700",
    color: "#536672",
    marginBottom: 14,
  },

  chart: {
    height: 135,
    position: "relative",
  },

  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#EDF2F4",
  },

  bars: {
    position: "absolute",
    bottom: 0,
    left: 4,
    right: 4,
    height: 115,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },

  barContainer: {
    width: 28,
    height: 115,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  bar: {
    width: 18,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "#70C9ED",
  },

  month: {
    fontSize: 6,
    color: "#8A9AA3",
    marginTop: 5,
  },

  /* SUMMARY */

  summaryCard: {
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 13,
    flexDirection: "row",
  },

  summaryIcon: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#E6F7FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  summaryContent: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 9,
    fontWeight: "700",
    color: "#34475A",
    marginBottom: 4,
  },

  summaryText: {
    fontSize: 8,
    lineHeight: 12,
    color: "#71828D",
  },

  bottomSpace: {
    height: 30,
  },
});