import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";
import { useTranslation } from "react-i18next";

import { DownArrowIcon } from "@/assets/icons/DownArrowIcon";
import { UpArrowIcon } from "@/assets/icons/UpArrowIcon";
import { MinusIcon } from "@/assets/icons/MinusIcon";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import { DonationIcon } from "@/assets/icons/DonationIcon";

import {
  formatDate,
  formatTime,
  convertToFloatCents,
  formatCurrency,
} from "@/utils/helper";

/**
 * Props:
 * - transactionData: object
 *   Expected shape (examples):
 *   {
 *     id?: string|number,
 *     transaction?: { id?: string|number },
 *     amount: number,                  // cents or minor units (as per your helpers)
 *     date: string|number|Date,
 *     status: 'Pending'|'Succeeded'|... (for i18n key)
 *     category: 'deposit'|'withdraw'|'transfer'|'donation'
 *     type: 'Sent'|'Received'|'Deposit'|'Withdraw'|'Donation'
 *     sourceName?: string
 *     targetName?: string
 *     description?: string
 *   }
 *
 * - handleOnPressTransation: (id: string|number) => void
 */
export const TransactionCard = memo(function TransactionCard({
  transactionData,
  handleOnPressTransation = () => {},
}) {
  const { t } = useTranslation();

  // ---- Helpers -------------------------------------------------------------
  const getIcon = (type = "") => {
    const norm = String(type).toLowerCase();
    if (norm === "withdraw") return <MinusIcon />;
    if (norm === "deposit") return <PlusIcon />;
    if (norm === "received") return <DownArrowIcon />;
    if (norm === "sent") return <UpArrowIcon />;
    if (norm === "donation") return <DonationIcon />;
    return null;
  };

  const getTitle = (tx) => {
    // Mirrors your original logic, with small guards
    if (!tx) return "";
    const { category, type, targetName, sourceName, description } = tx;

    if (category === "deposit" || category === "donation") {
      return t(`tabs.transactions.AllTransactionsScreen.${category}`);
    }
    if (type === "Sent") return targetName || "";
    if (type === "Received") return sourceName || "";
    if (category === "withdraw") {
      // description is an i18n key in your code
      return t(`tabs.transactions.AllTransactionsScreen.${description}`);
    }
    return "";
  };

  const id =
    transactionData?.transaction?.id ??
    transactionData?.id ??
    null;

  const onPress = useCallback(() => {
    if (!id) return;
    handleOnPressTransation(id);
  }, [id, handleOnPressTransation]);

  // ---- Render --------------------------------------------------------------
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.image}>{getIcon(transactionData?.type)}</View>

      <View style={{ flex: 1, gap: 5 }}>
        {/* Top row: title & amount */}
        <View style={styles.rowBetween}>
          <Text numberOfLines={1} style={styles.title}>
            {getTitle(transactionData)}
          </Text>

          <Text style={styles.title}>
            {`${formatCurrency(
              convertToFloatCents(Math.abs(transactionData?.amount ?? 0))
            )}$`}
          </Text>
        </View>

        {/* Bottom row: date/time & status */}
        <View style={styles.rowBetween}>
          <Text style={styles.date}>
            {transactionData?.date
              ? `${formatDate(transactionData.date)} ${formatTime(transactionData.date)}`
              : ""}
          </Text>

          <Text style={styles.date}>
            {t(`tabs.transactions.AllTransactionsScreen.${transactionData?.status}`)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

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
  image: {
    backgroundColor: "transparent",
    borderRadius: 100,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#202226",
    textTransform: "capitalize",
    maxWidth: "70%",
  },
  date: {
    fontSize: 12,
    fontWeight: "400",
    color: "#838383",
  },
});

/* Skeleton version remains identical to your original visuals */
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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Skeleton colorMode={colorMode} width={120} height={14} />
          <Skeleton colorMode={colorMode} width={60} height={14} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Skeleton colorMode={colorMode} width={80} height={12} />
          <Skeleton colorMode={colorMode} width={70} height={12} />
        </View>
      </View>
    </View>
  );
};
