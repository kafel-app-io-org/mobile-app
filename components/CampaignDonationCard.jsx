import React from "react";
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  I18nManager
} from "react-native";
import { API_BASE_URL } from "../api/send-api-request";
import { convertToFloatCents, formatDate } from "@/utils/helper";
import * as Progress from "react-native-progress";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";
import { VerifiedCampaignIcon } from "@/assets/icons/VerifiedCampaignIcon";
import { router } from "expo-router";
import { useRouter } from "expo-router";
import BeneficiariesIcon from "@/assets/icons/BeneficiariesIcon";
import { useTranslation } from "react-i18next";

export const CampaignDonationCard = ({ donation }) => {
  const router = useRouter();
  const handleOnPressBen = () => {
    console.log(donation?.id)
    router.push(
      {
        pathname:`/(tabs)/menu/DonationBenDistributionScreen`,
        params: { id: donation?.id },
      }
    );
  };
  const { t } = useTranslation();

  return (
    // <TouchableOpacity style={styles.container} onPress={handleOnPressCampaign}>
    <View style={styles.container} >
      <Image
        // source={{ uri: campaignData?.image }}
        source={{ uri: `${API_BASE_URL}${donation?.campaign?.image}` }}
        style={styles.image}
      />

      <View style={{ flex: 1, justifyContent: "space-between", padding: 5 }}>
        <View >
          <Text style={styles.title}>{donation?.campaign?.title}</Text>
          <View
            style={{
              //   display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 5,
              
              gap: 16,
            }}
          >
            <Text
              style={styles.location}
            >{`${donation?.campaign?.city}, ${donation?.campaign?.country}`}</Text>

            <View
              style={{backgroundColor: "#ddd", height: 12, width: 1 }}
            ></View>
            <Text 
            //  By RSR 
              style={{ fontSize: 12}}
            // Eend RSR
            >{formatDate(donation?.created_at) ?? ""}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection:"row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <VerifiedCampaignIcon />
            <Text style={styles.target}>{`$${convertToFloatCents(
              donation?.amount
            )}`}</Text>
          </View>

          <TouchableOpacity
           style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
          onPress={handleOnPressBen}
          >
            <BeneficiariesIcon/>
            <Text style={styles.benListText}>{t("tabs.campaigns.CampaignDonationCard.beneficiaries")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E5E5",
    padding: 10,
    borderRadius: 20,
    width: "100%",
    flexDirection: "row",
    // marginBottom: 16,
    gap: 12,
  },
  image: {
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    width: 90,
    height: 90,
  },
  title: {
    alignSelf:"flex-start",
    fontSize: 16,
    fontWeight: 600,
    color: "#202226",
  },
  location: {
    fontSize: 12,
    fontWeight: 400,
    color: "#27364E",
  },
  target: {
    fontSize: 12,
    fontWeight: 600,
    color: "#27364E",
  },
  percentage: {
    fontSize: 12,
    fontWeight: 500,
    color: "#27364E",
  },
  benListText:{
    fontSize: 12,
    fontWeight: 600,
    color: "#78BD2E",
    textDecorationLine:"underline"
  }
});

export const CampaignDonationCardSkeleton = () => {
  const colorMode = {
    light: {
      backgroundColor: "#E1E9EE",
      foregroundColor: "#F2F8FC",
    },
  };
  return (
    <View
      style={{
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#E5E5E5",
        padding: 10,
        borderRadius: 20,
        width: "100%",
        flexDirection: "row",
        gap: 12,
      }}
    >
      <Skeleton colorMode={colorMode} width={90} height={90} radius={12} />

      <View style={{ flex: 1, justifyContent: "space-between", padding: 5 }}>
        <View>
          <Skeleton colorMode={colorMode} width={200} height={16} />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 5,
              gap: 16,
            }}
          >
            <Skeleton colorMode={colorMode} width={100} height={12} />
            <Skeleton colorMode={colorMode} width={80} height={12} />
          </View>
        </View>

        <View style={{ display: "flex", gap: 5 }}>
          <View style={{ alignItems: "flex-end" }}>
            <Skeleton colorMode={colorMode} width={40} height={12} />
          </View>
          <Skeleton colorMode={colorMode} width="100%" height={6} radius={3} />
        </View>
      </View>
    </View>
  );
};
