import {
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useRouter, Redirect } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";
import Svg, { Circle, Defs, Stop } from "react-native-svg";
import { useLandingPageData, useUserProfile } from "@/query-hooks/general-query-hooks";
import { CampaignCard, CampaignCardSkeleton } from "@/components/CampaignCard";
import { TransactionCard, TransactionCardSkeleton } from "@/components/TransactionCard";

import { DepositIcon } from "@/assets/icons/DepositIcon";
import { SendIcon } from "@/assets/icons/SendIcon";
import { ReciveIcon } from "@/assets/icons/ReciveIcon";
import { WithdrawIcon } from "@/assets/icons/WithdrawIcon";

import BalanceImage from "@/assets/images/balance-bg-green.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/utils/helper";

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  const { data, isPending, refetch } = useLandingPageData();
  const { data: userProfile } = useUserProfile();

  useEffect(() => {
    console.log("userProfile:", userProfile);
  }, [userProfile]);

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
  }, [refetch]);

  // avoid logging AsyncStorage on every render
  useEffect(() => {
    (async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        console.log("AsyncStorage contents:", items);
      } catch (e) {}
    })();
  }, []);

  if (!user) return <Redirect href="/(auth)" />;

  const handleOnPressSeeAllCampaigns = () => {
    router.push("/(tabs)/campaigns/CampaignsScreen");
  };

  // Open the full transactions list
  const handleOnPressSeeAllTransactions = () => {
    router.push("/(tabs)/transactions/AllTransactionsScreen");
  };

  // Open the list and auto-open details via params
  const handleCardPress = (id) => {
    if (!id) return;
    router.push({
      pathname: "/(tabs)/transactions/AllTransactionsScreen",
      params: {
        transaction_id_param: String(id),
        // Ensure AllTransactionsScreen's effect re-triggers even if same tx
        refreshKey: String(Date.now()),
      },
    });
  };

  // Shortcuts on top card
  const goSend = () => router.push("/(tabs)/transactions/SendTransactionScreen");
  const goReceive = () => router.push("/(tabs)/transactions/ReceiveTransactionScreen");
  const goDeposit = () => router.push("/(tabs)/transactions/DepositScreen");
  const goWithdraw = () => router.push("/(tabs)/transactions/WithdrawScreen");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.mainWrapper}>
          <ImageBackground
            source={BalanceImage}
            style={styles.balanceWrapper}
            imageStyle={{ borderRadius: 20 }}
          >
            <Text style={styles.balanceLabel}>{t("tabs.home.balance")}</Text>
            {isPending ? (
              <MotiView
                transition={{ type: "timing", duration: 1000 }}
                animate={{ opacity: [0.5, 1] }}
                style={[styles.balanceValue, { opacity: 0.7 }]}
              >
                <Text style={styles.balanceValue}>$0.00</Text>
              </MotiView>
            ) : (
              <Text style={styles.balanceValue}>{`$${
                data?.balance?.balance
                  ? formatCurrency(data.balance.balance / 100)
                  : 0
              }`}</Text>
            )}
          </ImageBackground>

          <View style={styles.actionsWrapper}>
            <TouchableOpacity onPress={goSend}>
              <SendIcon />
              <Text style={styles.actionLabel}>{t("tabs.home.send")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goReceive}>
              <ReciveIcon />
              <Text style={styles.actionLabel}>{t("tabs.home.receive")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goDeposit}>
              <DepositIcon />
              <Text style={styles.actionLabel}>{t("tabs.home.deposite")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goWithdraw}>
              <WithdrawIcon />
              <Text style={styles.actionLabel}>{t("tabs.home.withdraw")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Latest Campaigns */}
        <View style={{ marginBottom: 10, paddingHorizontal: 16 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("tabs.home.latestCampaigns")}</Text>
            <TouchableOpacity onPress={handleOnPressSeeAllCampaigns}>
              <Text style={styles.seeAllBtn}>{t("tabs.home.seeAll")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ display: "flex", gap: 12 }}>
            {Array.isArray(data?.latestCampaigns) &&
              (data.latestCampaigns.length === 0 ? (
                <Text style={{ textAlign: "center", marginVertical: 12 }}>
                  {t("tabs.home.noCampaigns")}
                </Text>
              ) : (
                data.latestCampaigns.map((item, index) => (
                  <CampaignCard key={index} campaignData={item} />
                ))
              ))}
            {isPending && (
              <>
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
              </>
            )}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={{ paddingHorizontal: 16 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("tabs.home.recentTransactions")}</Text>
            <TouchableOpacity onPress={handleOnPressSeeAllTransactions}>
              <Text style={styles.seeAllBtn}>{t("tabs.home.seeAll")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ display: "flex", gap: 12 }}>
            {isPending && (
              <>
                <TransactionCardSkeleton />
                <TransactionCardSkeleton />
              </>
            )}

            {Array.isArray(data?.latestTransfers) &&
              (data.latestTransfers.length === 0 ? (
                <Text style={{ textAlign: "center", marginVertical: 12 }}>
                  {t("tabs.home.noTransactions")}
                </Text>
              ) : (
                data.latestTransfers.map((item, index) => (
                  <TransactionCard
                    key={String(item?.transaction?.id ?? index)}
                    transactionData={item}
                    handleOnPressTransation={handleCardPress}
                  />
                ))
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffffff",
    minHeight: "100%",
  },
  mainWrapper: {
    backgroundColor: "#F6F6F6",
    marginVertical: 12,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  balanceWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 20,
    flex: 1,
    alignItems: "flex-start",
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 14,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 37,
    fontWeight: "800",
  },
  actionsWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 16,
  },
  actionLabel: {
    color: "#3B363F",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
    alignSelf: "center",
  },
  sectionHeader: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#202226",
    fontSize: 18,
    fontWeight: "700",
  },
  seeAllBtn: {
    color: "#838383",
    fontSize: 14,
    fontWeight: "600",
  },
});
