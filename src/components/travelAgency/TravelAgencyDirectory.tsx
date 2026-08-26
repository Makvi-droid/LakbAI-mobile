import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { supabase } from "../../lib/supabase";

type AgencyProfile = {
  agency_profile_id: string;
  agency_id: string;
  agency_name: string;
  short_description: string | null;
  about: string | null;
  region: string | null;
  business_hours: string | null;
  contact_email: string | null;
  contact_number: string | null;
  logo_url: string | null;
  updated_at: string | null;
};

type TourPackage = {
  package_id: string;
  agency_id: string;
  title: string;
  description: string | null;
  price: number | null;
  duration_days: number | null;
  created_at: string | null;
};

type AgencyFAQ = {
  faq_id: string;
  agency_id: string;
  question: string;
  answer: string;
  is_published: boolean;
  created_at: string | null;
  updated_at: string | null;
};

const FILTERS = [
  "All",
  "Island Tours",
  "Travel Planning",
  "Tour Packages",
];

export default function TravelAgencyDirectory() {
  const [agencies, setAgencies] = useState<AgencyProfile[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [faqs, setFaqs] = useState<AgencyFAQ[]>([]);

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [expandedAgency, setExpandedAgency] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // LOAD DATA FROM SUPABASE
  // ============================================================

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load agency profiles
      const profilesResult = await supabase
        .from("agency_profiles")
        .select("*")
        .order("agency_name", {
          ascending: true,
        });

      // Load tour packages
      const packagesResult = await supabase
        .from("tour_package")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      // Load published FAQs
      const faqsResult = await supabase
        .from("agency_faq")
        .select("*")
        .eq("is_published", true)
        .order("created_at", {
          ascending: true,
        });

      if (profilesResult.error) {
        throw profilesResult.error;
      }

      if (packagesResult.error) {
        throw packagesResult.error;
      }

      if (faqsResult.error) {
        throw faqsResult.error;
      }

      setAgencies(profilesResult.data ?? []);
      setPackages(packagesResult.data ?? []);
      setFaqs(faqsResult.data ?? []);
    } catch (err) {
      console.error("Error loading travel agencies:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load travel agencies."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredAgencies = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return agencies.filter((agency) => {
      const matchesSearch =
        !searchValue ||
        agency.agency_name
          ?.toLowerCase()
          .includes(searchValue) ||
        agency.region
          ?.toLowerCase()
          .includes(searchValue) ||
        agency.short_description
          ?.toLowerCase()
          .includes(searchValue);

      let matchesFilter = true;

      /*
       * The filter is based on the agency's description/services
       * because your current agency_profiles table does not have
       * a dedicated "category" column.
       */

      const searchableText = `
        ${agency.agency_name ?? ""}
        ${agency.short_description ?? ""}
        ${agency.about ?? ""}
      `.toLowerCase();

      if (selectedFilter === "Island Tours") {
        matchesFilter =
          searchableText.includes("island") ||
          searchableText.includes("island hopping");
      }

      if (selectedFilter === "Travel Planning") {
        matchesFilter =
          searchableText.includes("travel") ||
          searchableText.includes("planning");
      }

      if (selectedFilter === "Tour Packages") {
        matchesFilter =
          searchableText.includes("tour") ||
          searchableText.includes("package");
      }

      return matchesSearch && matchesFilter;
    });
  }, [agencies, search, selectedFilter]);

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color="#12A8E5"
        />

        <Text style={styles.loadingText}>
          Loading travel agencies...
        </Text>
      </View>
    );
  }

  // ============================================================
  // ERROR SCREEN
  // ============================================================

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={45}
          color="#E85D5D"
        />

        <Text style={styles.errorTitle}>
          Unable to load agencies
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadAgencies}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="briefcase-outline"
              size={22}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              Travel Agency Directory
            </Text>

            <Text style={styles.subtitle}>
              Find verified travel agencies for your next
              adventure.
            </Text>
          </View>
        </View>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#8A9AA3"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search travel agencies..."
            placeholderTextColor="#9BA8AE"
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch("")}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color="#AAB5BA"
              />
            </Pressable>
          )}
        </View>

        {/* =====================================================
            FILTERS
        ====================================================== */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((filter) => {
            const active =
              selectedFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() =>
                  setSelectedFilter(filter)
                }
                style={[
                  styles.filterButton,
                  active &&
                    styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    active &&
                      styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Travel Agencies
            </Text>

            <Text style={styles.sectionSubtitle}>
              {filteredAgencies.length}{" "}
              {filteredAgencies.length === 1
                ? "agency"
                : "agencies"}{" "}
              available
            </Text>
          </View>

          <View style={styles.verifiedBadge}>
            <Ionicons
              name="shield-checkmark"
              size={13}
              color="#19A974"
            />

            <Text style={styles.verifiedText}>
              Verified
            </Text>
          </View>
        </View>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredAgencies.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={38}
              color="#A7B6BC"
            />

            <Text style={styles.emptyTitle}>
              No agencies found
            </Text>

            <Text style={styles.emptyText}>
              Try searching for another agency,
              location, or service.
            </Text>
          </View>
        ) : (
          /* ===================================================
             AGENCY CARDS
          ==================================================== */

          filteredAgencies.map((agency) => {
            const expanded =
              expandedAgency === agency.agency_id;

            const agencyPackages =
              packages.filter(
                (pkg) =>
                  pkg.agency_id ===
                  agency.agency_id
              );

            const agencyFaqs =
              faqs.filter(
                (faq) =>
                  faq.agency_id ===
                  agency.agency_id
              );

            return (
              <View
                key={agency.agency_profile_id}
                style={styles.agencyCard}
              >
                {/* =================================================
                    AGENCY HEADER
                ================================================== */}

                <View style={styles.agencyHeader}>
                  <View style={styles.agencyLogo}>
                    {agency.logo_url ? (
                      <View style={styles.logoPlaceholder}>
                        <Ionicons
                          name="business-outline"
                          size={24}
                          color="#12A8E5"
                        />
                      </View>
                    ) : (
                      <Text
                        style={styles.logoText}
                      >
                        {agency.agency_name
                          .split(" ")
                          .slice(0, 2)
                          .map(
                            (word) =>
                              word[0]
                          )
                          .join("")
                          .toUpperCase()}
                      </Text>
                    )}
                  </View>

                  <View
                    style={
                      styles.agencyMainInfo
                    }
                  >
                    <View
                      style={styles.nameRow}
                    >
                      <Text
                        style={
                          styles.agencyName
                        }
                        numberOfLines={2}
                      >
                        {agency.agency_name}
                      </Text>

                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#19A974"
                        style={
                          styles.checkIcon
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.locationRow
                      }
                    >
                      <Ionicons
                        name="location-outline"
                        size={13}
                        color="#82939B"
                      />

                      <Text
                        style={
                          styles.locationText
                        }
                      >
                        {agency.region ||
                          "Philippines"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                <Text
                  style={styles.description}
                >
                  {agency.short_description ||
                    agency.about ||
                    "Travel agency providing services for Philippine destinations."}
                </Text>

                {/* =================================================
                    BUSINESS HOURS
                ================================================== */}

                {agency.business_hours && (
                  <View
                    style={
                      styles.infoRow
                    }
                  >
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color="#12A8E5"
                    />

                    <Text
                      style={
                        styles.infoText
                      }
                    >
                      {agency.business_hours}
                    </Text>
                  </View>
                )}

                {/* =================================================
                    PACKAGES SUMMARY
                ================================================== */}

                <View style={styles.packageSummary}>
                  <Ionicons
                    name="briefcase-outline"
                    size={15}
                    color="#12A8E5"
                  />

                  <Text
                    style={
                      styles.packageSummaryText
                    }
                  >
                    {agencyPackages.length}{" "}
                    {agencyPackages.length === 1
                      ? "tour package"
                      : "tour packages"}
                  </Text>
                </View>

                {/* =================================================
                    EXPANDED DETAILS
                ================================================== */}

                {expanded && (
                  <View
                    style={
                      styles.expandedContent
                    }
                  >
                    {/* ABOUT */}

                    {agency.about && (
                      <>
                        <Text
                          style={
                            styles.label
                          }
                        >
                          About
                        </Text>

                        <Text
                          style={
                            styles.aboutText
                          }
                        >
                          {agency.about}
                        </Text>
                      </>
                    )}

                    {/* TOUR PACKAGES */}

                    <Text
                      style={styles.label}
                    >
                      Tour Packages
                    </Text>

                    {agencyPackages.length ===
                    0 ? (
                      <Text
                        style={
                          styles.noDataText
                        }
                      >
                        No tour packages
                        available.
                      </Text>
                    ) : (
                      agencyPackages.map(
                        (pkg) => (
                          <View
                            key={
                              pkg.package_id
                            }
                            style={
                              styles.packageRow
                            }
                          >
                            <Ionicons
                              name="airplane-outline"
                              size={14}
                              color="#12A8E5"
                            />

                            <View
                              style={
                                styles.packageInfo
                              }
                            >
                              <Text
                                style={
                                  styles.packageText
                                }
                              >
                                {pkg.title}
                              </Text>

                              {pkg.description && (
                                <Text
                                  style={
                                    styles.packageDescription
                                  }
                                >
                                  {
                                    pkg.description
                                  }
                                </Text>
                              )}

                              <View
                                style={
                                  styles.packageMeta
                                }
                              >
                                {pkg.duration_days !=
                                  null && (
                                  <Text
                                    style={
                                      styles.packageDetails
                                    }
                                  >
                                    {
                                      pkg.duration_days
                                    }{" "}
                                    day
                                    {pkg.duration_days >
                                    1
                                      ? "s"
                                      : ""}
                                  </Text>
                                )}

                                {pkg.price !=
                                  null && (
                                  <Text
                                    style={
                                      styles.packagePrice
                                    }
                                  >
                                    ₱
                                    {Number(
                                      pkg.price
                                    ).toLocaleString()}
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        )
                      )
                    )}

                    {/* FAQ */}

                    <Text
                      style={styles.label}
                    >
                      Frequently Asked
                      Questions
                    </Text>

                    {agencyFaqs.length ===
                    0 ? (
                      <Text
                        style={
                          styles.noDataText
                        }
                      >
                        No FAQs available.
                      </Text>
                    ) : (
                      agencyFaqs.map(
                        (faq) => (
                          <View
                            key={faq.faq_id}
                            style={styles.faq}
                          >
                            <View
                              style={
                                styles.faqQuestionRow
                              }
                            >
                              <Ionicons
                                name="help-circle-outline"
                                size={16}
                                color="#12A8E5"
                              />

                              <Text
                                style={
                                  styles.faqQuestion
                                }
                              >
                                {
                                  faq.question
                                }
                              </Text>
                            </View>

                            <Text
                              style={
                                styles.faqAnswer
                              }
                            >
                              {faq.answer}
                            </Text>
                          </View>
                        )
                      )
                    )}

                    {/* CONTACT */}

                    <Text
                      style={styles.label}
                    >
                      Contact Information
                    </Text>

                    {agency.contact_number && (
                      <View
                        style={
                          styles.contactRow
                        }
                      >
                        <Ionicons
                          name="call-outline"
                          size={14}
                          color="#12A8E5"
                        />

                        <Text
                          style={
                            styles.contactText
                          }
                        >
                          {
                            agency.contact_number
                          }
                        </Text>
                      </View>
                    )}

                    {agency.contact_email && (
                      <View
                        style={
                          styles.contactRow
                        }
                      >
                        <Ionicons
                          name="mail-outline"
                          size={14}
                          color="#12A8E5"
                        />

                        <Text
                          style={
                            styles.contactText
                          }
                        >
                          {
                            agency.contact_email
                          }
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* =================================================
                    BUTTONS
                ================================================== */}

                <View
                  style={styles.buttonRow}
                >
                  <Pressable
                    style={
                      styles.profileButton
                    }
                    onPress={() =>
                      setExpandedAgency(
                        expanded
                          ? null
                          : agency.agency_id
                      )
                    }
                  >
                    <Ionicons
                      name={
                        expanded
                          ? "chevron-up"
                          : "person-outline"
                      }
                      size={15}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.profileButtonText
                      }
                    >
                      {expanded
                        ? "Hide Details"
                        : "View Profile"}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={
                      styles.contactButton
                    }
                  >
                    <Ionicons
                      name="call-outline"
                      size={15}
                      color="#12A8E5"
                    />

                    <Text
                      style={
                        styles.contactButtonText
                      }
                    >
                      Contact
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        {/* =====================================================
            INFORMATION BOX
        ====================================================== */}

        <View style={styles.infoBox}>
          <Ionicons
            name="shield-checkmark-outline"
            size={23}
            color="#12A8E5"
          />

          <View style={styles.infoBoxText}>
            <Text style={styles.infoBoxTitle}>
              Travel with confidence
            </Text>

            <Text
              style={
                styles.infoBoxDescription
              }
            >
              Browse travel agencies and their
              available tour packages directly
              from LakbAI.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

// ================================================================
// STYLES
// ================================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3FAFD",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 40,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: "#F3FAFD",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 12,
    color: "#71828D",
  },

  errorTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#405766",
  },

  errorText: {
    marginTop: 6,
    fontSize: 10,
    color: "#89979D",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#12A8E5",
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#12A8E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E3448",
  },

  subtitle: {
    fontSize: 11,
    color: "#82939B",
    marginTop: 3,
  },

  searchContainer: {
    height: 46,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5EEF1",
  },

  searchInput: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    color: "#34495A",
  },

  filters: {
    paddingVertical: 15,
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EDF0",
  },

  filterButtonActive: {
    backgroundColor: "#12A8E5",
    borderColor: "#12A8E5",
  },

  filterText: {
    fontSize: 10,
    color: "#71828D",
  },

  filterTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#31475A",
  },

  sectionSubtitle: {
    fontSize: 9,
    color: "#8A9AA3",
    marginTop: 3,
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F8F1",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
  },

  verifiedText: {
    fontSize: 8,
    color: "#19A974",
    fontWeight: "600",
    marginLeft: 4,
  },

  agencyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E7EFF2",

    shadowColor: "#607D8B",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 2,
  },

  agencyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  agencyLogo: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#E5F6FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },

  logoPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#12A8E5",
  },

  agencyMainInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  agencyName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#304659",
  },

  checkIcon: {
    marginLeft: 5,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  locationText: {
    fontSize: 9,
    color: "#83929A",
    marginLeft: 3,
  },

  description: {
    fontSize: 10,
    lineHeight: 15,
    color: "#71828D",
    marginTop: 13,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  infoText: {
    flex: 1,
    fontSize: 9,
    color: "#71828D",
    marginLeft: 6,
  },

  packageSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2FAFD",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 9,
    marginTop: 12,
  },

  packageSummaryText: {
    fontSize: 9,
    color: "#527080",
    marginLeft: 7,
  },

  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: "#EEF2F3",
    marginTop: 14,
    paddingTop: 2,
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#435766",
    marginTop: 14,
    marginBottom: 7,
  },

  aboutText: {
    fontSize: 9,
    lineHeight: 14,
    color: "#71828D",
  },

  packageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  packageInfo: {
    flex: 1,
    marginLeft: 8,
  },

  packageText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4B6170",
  },

  packageDescription: {
    fontSize: 8,
    lineHeight: 12,
    color: "#82919A",
    marginTop: 3,
  },

  packageMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  packageDetails: {
    fontSize: 8,
    color: "#82919A",
  },

  packagePrice: {
    fontSize: 9,
    color: "#12A8E5",
    fontWeight: "700",
    marginLeft: 10,
  },

  noDataText: {
    fontSize: 9,
    color: "#89979D",
    marginBottom: 5,
  },

  faq: {
    backgroundColor: "#F5FAFC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },

  faqQuestionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  faqQuestion: {
    flex: 1,
    fontSize: 9,
    fontWeight: "600",
    color: "#405766",
    marginLeft: 6,
  },

  faqAnswer: {
    fontSize: 8,
    lineHeight: 12,
    color: "#7A8B94",
    marginTop: 6,
    marginLeft: 22,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  contactText: {
    flex: 1,
    fontSize: 9,
    color: "#687C87",
    marginLeft: 7,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 15,
  },

  profileButton: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#12A8E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  profileButtonText: {
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 5,
  },

  contactButton: {
    flex: 0.7,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFE5F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  contactButtonText: {
    fontSize: 9,
    color: "#12A8E5",
    fontWeight: "600",
    marginLeft: 5,
  },

  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 35,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#435766",
    marginTop: 10,
  },

  emptyText: {
    fontSize: 9,
    color: "#89979D",
    marginTop: 5,
    textAlign: "center",
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EAF8FD",
    borderRadius: 14,
    padding: 13,
    marginTop: 4,
  },

  infoBoxText: {
    flex: 1,
    marginLeft: 10,
  },

  infoBoxTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#315669",
  },

  infoBoxDescription: {
    fontSize: 8,
    lineHeight: 12,
    color: "#718791",
    marginTop: 3,
  },

  bottomSpace: {
    height: 20,
  },
});