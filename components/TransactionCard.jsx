import React from "react";
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Progress from "react-native-progress";
import { DownArrowIcon } from "@/assets/icons/DownArrowIcon";
import { UpArrowIcon } from "@/assets/icons/UpArrowIcon";
import { MinusIcon } from "@/assets/icons/MinusIcon";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import { DonationIcon } from "@/assets/icons/DonationIcon"
import { Skeleton } from "moti/skeleton";
import { useRouter } from "expo-router";
import {
  formatDate,
  formatTime,
  convertToFloatCents,
  formatCurrency,
} from "@/utils/helper";
import { useTranslation } from "react-i18next";

import { MotiView } from "moti";
export const TransactionCard = ({
  transactionData,
  handleOnPressTransation = () => {},
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  // console.log("transactionData: ", transactionData);

  // const handleOnPressTransation = () => {
  //   router.replace(`/(tabs)/transactions`);
  //   setTimeout(() => {
  //     router.push({
  //       pathname: `/(tabs)/transactions/TransactionDetailsScreen`,
  //       params: transactionData,
  //     });
  //   }, 0);
  // };
  const renderTransactionIcon = (type) => {
    switch (type) {
      case "Withdraw":
        return <MinusIcon />;
      case "Deposit":
        return <PlusIcon />;
      case "Received":
        return <DownArrowIcon />;
      case "Sent":
        return <UpArrowIcon />;   
      case "Donation":
        return <DonationIcon />; 

      default:
        return null;
    }
  };

  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={(e) => handleOnPressTransation(transactionData?.transaction?.id)}
    >
      <View style={styles.image}>
        {renderTransactionIcon(transactionData?.type || "")}
      </View>
      <View style={{ flex: 1, gap: 5 }}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* <Text style={styles.title}>{transactionData?.targetName ?transactionData?.targetName:transactionData?.description}</Text> */}
          <Text style={styles.title}>
            {transactionData?.category === "deposit" || transactionData?.category === "donation" 
              ? t(`tabs.transactions.AllTransactionsScreen.${transactionData?.category}`)
              : transactionData?.type === "Sent"
              ? transactionData?.targetName
              : transactionData?.type === "Received"
              ? transactionData?.sourceName
              : transactionData?.category === "withdraw"
              ?  t(`tabs.transactions.AllTransactionsScreen.${transactionData?.description}`)
              : ""}
          </Text>
          <Text style={styles.title}>{`${formatCurrency(
            convertToFloatCents(Math.abs(transactionData?.amount))
            // convertToFloatCents(transactionData?.amount)
          )}$`}</Text>
          {/* <Text style={styles.title}>{(transactionData?.amount > 0? "+": "-")+'$' + transactionData?.amount}</Text> */}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.date}>
            {/* valueText={`${formatDate(transaction?.date)} ${formatTime(transaction?.date)}`} */}

            {`${formatDate(transactionData?.date)} ${formatTime(transactionData?.date)}` ?? ""}
          </Text>
          <Text style={styles.date}>{ t(`tabs.transactions.AllTransactionsScreen.${transactionData?.status}`)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E5E5",
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  redImage: {
    backgroundColor: "#FCE8EA",
    borderRadius: 100,
    width: 48,
    height: 48,
  },
  greenImage: {
    backgroundColor: "#E9FCE8",
    borderRadius: 100,
    width: 48,
    height: 48,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: "#202226",
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 12,
    fontWeight: 400,
    color: "#838383",
  },
  target: {
    fontSize: 12,
    fontWeight: 600,
    color: "#27364E",
  },
  percentage: {
    fontSize: 12,
    fontWeight: 500,
    color: "#27364E",
  },
});

export const TransactionCardSkeleton = () => {
  const colorMode = {
    light: {
      backgroundColor: "#E5E5E5",
      foregroundColor: "#F6F6F6",
    },
  };
  return (
    <View
      style={{
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#E5E5E5",
        padding: 10,
        borderRadius: 20,
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
      }}
    >
      <Skeleton colorMode={colorMode} width={48} height={48} radius={100} />
      <View style={{ flex: 1, gap: 5 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Skeleton colorMode={colorMode} width={120} height={14} />
          <Skeleton colorMode={colorMode} width={60} height={14} />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Skeleton colorMode={colorMode} width={80} height={12} />
          <Skeleton colorMode={colorMode} width={70} height={12} />
        </View>
      </View>
    </View>
  );
};
// const colorMode = {
//   light: {
//     backgroundColor: "#E1E9EE",
//     foregroundColor: "#F2F8FC"
//   }
// };
