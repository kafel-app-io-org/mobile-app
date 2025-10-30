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
  I18nManager,
} from "react-native";
import { API_BASE_URL } from "../../../api/send-api-request";

import { Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { router, Stack, useLocalSearchParams } from "expo-router";
import Svg, { Rect, Path } from "react-native-svg";
import { BlurView } from "expo-blur";
import { Modal } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { useDonateCampaign } from "@/query-hooks/campaigns-query-hooks";
import { convertToIntegerCents, handleSensitiveAction } from "@/utils/helper";
import { SendIcon } from "@/assets/icons/SendIcon";
import { useTranslation } from "react-i18next";

const DonateCampaignScreen = () => {
  const { t } = useTranslation();

  const { campaign } = useLocalSearchParams();
  const campaignData = campaign ? JSON.parse(campaign) : null;
  useEffect(() => {
    console.log(campaignData?.id);
  }, [campaign]);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: mutateAsyncDonateCampaign } = useDonateCampaign();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [comments, setComments] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const handleOnPressSend = () => {
    // setModalVisible(true);
    if (!campaignData?.id) {
      alert(t("tabs.campaigns.DonateCampaignScreen.failed"));
      alert(t("tabs.campaigns.DonateCampaignScreen.failed"));
      router.back();
      return;
    }
    if (!amount) {
      alert(t("tabs.campaigns.DonateCampaignScreen.allFields"));
    } else {
      setModalVisible(true);
    }
  };
  const handleOnPressConfirm = async () => {
    await handleDonation();
    setModalVisible(false);
  };

  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDonation = async () => {
    setIsLoading(true);
    const response = await mutateAsyncDonateCampaign({
      campaign_id: campaignData?.id,
      amount: convertToIntegerCents(parseFloat(amount)),
    });
    if (response) {
      if (response?.status == "success") {
        Alert.alert(t("tabs.campaigns.DonateCampaignScreen.donationSuccess"), t("tabs.campaigns.DonateCampaignScreen.thanks"), [
          {
            text: t("tabs.campaigns.DonateCampaignScreen.ok"),
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else alert("Donation Failed");
    } else {
      alert("failed");
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
          <Image
            source={require("@/assets/images/donateImage.png")}
            style={styles.headerImage}
          />
          <View style={{ gap: 15, marginTop: 20 }}>
            <View style={styles.rowWrapper}>
              <View style={styles.rowTextWrapper}>
                <Text style={styles.label}>
                  {t("tabs.campaigns.DonateCampaignScreen.campaign")}
                </Text>

                <View style={[styles.input, { gap:12, flexDirection:"row" }]}>
                  <Image
                    style={styles.image}
                    source={{ uri: `${API_BASE_URL}${campaignData?.image}` }}
                  />
                  <TextInput editable={false}>{campaignData?.title}</TextInput>
                </View>
              </View>
            </View>
            <View style={styles.rowWrapper}>
              <View style={styles.rowTextWrapper}>
                <Text style={styles.label}>
                  {t("tabs.campaigns.DonateCampaignScreen.amount")}
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
                  type="numeric"
                  placeholder="00.00 USD"
                />
              </View>
            </View>
            <View style={styles.rowWrapper}>
              <View style={styles.rowTextWrapper}>
                <Text style={styles.label}>
                  {t("tabs.campaigns.DonateCampaignScreen.comments")}
                </Text>
                <TextInput
                  style={[styles.input, { height: 120 }]}
                  placeholder={t(
                    "tabs.campaigns.DonateCampaignScreen.commentsPlaceholder"
                  )}
                  value={comments}
                  onChangeText={setComments}
                  multiline
                  numberOfLines={4}
                  maxLength={120}
                  textAlignVertical="top"
                />
                <Text style={styles.counter}>{120 - comments.length} / 120</Text>
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
                  {t("tabs.campaigns.DonateCampaignScreen.donate")}
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
                  {t("tabs.campaigns.DonateCampaignScreen.sure")}
                </Text>
                <Text style={styles.modalValue}>${amount}</Text>
                <View style={styles.hr} />
                <View style={styles.modalRecipientBlock}>
                   <Image
                    style={styles.modalRecipientImage}
                    source={{ uri: `${API_BASE_URL}${campaignData?.image}` }}
                  />
                  <View style={styles.modalRecipientInfo}>
                    <Text style={styles.modalRecipientname}>
                      {campaignData?.title}
                    </Text>
                    <Text
                      style={styles.modalRecipientphone}
                    >{`${campaignData?.city}, ${campaignData?.country}`}</Text>
                  </View>
                </View>
                <View style={styles.hr} />

                {/* <View style={styles.ModalDataRow}>
                  <Text style={styles.ModalReciptLabel}>
                    {t("tabs.campaigns.DonateCampaignScreen.date")}
                  </Text>
                  <Text style={styles.ModalReciptValue}>{date}</Text>
                </View>
                <View style={styles.ModalDataRow}>
                  <Text style={styles.ModalReciptLabel}>
                    {t("tabs.campaigns.DonateCampaignScreen.time")}
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
                      {t("tabs.campaigns.DonateCampaignScreen.confirm")}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                {/* 
                <View
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
                    Your payment is still being processed, don’t worry the money
                    will be sent to the merchant soon.
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

export default DonateCampaignScreen;

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
  image: {
    width: 40,
    height: 40,
    backgroundColor: "#F6F6F6",
    objectFit: "cover",
    borderRadius: 20,
    // position: "absolute",
    // right: 0,
    // top: 0,
  },
  headerImage: {
    width: 200,
    height: 130,
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
    paddingVertical: 8,
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
    position: "absolute",
    bottom: 15,
    ...(I18nManager?.isRTL ? { right: 15 } : { left: 15 }),
  },
});
