import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import NotificationIcon from "@/assets/icons/NotificationIcon";
import { Skeleton } from "moti/skeleton";
import { convertToIntegerCents } from "@/utils/helper";

import { timeAgo } from "@/utils/helper";
import { useReadNotification } from "@/query-hooks/general-query-hooks";
import { router } from "expo-router";

export const NotificationCard = ({ notification }) => {
  const { mutateAsync: mutateAsyncReadNotification } = useReadNotification();


  const handleOnPressNotification = async (notification) => {
    router.push(
      {
        pathname:`/(tabs)/transactions/AllTransactionsScreen`,
        params: { transaction_id_param: notification?.transaction?.id, refreshKey: Date.now() },
      }
    );
    await mutateAsyncReadNotification({
      notification_id: notification?.id,
    });
  };
  return (
    <TouchableOpacity
      onPress={()=>handleOnPressNotification(notification)}
      style={{
        backgroundColor: notification?.is_read ? "#fff" : "#F9FFF2",
        flexDirection: "row",
        paddingHorizontal: 32,
        paddingVertical: 24,
        gap: 12,
      }}
    >
      <View
        style={{
          backgroundColor: notification?.is_read ? "#F3F3F3" : "#74BB29",
          borderRadius: 100,
          width: 47,
          height: 47,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <NotificationIcon color={notification?.is_read ? "#202226" : "#fff"} />
      </View>
      <View style={{ width: "100%", flex: 1, gap: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#202226", fontSize: 16, fontWeight: 700 }}>
            {notification?.title}
          </Text>
          <Text style={{ color: "#808080", fontSize: 12, fontWeight: 400 }}>
            {timeAgo(notification?.created_at)}
          </Text>
        </View>
        <Text style={{ color: "#202226", fontSize: 14, fontWeight: 400, alignSelf:"flex-start" }}>
          {notification?.details}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const NotificationCardSkeleton = () => {
  return (
    <View
      style={{
        backgroundColor: "#F9FFF2",
        flexDirection: "row",
        paddingHorizontal: 32,
        paddingVertical: 24,
        gap: 12,
      }}
    >
      <Skeleton radius="round" width={47} height={47} colorMode="light" />
      <View style={{ width: "100%", flex: 1, gap: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Skeleton width="60%" height={16} colorMode="light" />
          <Skeleton width={60} height={12} colorMode="light" />
        </View>
        <Skeleton width="90%" height={14} colorMode="light" />
      </View>
    </View>
  );
};
