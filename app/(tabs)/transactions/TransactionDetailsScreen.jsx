import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Skeleton } from "moti/skeleton";

import { LinearGradient } from "expo-linear-gradient";
import { formatDate, formatTime, convertToFloatCents } from "@/utils/helper";
const colorMode = {
    light: {
      backgroundColor: "#E1E9EE",
      foregroundColor: "#F2F8FC",
    },
  };
  
  const TransactionDetailsScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    console.log(id);

    // const {
    //     data: campaign,
    //     isPending: isPendingCampaign,
    //     refetch,
    //   } = useCampaignDetails(id);
    //   useEffect(() => {
    //     console.log(campaign);
    //     console.log(campaign?.organizer);
    //   }, []);
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
      <View>
        <Text>sdf</Text>
      </View>
    )
  }
  
  export default TransactionDetailsScreen