// app/(tabs)/transactions/DepositScreen.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  I18nManager,
  Alert,
  Modal,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Linking } from "react-native";
import { router } from "expo-router";

import { parseUnits } from "viem";
import {
  useAccount,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useAppKit, useWalletInfo } from "@reown/appkit-wagmi-react-native";

import { convertToIntegerCents } from "@/utils/helper";
import { useDeposit } from "@/query-hooks/deposit-query-hooks";

import { USDT_DESTS } from "../../../usdtConfig";
const ACTIVE = USDT_DESTS[0];

const ERC20_TRANSFER_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
];

/** 15s countdown modal that blocks OK until timer ends */
const PayloadAlert = ({ visible, payload, onConfirm }) => {
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState(15);

  useEffect(() => {
    if (!visible) return;
    setSecondsLeft(15);
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [visible]);

  const okLabel =
    secondsLeft > 0
      ? t("tabs.transactions.DepositScreen.okWithSeconds", ({ seconds: secondsLeft })) // e.g., "OK (15)"
      : t("tabs.transactions.DepositScreen.ok"); // "OK"

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {t("tabs.transactions.DepositScreen.transactionInProgress")}
          </Text>
          <Text style={styles.modalText}>
            {t("tabs.transactions.DepositScreen.pleaseWaitAFewSeconds")}
          </Text>

          <TouchableOpacity
            style={[
              styles.modalButton,
              secondsLeft > 0 && styles.modalButtonDisabled,
            ]}
            disabled={secondsLeft > 0}
            onPress={onConfirm}
            accessibilityLabel={t("tabs.transactions.DepositScreen.confirmAfterCountdown")}
          >
            <Text style={styles.modalButtonText}>{okLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const DepositScreen = () => {
  const { t } = useTranslation();

  // Wallet / chain
  const { open } = useAppKit();
  const { isConnected, chainId, address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { walletInfo } = useWalletInfo();

  // Backend
  const { mutateAsync: createDeposit } = useDeposit();

  // UI state
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Tx state
  const [hash, setHash] = useState(undefined);
  const [sentAmountCents, setSentAmountCents] = useState(undefined);

  // Receipt / confirmation watcher
  const {
    data: receipt,
    isSuccess: isConfirmed,
    isError: isTxError,
    isLoading: isWaiting,
  } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
  });

  // show payload modal after confirmation
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [payload, setPayload] = useState(null);
  const didHandleSuccess = useRef(false);

  useEffect(() => {
    if (!hash || !isConfirmed || !receipt || didHandleSuccess.current) return;
    didHandleSuccess.current = true;

    const p = {
      txHash: hash,
      expectedAmount: Number.isFinite(sentAmountCents) ? sentAmountCents : 0,
      token: "USDT",
    };
    setPayload(p);
    setShowPayloadModal(true);
  }, [isConfirmed, receipt, hash, sentAmountCents]);

  const onChangeAmount = (text) => {
    const numericOnly = text.replace(/[^0-9.]/g, "");
    const parts = numericOnly.split(".");
    const normalized =
      parts.length === 1 ? parts[0] : `${parts[0]}.${parts[1].slice(0, 2)}`;
    setAmount(normalized);
  };

  const handleConnectWallet = async () => {
    try {
      await open();
    } catch (e) {
      Alert.alert(
        t("tabs.transactions.DepositScreen.connectionFailedTitle"),
        e?.message ?? t("tabs.transactions.DepositScreen.genericConnectionFailed")
      );
    }
  };

  const handlePay = async () => {
    try {
      const usd = Number((amount || "").trim());
      if (!usd || Number.isNaN(usd) || usd <= 0) {
        Alert.alert(
          t("tabs.transactions.DepositScreen.invalidAmountTitle"),
          t("tabs.transactions.DepositScreen.enterValidUsdAmount")
        );
        return;
      }

      if (!isConnected) {
        await open();
        return;
      }

      if (chainId !== ACTIVE.chainId) {
        await switchChainAsync({ chainId: ACTIVE.chainId });
      }

      setIsLoading(true);

      const units = parseUnits(usd.toFixed(ACTIVE.decimals), ACTIVE.decimals);

      const txHash = await writeContractAsync({
        address: ACTIVE.tokenAddress,
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [ACTIVE.merchant, units],
      });

      setHash(txHash);
      setSentAmountCents(convertToIntegerCents(usd));
    } catch (e) {
      Alert.alert(t("tabs.transactions.DepositScreen.paymentFailedTitle"), e?.message ?? t("tabs.transactions.DepositScreen.paymentFailed"));
      console.log(e?.message ?? String(e));
      setIsLoading(false);
    }
  };

  const handleConfirmPayload = async () => {
    setShowPayloadModal(false);
    if (!payload?.txHash || !Number.isFinite(payload?.expectedAmount)) {
      Alert.alert(t("tabs.transactions.DepositScreen.errorTitle"), t("tabs.transactions.DepositScreen.invalidPayload"));
      setIsLoading(false);
      return;
    }

    try {
      const res = await createDeposit(payload);

      Alert.alert(
        t("tabs.transactions.DepositScreen.depositRecordedTitle"),
        t("tabs.transactions.DepositScreen.depositRecordedBody", {
          block: Number(receipt?.blockNumber),
          tx: payload.txHash,
        }),
        [
          {
            text: t("tabs.transactions.DepositScreen.openInExplorer"),
            onPress: () => Linking.openURL(`https://etherscan.io/tx/${payload.txHash}`),
          },
          {
            text: t("tabs.transactions.DepositScreen.ok"),
            onPress: () => {
              setAmount("");
              setHash(undefined);
              setSentAmountCents(undefined);
              didHandleSuccess.current = false;
              router.back();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t("tabs.transactions.DepositScreen.depositRecordFailed");
      Alert.alert(t("tabs.transactions.DepositScreen.backendErrorTitle"), String(message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Image
            source={require("@/assets/images/depositeImage.png")}
            style={styles.headerImage}
            resizeMode="contain"
            accessibilityLabel="Deposit Image"
          />

          <View style={styles.form}>
            {/* Amount */}
            <View style={styles.rowWrapper}>
              <View style={styles.rowTextWrapper}>
                <Text style={styles.label}>
                  {t("tabs.transactions.DepositScreen.amount")} 
                  ({t("tabs.transactions.DepositScreen.USdollar")})
                </Text>

                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={onChangeAmount}
                  keyboardType="numeric"
                  placeholder="00.00 USD" // e.g., "00.00 USD"
                  placeholderTextColor="#A0A0A0"
                  inputMode="decimal"
                  accessibilityLabel={t("tabs.transactions.DepositScreen.enterDepositUsd")}
                  textAlign={I18nManager?.isRTL ? "right" : "left"}
                />
              </View>
            </View>

            {/* Connected wallet address (optional display) */}
            {isConnected ? (
              <View style={styles.rowWrapper}>
                <View style={styles.rowTextWrapper}>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.label}>
                      {t("tabs.transactions.DepositScreen.wallet")}
                    </Text>
                    <TouchableOpacity onPress={handleConnectWallet}>
                      <Text>
                        {t("tabs.transactions.DepositScreen.viewWallet")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.input, { fontSize: 11 }]} selectable>
                    {address}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Status texts */}
            {hash && !isConfirmed && (
              <Text selectable>
                {t("tabs.transactions.DepositScreen.waitingForConfirmations")} {"\n"} { hash }
              </Text>
            )}

            {isTxError && (
              <Text>
                {t("tabs.transactions.DepositScreen.transactionFailed")}{" "}
                {t("tabs.transactions.DepositScreen.pleaseTryAgain")}
              </Text>
            )}

            {receipt && (
              <Text>
                {t("tabs.transactions.DepositScreen.confirmedInBlock")} {": "}
                { Number(receipt.blockNumber) }
              </Text>
            )}

            {/* Connect / Pay buttons */}
            {!isConnected ? (
              <TouchableOpacity onPress={handleConnectWallet} disabled={isLoading}>
                <LinearGradient
                  colors={["#74BB29", "#92D050", "#74BB29"]}
                  locations={[0.0201, 0.5083, 0.9757]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                >
                  <Text style={styles.buttonText}>
                    {t("tabs.transactions.DepositScreen.connect")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handlePay} disabled={isLoading || isWaiting}>
                <LinearGradient
                  colors={["#74BB29", "#92D050", "#74BB29"]}
                  locations={[0.0201, 0.5083, 0.9757]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.button,
                    (isLoading || isWaiting) && styles.buttonDisabled,
                  ]}
                >
                  <Text style={styles.buttonText}>
                    {t("tabs.transactions.DepositScreen.deposit")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      {(isLoading || isWaiting) && (
        <View style={styles.overlay} accessibilityLabel={t("tabs.transactions.DepositScreen.loadingOverlay")}>
          <ActivityIndicator size="large" color="#74BB29" />
        </View>
      )}

      <PayloadAlert
        visible={showPayloadModal}
        payload={payload}
        onConfirm={handleConfirmPayload}
      />
    </SafeAreaView>
  );
};

export default DepositScreen;

/* === Styles (unchanged except for a11y labels used above) === */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  scroll: { flex: 1, backgroundColor: "#FFF" },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    marginBottom: 60,
    flex: 1,
  },
  headerImage: { width: 300, height: 140 },
  form: { gap: 15, marginTop: 20, width: "100%" },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    width: "100%",
  },
  rowTextWrapper: {
    gap: 8,
    width: "100%",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 15,
    fontWeight: "400",
    color: "#808080",
  },
  input: {
    borderWidth: 1,
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: "500",
    color: "#202226",
    borderColor: "#CBCBCB",
    borderRadius: 12,
  },
  button: {
    paddingVertical: 18,
    marginTop: 12,
    borderRadius: 12,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 6,
    textAlign: "center",
  },
  modalButton: {
    marginTop: 15,
    backgroundColor: "#74BB29",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
