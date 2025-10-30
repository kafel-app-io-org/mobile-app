import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Share,
  Platform,
} from "react-native";
import { API_BASE_URL,
		 PLAY_STORE_BASE_URL,
		 APP_STORE_BASE_URL,
		 APP_BASE_SCHEME
		} from "../../../api/send-api-request";
import * as Progress from "react-native-progress";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useTranslation } from "react-i18next";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";

import CampaignDataIcon from "@/assets/icons/CampaignDataIcon";
import CampaignLocationIcon from "@/assets/icons/CampaignLocationIcon";
import CampaignTargetFundcIcon from "@/assets/icons/CampaignTargetFundcIcon";
import CampaignTFEBIcon from "@/assets/icons/CampaignTFEBIcon";
import CampaignTargetBenIcon from "@/assets/icons/CampaignTargetBenIcon";
import CampaginNumBen from "@/assets/icons/CampaginNumBen";
import CamOrgWebsite from "@/assets/icons/CamOrgWebsite";
import CamOrgLocation from "@/assets/icons/CamOrgLocation";
import CamOrgPhone from "@/assets/icons/CamOrgPhone";
import CamOrgEmail from "@/assets/icons/CamOrgEmail";
import { useCampaignDetails } from "@/query-hooks/campaigns-query-hooks";
import { formatDate, convertToFloatCents, capitalize } from "@/utils/helper";

const colorMode = {
  light: { backgroundColor: "#E1E9EE", foregroundColor: "#F2F8FC" },
};

// YouTube embed helper (JS only — no TS annotations)
const getHtml = (id) => `
<!doctype html><html><head>
<meta name="referrer" content="strict-origin-when-cross-origin" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>html,body{margin:0;padding:0;background:#000;height:100%}iframe{width:100%;height:100%;border:none}</style>
</head><body>
<iframe src="https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0&controls=1"
allow="autoplay; encrypted-media; picture-in-picture"
referrerpolicy="strict-origin-when-cross-origin"></iframe>
</body></html>
`;

// 🔗 Deep link bases
const APP_SCHEME = `${APP_BASE_SCHEME}`;
const WEB_BASE = `${API_BASE_URL}`;

// (Optional) Store links to include in the share text
const PLAY_STORE_URL = `${PLAY_STORE_BASE_URL}`;
  
const APP_STORE_URL = `${APP_STORE_BASE_URL}`;

const CampaignDetailsScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const {
    data: campaign,
    isPending: isPendingCampaign,
    refetch,
  } = useCampaignDetails(id);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const [activeTab, setActiveTab] = useState("campaign");

  const handleOnPressDonate = () => {
    if (!campaign?.id) return;
    router.push({
      pathname: "/(tabs)/campaigns/DonateCampaignScreen",
      params: { campaign: JSON.stringify(campaign) },
    });
  };

  // ▶️ Floating Share Button handler
  const onShareCampaign = async () => {
    try {
      const title = campaign?.title || t("Campaign");
      const schemeUrl = `${APP_SCHEME}://campaign/link/${id}`;
      const universalUrl = `${WEB_BASE}/campaign/link/${id}`;

      // const storeLine =
      //   Platform.OS === "ios"
      //     ? `\n\nGet Kafel App: ${APP_STORE_URL}`
      //     : `\n\nGet Kafel App: ${PLAY_STORE_URL}`;

      // const storeLine = `\n\nGet Kafel App\nApple App Store: ${APP_STORE_URL}\nGoogle Play Store: ${PLAY_STORE_URL}`;
      const storeLine = `\n\nGet Kafel App\nGoogle Play Store: ${PLAY_STORE_URL}`;

      const message =
        `${title}\n\n` +
        //`Open in app:\n${schemeUrl}\n\n` +
        `You’re invited to donate via Kafel App. Please click the link below to contribute.\n${universalUrl}` +
        storeLine;

      await Share.share(
        {
          title,
          message, // Android main body
          url: universalUrl, // iOS link preview
        },
        {
          dialogTitle: t("Share Campaign"),
          subject: title,
        }
      );
    } catch (e) {
      console.log("Share error:", e?.message || String(e));
    }
  };

  const getFormattedAddress = (address) => {
    if (!address) return "";
    const { street, city, country } = address;
    return [street, city, country].filter(Boolean).join(", ");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={{ paddingHorizontal: 16 }}>
          {isPendingCampaign ? (
            <Skeleton colorMode={colorMode} width="100%" height={200} radius={20} />
          ) : (
            <Image style={styles.image} source={{ uri: `${API_BASE_URL}${campaign?.image}` }} />
          )}

          <View style={{ marginVertical: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
              {isPendingCampaign ? (
                <>
                  <Skeleton colorMode={colorMode} width={80} height={12} />
                  <Skeleton colorMode={colorMode} width={80} height={12} />
                </>
              ) : (
                <>
                  <Text style={styles.current}>
                    {`$${convertToFloatCents(campaign?.total_collected ?? "0")}`}
                  </Text>
                  <Text style={styles.target}>
                    {`$${convertToFloatCents(campaign?.total_target ?? "0")}`}
                  </Text>
                </>
              )}
            </View>

            {isPendingCampaign ? (
              <View style={{ marginTop: 10 }}>
                <Skeleton colorMode={colorMode} width="100%" height={6} radius={3} />
              </View>
            ) : (
              <Progress.Bar
                animated
                color={"#74BB29"}
                unfilledColor={"#EAECF0"}
                borderWidth={0}
                height={6}
                progress={(campaign?.progress || 0) / 100}
                width={null}
                style={{ marginTop: 10, alignSelf: "stretch" }}
              />
            )}
          </View>

          {isPendingCampaign ? (
            <View style={{ gap: 8 }}>
              <Skeleton colorMode={colorMode} width={200} height={24} />
              <Skeleton colorMode={colorMode} width="100%" height={60} radius={4} />
            </View>
          ) : (
            <>
              <Text style={styles.title}>{campaign?.title}</Text>
              <Text style={styles.desc}>{campaign?.description}</Text>
            </>
          )}

          <View style={styles.tabsWrapper}>
            <TouchableOpacity onPress={() => setActiveTab("campaign")} style={styles.tabBtb}>
              <Text
                style={[
                  styles.tabTitle,
                  activeTab === "campaign" ? styles.activeTabTitle : null,
                  { textAlign: "left" },
                ]}
              >
                {t("tabs.campaigns.CampaignDetailsScreen.campaignInfo")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("organizer")} style={styles.tabBtb}>
              <Text
                style={[
                  styles.tabTitle,
                  activeTab === "organizer" ? styles.activeTabTitle : null,
                  { textAlign: "right" },
                ]}
              >
                {t("tabs.campaigns.CampaignDetailsScreen.organizerInfo")}
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "campaign" ? (
            <>
              <Text>{`${campaign?.details ?? ""}`}</Text>
              <Hr />
              <DataRow
                isPending={isPendingCampaign}
                keyText={t("tabs.campaigns.CampaignDetailsScreen.location")}
                valueText={`${campaign?.city ?? ""}, ${campaign?.country ?? ""}`}
                icon={<CampaignLocationIcon />}
              />
              <Hr />
              <DataRow
                isPending={isPendingCampaign}
                keyText={t("tabs.campaigns.CampaignDetailsScreen.date")}
                valueText={formatDate(campaign?.start_date) ?? ""}
                icon={<CampaignDataIcon />}
              />
              <Hr />
              <DataRow
                isPending={isPendingCampaign}
                keyText={t("tabs.campaigns.CampaignDetailsScreen.targetFund")}
                valueText={`$${convertToFloatCents(campaign?.total_target ?? "0")}`}
                icon={<CampaignTargetFundcIcon />}
              />
              <Hr />
              <DataRow
                isPending={isPendingCampaign}
                keyText={t("tabs.campaigns.CampaignDetailsScreen.targetPerBen")}
                valueText={`$${(
                  campaign?.total_target &&
                  campaign?.num_beneficiaries &&
                  campaign.num_beneficiaries !== 0
                    ? convertToFloatCents(campaign.total_target / campaign.num_beneficiaries)
                    : "-"
                )}`}
                icon={<CampaignTFEBIcon />}
              />
              <Hr />
              <DataRow
                isPending={isPendingCampaign}
                keyText={t("tabs.campaigns.CampaignDetailsScreen.targetBen")}
                valueText={capitalize(campaign?.targetBeneficiaries?.name ?? "-")}
                icon={<CampaignTargetBenIcon />}
              />
              <Hr />
              <DataRow
                isPending={isPendingCampaign}
                keyText={t("tabs.campaigns.CampaignDetailsScreen.numBen")}
                valueText={campaign?.num_beneficiaries}
                icon={<CampaginNumBen />}
              />
              <Hr />
              <WebView
                originWhitelist={["*"]}
                source={{
                  html: getHtml(`${campaign?.video_url}`),
                  baseUrl: WEB_BASE, // use ngrok as base
                }}
                style={{ width: "100%", height: 220 }}
                javaScriptEnabled
                domStorageEnabled
                mediaPlaybackRequiresUserAction={false}
                scrollEnabled={false}
              />
            </>
          ) : (
            <View style={styles.organizerTab}>
              <View style={styles.infoWrapper}>
                <Image
                  source={{ uri: `${API_BASE_URL}${campaign?.organizer?.image}` }}
                  style={styles.organizerImage}
                />
                <View>
                  <Text style={styles.organizerAbout}>{campaign?.organizer?.name}</Text>
                  <Text>
                    {campaign?.organizer?.city}, {campaign?.organizer?.country}
                  </Text>
                </View>
              </View>
              <Hr />
              <Text>{campaign?.organizer?.overview}</Text>
              <Hr />
              <View style={styles.organizerDetailsWrapper}>
                <View style={styles.organizerDateRow}>
                  <CamOrgLocation />
                  <Text>
                    {getFormattedAddress({
                      street: campaign?.organizer?.address,
                      city: campaign?.organizer?.city,
                      country: campaign?.organizer?.country,
                    })}
                  </Text>
                </View>
                {/* ⬇⬇ FIX WAS HERE: close the View properly (</View>) */}
                <View style={styles.organizerDateRow}>
                  <CamOrgPhone />
                  <Text>{campaign?.organizer?.phone_number}</Text>
                </View>
                <View style={styles.organizerDateRow}>
                  <CamOrgEmail />
                  <Text>{campaign?.organizer?.email}</Text>
                </View>
                <View style={styles.organizerDateRow}>
                  <CamOrgWebsite />
                  <Text>{campaign?.organizer?.website}</Text>
                </View>
              </View>
              <Hr />
              <WebView
                originWhitelist={["*"]}
                source={{
                  html: getHtml(`${campaign?.organizer?.video_url}`),
                  baseUrl: WEB_BASE, // use ngrok as base
                }}
                style={{ width: "100%", height: 220 }}
                javaScriptEnabled
                domStorageEnabled
                mediaPlaybackRequiresUserAction={false}
                scrollEnabled={false}
              />
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleOnPressDonate}>
            <LinearGradient
              colors={["#74BB29", "#92D050", "#74BB29"]}
              locations={[0.0201, 0.5083, 0.9757]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {t("tabs.campaigns.CampaignDetailsScreen.donate")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🔘 Floating Circular Share Button (Font Awesome) */}
      <TouchableOpacity
        onPress={onShareCampaign}
        activeOpacity={0.8}
        style={styles.fabWrapper}
        accessibilityRole="button"
        accessibilityLabel={t("Share Campaign")}
      >
        <View style={styles.fab}>
          <FontAwesome name="share" size={40} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CampaignDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#F6F6F6",
    objectFit: "cover",
    borderRadius: 20,
  },
  target: { fontSize: 12, fontWeight: "600", color: "#A3A3A3" },
  current: { fontSize: 12, fontWeight: "500", color: "#27364E" },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#202226",
    marginBottom: 14,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  desc: {
    fontSize: 14,
    fontWeight: "400",
    color: "#838383",
    lineHeight: 22,
    textAlign: "justify",
    alignSelf: "flex-start",
  },
  subtitle: { fontSize: 16, fontWeight: "700", color: "#202226", marginBottom: 18, marginTop: 20 },
  key: { fontSize: 14, fontWeight: "400", color: "#939393" },
  value: { fontSize: 14, fontWeight: "500", color: "#202226" },
  dataRow: { flexDirection: "row", justifyContent: "space-between" },
  hr: { borderBottomColor: "#EAECF0", borderBottomWidth: 1, marginVertical: 16, width: "100%" },
  button: { paddingVertical: 18, borderRadius: 12, textTransform: "capitalize", marginBottom: 30 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "700" },
  tabsWrapper: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18, marginTop: 20 },
  tabTitle: {
    color: "#838383", fontSize: 16, fontWeight: "700",
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#E9E9E9", width: "100%",
  },
  activeTabTitle: { color: "#202226", borderBottomWidth: 2, borderBottomColor: "#74BB29", width: "100%" },
  tabBtb: { width: "50%" },
  organizerImage: { backgroundColor: "#D9D9D9", width: 50, height: 50, borderRadius: 100 },
  infoWrapper: { flexDirection: "row", gap: 16, alignItems: "center", marginVertical: 12 },
  organizerAbout: { color: "#202226", fontSize: 16, fontWeight: "700" },
  organizerDetailsWrapper: { gap: 12 },
  organizerDateRow: { gap: 12, flexDirection: "row" },
  organizerTab: { padding: 16, backgroundColor: "#F9FFF2", borderRadius: 20 },

  // Floating Action Button styles (bigger, circular, translucent, shadow)
  fabWrapper: {
    position: "absolute",
    right: 24,
    bottom: 80,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(116, 187, 41, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
});

const DataRow = ({ keyText, valueText, icon, isPending }) => (
  <View style={styles.dataRow}>
    <View style={{ flexDirection: "row", gap: 8 }}>
      {icon}
      <Text style={styles.key}>{keyText}</Text>
    </View>
    {isPending ? (
      <Skeleton colorMode={colorMode} width={80} height={20} radius={20} />
    ) : (
      <Text style={styles.value}>{valueText}</Text>
    )}
  </View>
);

const Hr = () => <View style={styles.hr} />;
