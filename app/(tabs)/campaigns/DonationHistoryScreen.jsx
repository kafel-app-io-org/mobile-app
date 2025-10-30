import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";

import { CampaignDonationCard, CampaignDonationCardSkeleton } from "@/components/CampaignDonationCard";
import { useAllDonations } from "@/query-hooks/campaigns-query-hooks";

const DonationHistoryScreen = () => {
    const { data: donations, isPending: isPendingDonations } = useAllDonations();
    useEffect(() => {
      console.log(donations);
    }, [donations]);

  return (
       <View style={styles.container}>
      <SafeAreaView>
        <View style={{ marginBottom: 15, marginTop: 10 }}>
          <ScrollView style={{ paddingHorizontal: 16 }}>
            <View style={{ display: "flex", gap: 12 }}>
              {donations && Array.isArray(donations) ? (
                donations?.map((d, index) => (
                    <></>
                //   <CampaignDonationCard key={index} donation={d} />
                ))
              ) : !isPendingDonations ? (
                <Text
                  style={{
                    alignSelf: "center",
                    marginVertical: 40,
                    marginVertical: 40,
                    color: "#333",
                  }}
                >
                  No Donations Records to Show
                </Text>
              ) : null}

              {isPendingDonations && (
                <>
                  <CampaignDonationCardSkeleton />
                  <CampaignDonationCardSkeleton />
                  <CampaignDonationCardSkeleton />
                  <CampaignDonationCardSkeleton />
                  <CampaignDonationCardSkeleton />
                  <CampaignDonationCardSkeleton />
                  <CampaignDonationCardSkeleton />
                  <CampaignDonationCardSkeleton />
                </>
              )}
            </View>

            <View style={{ height: 170 }}></View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default DonationHistoryScreen


const styles = StyleSheet.create({
    container: {
      // marginTop: 60,
      // paddingTop: Platform.OS === 'ios' ? 80 : 30,
      backgroundColor: "#fff",
      height: "100%",
      // paddingHorizontal: 16,
      marginBottom: 100,
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
  });