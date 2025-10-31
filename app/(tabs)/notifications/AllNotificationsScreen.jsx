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
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "@react-navigation/native";

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

  // 1) Refetch on initial mount (guarded so it runs once)
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      refetch();
    }
  }, [refetch]);

  // 2) Refetch every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
      return () => {}; // cleanup not needed here
    }, [refetch])
  );

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View style={{ flex: 1 }}>
          {notifications &&
          Array.isArray(notifications) &&
          notifications.length > 0 ? (
            notifications.map((n, index) => (
              <NotificationCard key={index} notification={n} />
            ))
          ) : !isPendingNotifications ? (
            <Text
              style={{
                alignSelf: "center",
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
