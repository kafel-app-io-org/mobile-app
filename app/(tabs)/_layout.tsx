import { Redirect, Tabs } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  I18nManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { useTranslation } from "react-i18next";

import { API_BASE_URL } from "@/api/send-api-request";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/contexts/AuthContext";

import { HapticTab } from "@/components/HapticTab";
import HomeTabIcon from "@/assets/icons/HomeTabIcon";
import CampaignsTabIcon from "@/assets/icons/CampaignsTabIcon";
import ScanCodeTabIcon from "@/assets/icons/ScanCodeTabIcon";
import TransactionTabIcon from "@/assets/icons/TransactionTabIcon";
import NotificationsTabIcon from "@/assets/icons/NotificationsTabIcon";
import MenuButtonIcon from "@/assets/icons/MenuButtonIcon";
import ProfileEditButton from "@/assets/icons/ProfileEditButton";
import BackIcon from "@/assets/icons/BackIcon";
import MenuDonationIcon from "@/assets/icons/MenuDonationIcon";
import MenuLogoutIcon from "@/assets/icons/MenuLogoutIcon";
import MenuWithdrawalIcon from "@/assets/icons/MenuWithdrawalIcon";
import MenuProfileIcon from "@/assets/icons/MenuProfileIcon";
import CloseMenuIcon from "@/assets/icons/CloseMenuIcon";

import { switchLanguage, getCurrentLanguage } from "../../i18n";

const windowWidth = Dimensions.get("window").width;
const isRTL = I18nManager.isRTL;

export default function TabLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, handleLogout, setUserProfile, refetchProfile } = useAuth();
  const colorScheme = useColorScheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(isRTL ? -windowWidth : windowWidth)).current;

  refetchProfile();

  const handleNavigateDonationHistory = () => router.push(`/(tabs)/menu/DonationHistoryScreen`);
  const handleNavigateWithdrawalAccount = () => router.push(`/(tabs)/menu/WithdrawalAccountsScreen`);
  const handleNavigateProfileScreen = () => router.push(`/(tabs)/menu/ProfileScreen`);

  const handleOnPressToggleLanguage = async () => {
    const lang = await AsyncStorage.getItem("user-language");
    switchLanguage();

    if (lang === "ar") {
      await AsyncStorage.setItem("user-language", "en");
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    } else {
      await AsyncStorage.setItem("user-language", "ar");
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
    Updates.reloadAsync();
  };

  const menuItems = [
    { name: t("tabs.menu.profile"), icon: <MenuProfileIcon />, onPress: handleNavigateProfileScreen },
    { name: t("tabs.menu.donationHistory"), icon: <MenuDonationIcon />, onPress: handleNavigateDonationHistory },
    { name: t("tabs.menu.withdrawalAccount"), icon: <MenuWithdrawalIcon />, onPress: handleNavigateWithdrawalAccount },
    {
      name: t("tabs.menu.logout"),
      icon: <MenuLogoutIcon />,
      onPress: () => {
        setUserProfile(null);
        handleLogout();
      },
    },
  ];

  const toggleMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isMenuOpen ? 0 : isRTL ? windowWidth : -windowWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(menuAnim, {
        toValue: isMenuOpen ? (isRTL ? -windowWidth : windowWidth) : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsMenuOpen(!isMenuOpen));
  };

  const handleOnPressEditProfile = () => router.push(`/(tabs)/menu/EditProfileScreen`);
  const handleOnPressBack = () => router.back();

  const segments = useSegments();
  const routeName = segments[2] ? segments[2] : segments[1] ?? "index";

  const screenHeaderData: Record<
    string,
    { title?: React.ReactNode; showMenuButton?: boolean; hideHeader?: boolean }
  > = {
    index: {
      title: <Text style={styles.userName}>{user?.name || t("tabs.screens.anonymous")}</Text>,
      showMenuButton: true,
    },
    AllTransactionsScreen: {
      title: <Text style={styles.userName}>{t("tabs.screens.transactions")}</Text>,
      showMenuButton: true,
    },
    TransactionDetailsScreen: {
      title: (
        <View style={styles.headerRow}>
          <Text style={styles.userName}>{t("tabs.screens.transactionDetails")}</Text>
          <TouchableOpacity
            style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
            onPress={handleOnPressBack}
          >
            <BackIcon />
          </TouchableOpacity>
        </View>
      ),
      showMenuButton: false,
    },
    SendTransactionScreen: { title: <Text style={styles.userName}>{t("tabs.screens.send")}</Text>, showMenuButton: true },
    ReceiveTransactionScreen: { title: <Text style={styles.userName}>{t("tabs.screens.receive")}</Text>, showMenuButton: true },
    WithdrawScreen: { title: <Text style={styles.userName}>{t("tabs.screens.withdraw")}</Text>, showMenuButton: true },
    DepositScreen: { title: <Text style={styles.userName}>{t("tabs.screens.deposit")}</Text>, showMenuButton: true },
    ScanQrCodeScreen: { title: <Text style={styles.userName}>{t("tabs.screens.scanCode")}</Text>, showMenuButton: false },
    CampaignsScreen: { title: <Text style={styles.userName}>{t("tabs.screens.campaigns")}</Text>, showMenuButton: true },
    DonateCampaignScreen: {
      title: (
        <View style={styles.headerRow}>
          <Text style={styles.userName}>{t("tabs.screens.donate")}</Text>
          <TouchableOpacity
            style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
            onPress={handleOnPressBack}
          >
            <BackIcon />
          </TouchableOpacity>
        </View>
      ),
      showMenuButton: false,
    },
    CampaignDetailsScreen: {
      title: (
        <View style={styles.headerRow}>
          <Text style={styles.userName}>{t("tabs.screens.campaignDetails")}</Text>
          <TouchableOpacity
            style={[{ zIndex: 10, padding: 10 }, isRTL ? { transform: [{ scaleX: -1 }] } : undefined]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={handleOnPressBack}
          >
            <BackIcon />
          </TouchableOpacity>
        </View>
      ),
      showMenuButton: false,
    },
    DonationHistoryScreen: {
      title: (
        <View style={styles.headerRow}>
          <Text style={styles.userName}>{t("tabs.screens.donationHistory")}</Text>
        </View>
      ),
      showMenuButton: true,
    },
    DonationBenDistributionScreen: {
      title: (
        <View style={styles.headerRow}>
          <Text style={styles.userName}>{t("tabs.screens.beneficiaries")}</Text>
          <TouchableOpacity
            style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
            onPress={handleOnPressBack}
          >
            <BackIcon />
          </TouchableOpacity>
        </View>
      ),
      showMenuButton: false,
    },
    WithdrawalAccountsScreen: {
      title: (
        <View style={styles.headerRow}>
          <Text style={styles.userName}>{t("tabs.screens.withdrawalAccounts")}</Text>
        </View>
      ),
      showMenuButton: true,
    },
    ProfileScreen: {
      title: (
        <View style={[styles.headerRow, { flex: 1, width: "100%" }]}>
          <Text style={styles.userName}>{t("tabs.screens.profile")}</Text>
          {!user?.is_beneficiary ? (
            <TouchableOpacity style={{ marginEnd: 60 }} onPress={handleOnPressEditProfile}>
              <ProfileEditButton />
            </TouchableOpacity>
          ) : null}
        </View>
      ),
      showMenuButton: true,
    },
    EditProfileScreen: {
      title: (
        <View style={styles.headerRow}>
          <Text style={styles.userName}>{t("tabs.screens.editProfile")}</Text>
          <TouchableOpacity
            style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
            onPress={handleOnPressBack}
          >
            <BackIcon />
          </TouchableOpacity>
        </View>
      ),
      showMenuButton: false,
    },
    AllNotificationsScreen: {
      title: <Text style={styles.userName}>{t("tabs.screens.notifications")}</Text>,
      showMenuButton: true,
    },
  };

  const currentHeader = screenHeaderData[routeName] ?? {};

  return (
    <SafeAreaView style={styles.root} edges={["top", "right", "bottom", "left"]}>
      {/* Side Menu */}
      <Animated.View
        style={[
          styles.sideMenu,
          {
            transform: [{ translateX: menuAnim }],
            right: isRTL ? undefined : 0,
            left: isRTL ? 0 : undefined,
          },
        ]}
      >
        <Image style={styles.bgImage} source={require("@/assets/images/sideMenuBg.png")} />
        <View style={styles.sideMenuHeader}>
          <View style={styles.headerUserWrapper}>
            <Image style={styles.headerImage} source={{ uri: `${API_BASE_URL}${user?.image}` }} />
            <Text style={styles.userName}>{user?.name ? user?.name : t("tabs.menu.anonymous")}</Text>
          </View>
          <TouchableOpacity onPress={toggleMenu}>
            <Text style={styles.closeButton}>
              <CloseMenuIcon />
            </Text>
          </TouchableOpacity>
        </View>

        {menuItems.map((item) => (
          <TouchableOpacity
            style={styles.menuItemWrapper}
            key={item.name}
            onPress={async () => {
              await item.onPress();
              toggleMenu();
            }}
          >
            <View style={styles.activeItem} />
            {item.icon}
            <Text style={styles.menuItem}>{item.name}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.appInfo}>
          <TouchableOpacity onPress={handleOnPressToggleLanguage}>
            <Text style={styles.langToggle}>{getCurrentLanguage() === "en" ? "AR" : "EN"}</Text>
          </TouchableOpacity>
          <Text style={styles.appName}>{t("tabs.menu.app")}</Text>
          <Text style={styles.appVersion}>{t("tabs.menu.version")}</Text>
        </View>
      </Animated.View>

      {isMenuOpen && <TouchableOpacity style={styles.overlay} onPress={toggleMenu} activeOpacity={1} />}

      {/* Main content (slides when menu opens) */}
      <Animated.View style={[styles.main, { transform: [{ translateX: slideAnim }] }]}>
        {!currentHeader?.hideHeader && (
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              {currentHeader?.title ?? null}
            </View>
            {currentHeader?.showMenuButton && (
              <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                <Text>
                  <MenuButtonIcon />
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Tabs
            screenOptions={{
              tabBarHideOnKeyboard: true,
              headerShown: false,
              tabBarShowLabel: false,
              tabBarButton: HapticTab,
              // background for scenes to avoid edge gutters
              // @ts-ignore (v6/v7)
              sceneContainerStyle: { backgroundColor: "#FFFFFF" },
              // @ts-ignore (v7)
              sceneStyle: { backgroundColor: "#FFFFFF" },

              tabBarStyle: Platform.select({
                ios: {
                  position: "absolute",
                  height: 70,
                  paddingBottom: 8,
                },
                default: {
                  position: "absolute",
                  height: 56,
                },
              }),
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ focused }) => (
                  <HomeTabIcon fill={focused ? "#000" : "#fff"} stroke={focused ? "#000" : "#9DB2CE"} />
                ),
              }}
            />
            <Tabs.Screen
              name="transactions"
              options={{
                title: "Transactions",
                tabBarIcon: ({ focused }) => (
                  <TransactionTabIcon fill={focused ? "#000" : "#fff"} stroke={focused ? "#000" : "#9DB2CE"} />
                ),
              }}
            />
            <Tabs.Screen
              name="codeScan"
              options={{
                title: "Code Scan",
                tabBarIcon: ({ focused }) => (
                  <ScanCodeTabIcon fill={focused ? "#000" : "#fff"} stroke={focused ? "#000" : "#9DB2CE"} />
                ),
              }}
            />
            <Tabs.Screen
              name="campaigns"
              options={{
                title: "Campaigns",
                tabBarIcon: ({ focused }) => (
                  <CampaignsTabIcon fill={focused ? "#000" : "#fff"} stroke={focused ? "#000" : "#9DB2CE"} />
                ),
              }}
            />
            <Tabs.Screen
              name="notifications"
              options={{
                title: "Profile",
                tabBarIcon: ({ focused }) => (
                  <NotificationsTabIcon fill={focused ? "#000" : "#fff"} stroke={focused ? "#000" : "#9DB2CE"} />
                ),
              }}
            />
            <Tabs.Screen
              name="menu"
              options={{ tabBarButton: () => null, tabBarItemStyle: { display: "none" } }}
            />
          </Tabs>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF", // full-bleed white (no side gutters)
  },
  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    zIndex: 0,
  },

  // Header
  header: {
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  headerTitleWrap: {
    width: "100%",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#202226",
  },
  menuButton: {
    position: "absolute",
    right: 16,
  },

  // Side menu
  sideMenu: {
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#FFFFFF",
    padding: 16,
    zIndex: 50,
    elevation: 5,
    paddingTop: 30,
  },
  bgImage: {
    position: "absolute",
    width: Dimensions.get("window").width - 100,
    height: Dimensions.get("window").height - 200,
    right: -140,
    ...(I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : {}),
    top: 170,
  },
  sideMenuHeader: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 70,
    marginTop: Platform.OS === "ios" ? 0 : 20,
    flexDirection: "row",
    padding: 5,
  },
  closeButton: { fontSize: 22, padding: 8 },
  headerUserWrapper: { display: "flex" },
  headerImage: {
    width: 75,
    height: 75,
    borderRadius: 100,
    backgroundColor: "#EEEEEE",
    marginBottom: 15,
  },
  menuItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginVertical: 15,
    marginHorizontal: 20,
    position: "relative",
  },
  menuItem: { fontSize: 17, color: "#353535" },
  activeItem: {
    position: "absolute",
    top: -5,
    left: -36,
    zIndex: 1,
    width: 5,
    height: 40,
    backgroundColor: "#86C542",
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
  },
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 20,
  },
  appInfo: { marginTop: 100, marginHorizontal: 30, gap: 15, alignItems: "flex-start" },
  appName: { fontSize: 15, fontWeight: "600", color: "#202226" },
  appVersion: { fontSize: 13, fontWeight: "400", color: "#CBCBCB" },
  langToggle: {
    backgroundColor: "#86C542",
    color: "#FFF",
    padding: 4,
    borderRadius: 6,
    fontSize: 18,
  },
});
