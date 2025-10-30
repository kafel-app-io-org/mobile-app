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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NotificationIcon from "@/assets/icons/NotificationIcon";
import { convertToIntegerCents } from "@/utils/helper";

import { useAllNotifications } from "@/query-hooks/general-query-hooks";
import {
  NotificationCard,
  NotificationCardSkeleton,
} from "@/components/NotificationCard";

const AllNotificationsScreen = () => {
  const {
    data: notifications,
    isPending: isPendingNotifications,
    refetch,
  } = useAllNotifications();

  useEffect(() => {
    console.log("notifications", notifications);
  }, [notifications]);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", height: "100%" }}>
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
            // paddingVertical: 20,
            // gap: 18,
            // height: Dimensions.get("window").height,
            marginBottom: 60,
          }}
        >
          {notifications &&
          Array.isArray(notifications) &&
          notifications?.length > 0 ? (
            notifications?.map((n, index) => (
              <NotificationCard key={index} notification={n} />
            ))
          ) : !isPendingNotifications ? (
            <Text
              style={{
                alignSelf: "center",
                marginVertical: 40,
                marginVertical: 40,
                color: "#333",
              }}
            >
              No Notifications to Show
            </Text>
          ) : null}

          {isPendingNotifications && (
            <>
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AllNotificationsScreen;
