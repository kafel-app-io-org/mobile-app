import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  RefreshControl,
  TouchableWithoutFeedback
} from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";
import Svg, { Circle, Defs, Stop } from "react-native-svg";
import { useLandingPageData, useUserProfile } from "@/query-hooks/general-query-hooks";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/Header";
import { CampaignCard, CampaignCardSkeleton } from "@/components/CampaignCard";
import {
  TransactionCard,
  TransactionCardSkeleton,
} from "@/components/TransactionCard";

import { DepositIcon } from "@/assets/icons/DepositIcon";
import { SendIcon } from "@/assets/icons/SendIcon";
import { ReciveIcon } from "@/assets/icons/ReciveIcon";
import { WithdrawIcon } from "@/assets/icons/WithdrawIcon";

import BalanceImage from "@/assets/images/balance-bg-green.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { formatCurrency } from "@/utils/helper";
export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, setUser } = useAuth();
console.log('user&&&: ', user)
  const { data, isPending, refetch } = useLandingPageData();
  const { data: userProfile, isPending: isPendingUserProfile, refetch: refetchUserProfile } = useUserProfile();
  useEffect(() => {
    console.log(userProfile);
  }, [userProfile]);
  

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();     
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const logAsyncStorage = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    console.log('AsyncStorage contents:', items);
  };

  logAsyncStorage();
  const handleOnPressSeeAllCampaigns = () => {
    router.push("/(tabs)/campaigns/CampaignsScreen");
  };
  const handleOnPressSeeAllTransactions = () => {
    router.push("/(tabs)/transactions/AllTransactionsScreen");
  };
  const handleOnPressSendTransactions = () => {
    router.replace(`/(tabs)/transactions`);
    setTimeout(() => {
      router.push(`/(tabs)/transactions/SendTransactionScreen`);
    }, 0);
  };
  const handleOnPressSendWithdraw = () => {
    router.replace(`/(tabs)/transactions`);
    setTimeout(() => {
      router.push(`/(tabs)/transactions/WithdrawScreen`);
    }, 0);
  };
  const handleOnPressSendDeposit = () => {
    router.replace(`/(tabs)/transactions`);
    setTimeout(() => {
      router.push(`/(tabs)/transactions/DepositScreen`);
    }, 0);
  };
  const handleOnPressReciveTransactions = () => {
    router.replace(`/(tabs)/transactions`);
    setTimeout(() => {
      router.push(`/(tabs)/transactions/ReceiveTransactionScreen`);
    }, 0);
  };

  if (!user) {
    return <Redirect href="/(auth)" />;
  }
  const colorMode = {
    light: {
      backgroundColor: "#E1E9EE",
      foregroundColor: "#F2F8FC",
    },
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        // style={{ paddingHorizontal: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
                  ? formatCurrency(data?.balance?.balance / 100)
                  : 0
              }`}</Text>
            )}
          </ImageBackground>

          <View style={styles.actionsWrapper}>
            <TouchableOpacity onPress={handleOnPressSendTransactions}>
              <SendIcon />
              <Text style={styles.actionLabel}>{t("tabs.home.send")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOnPressReciveTransactions}>
              <ReciveIcon />
              <Text style={styles.actionLabel}>{t("tabs.home.receive")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOnPressSendDeposit}>
              <DepositIcon />
              <Text style={styles.actionLabel}>{t("tabs.home.deposite")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOnPressSendWithdraw}>
              <WithdrawIcon />
              <Text style={styles.actionLabel}>{t("tabs.home.withdraw")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 10, paddingHorizontal: 16 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("tabs.home.latestCampaigns")}</Text>
            <TouchableOpacity onPress={handleOnPressSeeAllCampaigns}>
              <Text style={styles.seeAllBtn}>{t("tabs.home.seeAll")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ display: "flex", gap: 12 }}>
            {Array.isArray(data?.latestCampaigns) &&
              (data?.latestCampaigns?.length == 0 ? (
                <Text style={{ textAlign: "center", marginVertical: 12 }}>
                  {t("tabs.home.noCampaigns")}
                </Text>
              ) : (
                data?.latestCampaigns?.map((item, index) => (
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

        <View style={{paddingHorizontal: 16}}>
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
              (data?.latestTransfers?.length == 0 ? (
                <Text style={{ textAlign: "center", marginVertical: 12 }}>
                  {t("tabs.home.noTransactions")}
                </Text>
              ) : (
                data?.latestTransfers?.map((item, index) => (
                  <TransactionCard key={index} transactionData={item} />
                ))
              ))}
          </View>
        </View>

        {/* <View style={{ height: 100 }}></View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffffff",
    minHeight: "100%",

    // height: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

  mainWrapper: {
    backgroundColor: "#F6F6F6",
    marginVertical: 12,
    borderRadius: 20,
    marginHorizontal: 16
  },
  balanceWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 20,
    flex: 1,
    alignItems:"flex-start"
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: 400,
    marginBottom: 14,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 37,
    fontWeight: 800,
  },
  actionsWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 16,
  },
  actionLabel: {
    color: "#3B363F",
    fontSize: 12,
    fontWeight: 500,
    marginTop: 6,
    alignSelf:"center",
  },
  sectionHeader: {
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  transactionContainer: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E5E5",
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
});
