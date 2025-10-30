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
} from "react-native";
import { API_BASE_URL } from "../api/send-api-request"
import { formatDate, formatTime, convertToFloatCents, formatCurrency } from "@/utils/helper";

import * as Progress from "react-native-progress";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";
import { VerifiedCampaignIcon } from "@/assets/icons/VerifiedCampaignIcon";
import { router } from "expo-router";
import { useRouter } from "expo-router";

export const CampaignCard = ({ campaignData }) => {
  const router = useRouter();
  const handleOnPressCampaign = () => {
    router.replace(`/(tabs)/campaigns`);
    setTimeout(() => {
      router.push({
        pathname: `/(tabs)/campaigns/CampaignDetailsScreen`,
        params: campaignData,
      });
    }, 0);
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handleOnPressCampaign}>
      <Image
        // source={{ uri: campaignData?.image }}
        source={{ uri: `${API_BASE_URL}${campaignData?.image}` }}
        style={styles.image}
      />

      <View style={{ flex: 1, justifyContent: "space-between", padding: 5}}>
        <View style={{ }}>
          <Text style={styles.title}>{campaignData?.title}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 5,
              // flex: 1,
              gap: 16,
            }}
          >
            <Text
              style={styles.location}
            >{`${campaignData?.city}, ${campaignData?.country}`}</Text>
            <View
              style={{
                // display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <VerifiedCampaignIcon />
              <Text
                style={styles.target}
              >{`$${formatCurrency((convertToFloatCents(campaignData?.total_target)) || 0)}`}</Text>
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={styles.percentage}
            >{`${campaignData?.progress?? 0}%`}</Text>
          </View>
          <Progress.Bar
            animated
            color={"#74BB29"}
            unfilledColor={"#EAECF0"}
            borderWidth={0}
            height={6}
            progress={campaignData?.progress/100}
            width={null}
            style={{ marginTop: 10, alignSelf: "stretch" }}
          />
        </View>
      </View>
    </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: 600,
    color: "#202226",
    alignSelf:"flex-start"
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
});

export const CampaignCardSkeleton = () => {
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
