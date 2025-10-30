import React, { useEffect } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Easing,
  Image,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
} from "react-native";
import { Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { I18nManager } from "react-native";

import { router, Stack, useLocalSearchParams } from "expo-router";
import Svg, { Rect, Path } from "react-native-svg";
import { BlurView } from "expo-blur";
import { Modal } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { useTransferTransaction } from "@/query-hooks/transactions-query-hooks";
import { useAllFees } from "@/query-hooks/general-query-hooks";
import { convertToIntegerCents, handleSensitiveAction, formatCurrency } from "@/utils/helper";
import { SendIcon } from "@/assets/icons/SendIcon";

const SendTransactionScreen = () => {
  // alert("RSR-1 Start send..!");
  const { t } = useTranslation();

  const { recipient } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const recipientData = recipient ? JSON.parse(recipient) : null;

  const { data: fees, isPending: isPendingFees } = useAllFees();
  const [transferFee, setTransferFee] = useState(0);
  useEffect(() => {
    console.log("fees", fees);
    setTransferFee(
      fees?.find((fee) => fee.type === "transfer_fee_percentage")?.amount
    );
  }, [fees]);
  // alert("RSR-2 setTransferFee..!");
  const { mutateAsync: mutateAsyncTransfer } = useTransferTransaction();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    setPhoneNumber(recipientData?.phone);
  }, [recipient]);
  // alert("RSR-3 setPhoneNumber!");
  const [modalVisible, setModalVisible] = useState(false);
  const handleOnPressSend = () => {
    // setModalVisible(true);
    // alert("RSR-4 handleOnPressSend!");
    if (!phoneNumber || !amount) {
      alert(t("tabs.transactions.SendTransactionScreen.allFields"));
    } else {
      setModalVisible(true);
    }
  };
  const handleOnPressConfirm = async () => {
    // alert("RSR-5 handleOnPressConfirm!");
    await handleTransfer();
    setModalVisible(false);
  };
  // alert("RSR-6 finish handleOnPressConfirm!");
  const now = new Date();
  const time = now.toLocaleTimeString(); // e.g., "08:45:32 PM"
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleTransfer = async () => {
    // alert("RSR-7 handleTransfer!");
    setIsLoading(true);
    const response = await mutateAsyncTransfer({ 
      receiver_phone_number: phoneNumber,
      amount: convertToIntegerCents(parseFloat(amount)),
      comment: comments,
    });
    // alert("RSR-8 check response..!");
    // if (response && response.ok) {
    if (response) {
      console.log(response);
      if (response?.status == "posted") { 
        Alert.alert(t("tabs.transactions.SendTransactionScreen.notification"), 
                    t("tabs.transactions.SendTransactionScreen.success"), [
          {
            text: t("tabs.transactions.SendTransactionScreen.cancel"),
            style: "cancel",
          },
          {
            text: t("tabs.transactions.SendTransactionScreen.ok"),
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else if (response == 404) {
        alert(t("tabs.transactions.SendTransactionScreen.notRegistered"));
      } else alert(t("tabs.transactions.SendTransactionScreen.failed"));
    } else {
      alert(t("tabs.transactions.SendTransactionScreen.failed"));
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", height: "100%" }}>
      <KeyboardAwareScrollView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          // height: Dimensions.get("window").height,
        }}

        // extraScrollHeight={100}
        // enableOnAndroid={true}
      >
        <View style={styles.container}>
          {/* <Text>{recipientData?.name}</Text> */}
          {/* <Text>{recipientData?.phone}</Text> */}

          <Image
            source={require("@/assets/images/sendImage.png")}
            style={styles.headerImage}
          />
          <View style={{ gap: 15, marginTop: 20 }}>
            <View style={styles.rowWrapper}>
              <View style={styles.rowTextWrapper}>
                <Text style={styles.label}>
                  {t("tabs.transactions.SendTransactionScreen.phone")}
                </Text>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={(text) => {
                    const numericOnly = text.replace(/[^+0-9.]/g, ""); // allows numbers and dot
                    setPhoneNumber(numericOnly);
                  }}
                  placeholder="+1 123 123456"
                />
              </View>
            </View>
            <View style={styles.rowWrapper}>
              <View style={styles.rowTextWrapper}>
                <Text style={styles.label}>
                  {t("tabs.transactions.SendTransactionScreen.amount")}
                  ({t("tabs.campaigns.DonateCampaignScreen.USdollar")})
                </Text>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={(text) => {
                    const numericOnly = text.replace(/[^0-9.]/g, ""); // allows numbers and dot
                    const twoDecimalAmount = numericOnly
                      .split(".")
                      .map((part, index) =>
                        index === 1 ? part.slice(0, 2) : part
                      ) // Keep only two digits after the dot
                      .join(".");

                    setAmount(twoDecimalAmount);
                  }}
                  keyboardType="numeric"
                  placeholder="00.00 USD"
                />
              </View>
            </View>
            <View style={styles.rowWrapper}>
              <View style={styles.rowTextWrapper}>
                <Text style={styles.label}>
                  {t("tabs.transactions.SendTransactionScreen.comments")}
                </Text>
                <TextInput
                  style={[styles.input, { height: 120 }]}
                  placeholder={t(
                    "tabs.transactions.SendTransactionScreen.commentsPlacheholder"
                  )}
                  value={comments}
                  onChangeText={setComments}
                  multiline
                  numberOfLines={4}
                  maxLength={120}
                  textAlignVertical="top"
                />
                <Text style={styles.counter}>
                  {120 - comments.length} / 120
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleOnPressSend}>
              <LinearGradient
                colors={["#74BB29", "#92D050", "#74BB29"]}
                locations={[0.0201, 0.5083, 0.9757]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {t("tabs.transactions.SendTransactionScreen.send")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Modal
            transparent
            visible={modalVisible}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            {isLoading && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 999,
                }}
              >
                <ActivityIndicator size="large" color="#74BB29" />
              </View>
            )}

            <Pressable
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
              onPress={() => setModalVisible(false)}
            >
              <Pressable
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 24,
                  width: "80%",
                  alignItems: "center",
                  position: "relative",
                }}
                onPress={() => {}}
              >
                <BlurView
                  intensity={50}
                  tint="light"
                  style={styles.iconWrapper}
                >
                  <SendIcon width={100} height={100} />
                </BlurView>
                <View style={styles.icon}>
                  <SendIcon width={100} height={100} />
                </View>

                <Text style={styles.modalHeader}>
                  {t("tabs.transactions.SendTransactionScreen.sure")}
                </Text>
                <Text style={styles.modalValue}>${amount}</Text>
                <View style={styles.hr} />
                <View style={styles.modalRecipientBlock}>
                  <Image style={styles.modalRecipientImage} />
                  <View style={styles.modalRecipientInfo}>
                    <Text style={styles.modalRecipientname}>{phoneNumber}</Text>
                    <Text style={styles.modalRecipientphone}>
                      {phoneNumber}
                    </Text>
                  </View>
                </View>
                <View style={styles.hr} />

                <View style={styles.ModalDataRow}>
                  <Text style={styles.ModalReciptLabel}>
                    {t("tabs.transactions.SendTransactionScreen.fees")}
                  </Text>
                  // fees in cents e.g 700 /100 becomes 7 usd /100 for percentage
                  <Text style={styles.ModalReciptValue}>{`${formatCurrency(
                    (amount * transferFee) / 10000
                  )}$`}</Text>
                </View>
                <View style={styles.ModalDataRow}>
                  <Text style={styles.ModalReciptLabel}>
                    {t("tabs.transactions.SendTransactionScreen.net")}
                  </Text>
                  // fees in cents e.g 700 /100 becomes 7 usd /100 for percentage
                  <Text style={styles.ModalReciptValue}>{`${formatCurrency(
                    amount - (amount * transferFee) / 10000
                  )}$`}</Text>
                </View>

                {/* <View style={styles.ModalDataRow}>
                  <Text style={styles.ModalReciptLabel}>
                    {t("tabs.transactions.SendTransactionScreen.date")}
                  </Text>
                  <Text style={styles.ModalReciptValue}>{date}</Text>
                </View>
                <View style={styles.ModalDataRow}>
                  <Text style={styles.ModalReciptLabel}>
                    {t("tabs.transactions.SendTransactionScreen.time")}
                  </Text>
                  <Text style={styles.ModalReciptValue}>{time}</Text>
                </View> */}

                {/* <View style={styles.hr} /> */}

                <TouchableOpacity
                  style={{ width: "100%" }}
                  onPress={() => handleSensitiveAction(handleOnPressConfirm)}
                >
                  <LinearGradient
                    colors={["#74BB29", "#92D050", "#74BB29"]}
                    locations={[0.0201, 0.5083, 0.9757]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      {t("tabs.transactions.SendTransactionScreen.confirm")}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* <View
                  style={{
                    gap: 10,
                    alignSelf: "center",
                    alignItems: "center",
                    marginVertical: 15,
                  }}
                >
                  <Svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M13.365 3.00017L22.8912 19.5002C23.1674 19.9785 23.0035 20.5901 22.5252 20.8662C22.3732 20.954 22.2008 21.0002 22.0252 21.0002H2.97266C2.42037 21.0002 1.97266 20.5525 1.97266 20.0002C1.97266 19.8246 2.01886 19.6522 2.10663 19.5002L11.6329 3.00017C11.9091 2.52187 12.5206 2.358 12.9989 2.63414C13.151 2.72191 13.2772 2.84815 13.365 3.00017ZM11.4989 16.0002V18.0002H13.4989V16.0002H11.4989ZM11.4989 9.00017V14.0002H13.4989V9.00017H11.4989Z"
                      fill="#C59853"
                    />
                  </Svg>
                  <Text style={styles.warning}>
                    {t("tabs.transactions.SendTransactionScreen.note")}
                  </Text>
                </View> */}
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SendTransactionScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
    // paddingBottom: 40,
    marginBottom: 60,
  },
  headerImage: {
    width: 300,
    height: 140,
    objectFit: "contain",
  },
  userName: {
    fontSize: 27,
    fontWeight: 700,
    color: "#202226",
    marginTop: 20,
  },
  dateJoined: {
    fontSize: 16,
    fontWeight: 400,
    color: "#808080",
    marginTop: 10,
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    width: "100%",
  },
  rowTextWrapper: {
    gap: 8,
    // maxWidth: "80%",
    width: "100%",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 15,
    fontWeight: "400",
    color: "#808080",
  },
  input: {
    border: 1,
    borderWidth: 1,
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: "500",
    color: "#202226",
    borderColor: "#CBCBCB",
    borderRadius: 12,
    textAlign: I18nManager?.isRTL ? "right" : "left",
  },
  button: {
    paddingVertical: 18,
    marginTop: 12,
    borderRadius: 12,
    textTransform: "capitalize",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  hr: {
    borderBottomColor: "#EAECF0",
    borderBottomWidth: 1,
    marginVertical: 16,
    width: "100%", // or set a fixed width
  },
  modalHeader: {
    fontSize: 16,
    fontWeight: 500,
    color: "#27364E",
    marginBottom: 10,
    marginTop: 50,
  },
  modalValue: {
    fontSize: 32,
    fontWeight: 700,
    color: "#27364E",
    marginBottom: 10,
  },
  modalRecipientBlock: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  modalRecipientImage: {
    width: 40,
    height: 40,
    backgroundColor: "#D9D9D9",
    borderRadius: 100,
  },
  modalRecipientInfo: {
    gap: 5,
    // textAlign: I18nManager?.isRTL ? "right" : "left",
  },
  modalRecipientname: {
    fontSize: 17,
    fontWeight: 600,
    color: "##838FA0",
  },
  modalRecipientphone: {
    fontSize: 16,
    fontWeight: 400,
    color: "#838383",
  },
  ModalDataRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  ModalReciptLabel: { fontSize: 16, fontWeight: 400, color: "#838FA0" },
  ModalReciptValue: { fontSize: 16, fontWeight: 400, color: "#838FA0" },
  warning: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: 400,
    color: "#C59853",
  },
  iconWrapper: {
    position: "absolute",
    top: -70,
    // right: "50%",
    transform: [{ translateX: 50 }],
    backgroundColor: "#89CB42",
    borderRadius: 100,
    overflow: "hidden",
    padding: 15,
    opacity: 0.5,
    ...(I18nManager?.isRTL ? { left: "50%" } : { right: "50%" }),
  },
  icon: {
    position: "absolute",
    top: -55,
    // right: "50%",
    ...(I18nManager?.isRTL ? { left: "50%" } : { right: "50%" }),

    transform: [{ translateX: "35%" }],
    borderRadius: 100,
  },
  counter: {
    marginTop: 8,
    textAlign: "right",
    color: "#bbb",
    fontSize: 12,
    position:"absolute",
    bottom:15,
    ...(I18nManager?.isRTL ? { right: 15 } : { left: 15 }),

  },
});
