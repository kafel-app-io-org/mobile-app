import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  TextInput,
  Platform,
  Modal,
  I18nManager,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  BeneficiaryDonationCard,
  BeneficiaryDonationCardSkeleton,
} from "@/components/BeneficiaryDonationCard";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  CampaignDonationCard,
  CampaignBenCardSkeleton,
} from "@/components/CampaignDonationCard";
import { useDonationBenDistribution } from "@/query-hooks/campaigns-query-hooks";

const DonationBenDistributionScreen = () => {
  const { t } = useTranslation();

  const { id } = useLocalSearchParams();
  const {
    data: bens,
    isPending: isPendingBens,
    refetch,
  } = useDonationBenDistribution(id);
  useEffect(() => {
    console.log(bens);
  }, [bens]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ff", height: "100%" }}>
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          flex: 1,
          backgroundColor: "#fff",
          // height: Dimensions.get("window").height,
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 16,
            gap: 18,
            // height: Dimensions.get("window").height,
          }}
        >
          <View style={{ display: "flex", gap: 10, marginBottom: 60 }}>
            {bens &&
            Array.isArray(bens?.distributions) &&
            bens?.distributions?.length > 0 ? (
              bens?.distributions?.map((d, index) => (
                <>
                  <BeneficiaryDonationCard key={index} ben={d} />
                  {index < bens?.distributions?.length - 1 && <Hr />}
                </>
              ))
            ) : !isPendingBens ? (
              <Text
                style={{
                  alignSelf: "center",
                  marginVertical: 40,
                  marginVertical: 40,
                  color: "#333",
                }}
              >
                {t("tabs.menu.DonationBenDistributionScreen.noDistribution")}
              </Text>
            ) : null}

            {isPendingBens && (
              <>
                <BeneficiaryDonationCardSkeleton />
                <BeneficiaryDonationCardSkeleton />
                <BeneficiaryDonationCardSkeleton />
                <BeneficiaryDonationCardSkeleton />
                <BeneficiaryDonationCardSkeleton />
                <BeneficiaryDonationCardSkeleton />
                <BeneficiaryDonationCardSkeleton />
                <BeneficiaryDonationCardSkeleton />
                <BeneficiaryDonationCardSkeleton />
              </>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default DonationBenDistributionScreen;

const styles = StyleSheet.create({
  container: {
    // marginTop: 60,
    // paddingTop: Platform.OS === 'ios' ? 80 : 30,
    backgroundColor: "#fff",
    height: "100%",
    // paddingHorizontal: 16,
    // marginBottom: 100,
  },
  sectionHeader: {
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "#202226",
    fontSize: 18,
    fontWeight: 700,
  },
  seeAllBtn: {
    color: "#838383",
    fontSize: 14,
    fontWeight: 600,
  },
  hr: {
    borderBottomColor: "#EAECF0",
    borderBottomWidth: 1,
    marginVertical: 8,
    width: "100%", // or set a fixed width
  },
});

const Hr = () => {
  return <View style={styles.hr}></View>;
};
