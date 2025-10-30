import React from "react";
import { View, Text, Image } from "react-native";
import { Skeleton } from "moti/skeleton";
import { formatDate, formatTime, convertToFloatCents, formatCurrency } from "@/utils/helper";
import { API_BASE_URL } from "../api/send-api-request"

export const BeneficiaryDonationCard = ({ ben }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{
          backgroundColor: "#F7F7F7",
          width: 50,
          height: 50,
          borderRadius: 100,
        }}
        source={{ uri: `${API_BASE_URL}${ben?.beneficiary?.image}` }}
      />
      {console.log('ben' , ben)}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 14, color: "#202226", fontWeight: 600 }}>
            {ben?.beneficiary?.name}
          </Text>
          <Text style={{ fontSize: 14, color: "#27364E", fontWeight: 600 }}>
            {`$${formatCurrency(convertToFloatCents(ben?.amount))}`}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: "#27364E", fontWeight: 400 }}>
           {`${ben?.beneficiary?.city ||''}${ben?.beneficiary?.country && ben?.beneficiary?.city ? ',':''} ${ben?.beneficiary?.country || ''}`}
          </Text>
          <Text style={{ fontSize: 12, color: "#838383", fontWeight: 400 }}>
            {formatDate(ben?.created_at)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const BeneficiaryDonationCardSkeleton = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Skeleton radius="round" width={50} height={50} colorMode="light" />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Skeleton width={"50%"} height={14} colorMode="light" />
          <Skeleton width={60} height={14} colorMode="light" />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Skeleton width={100} height={12} colorMode="light" />
          <Skeleton width={120} height={12} colorMode="light" />
        </View>
      </View>
    </View>
  );
};
