import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  Button,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import SwiftBankIcon from "@/assets/icons/SwiftBankIcon";
import IbanBankIcon from "@/assets/icons/IbanBankIcon";
import LocationBankIcon from "@/assets/icons/LocationBankIcon";
import {
  useAllAccounts,
  useSubmitBank,
  useSubmitWallet,
  useDefaultAccount,
  useSubmitDefaultAccount,
} from "@/query-hooks/withdraw-query-hooks";
import { useTranslation } from "react-i18next";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// 1. Define enum for withdrawal methods
const WithdrawalMethod = {
  CRYPTO: "crypto",
  BANK: "bank",
};

const WithdrawalAccountsScreen = () => {
  const { t } = useTranslation();

  const {
    data: accounts,
    isPending: isPendingAccounts,
    refetch: refetchAccounts,
  } = useAllAccounts();
  const {
    data: defaultAccount,
    isPending: isPendingDefaultAccount,
    refetch: refetchDefaultAccount,
  } = useDefaultAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: mutateAsyncSubmitBank } = useSubmitBank();
  const { mutateAsync: mutateAsyncSubmitWallet } = useSubmitWallet();
  const { mutateAsync: mutateAsyncSubmitDefaultAccount } =
    useSubmitDefaultAccount();

  useEffect(() => {
    console.log(defaultAccount);
    setSelectedMethod(defaultAccount?.method || null);
  }, [defaultAccount]);
  useEffect(() => {
    console.log(accounts);
    setBankData({
      name: accounts?.bank?.bank,
      country: accounts?.bank?.country,
      iban: accounts?.bank?.iban,
      swift: accounts?.bank?.swift_code,
    });
    setCryptoData({
      address: accounts?.crypto?.wallet_address,
    });

    setBankUpdatedData({
      name: accounts?.bank?.bank,
      country: accounts?.bank?.country,
      iban: accounts?.bank?.iban,
      swift: accounts?.bank?.swift_code,
    });
    setCryptoUpdatedData({
      address: accounts?.crypto?.wallet_address,
    });
  }, [accounts]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchAccounts();
      await refetchDefaultAccount();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const bankSheetRef = useRef(null);
  const cryptoSheetRef = useRef(null);

  const [selectedMethod, setSelectedMethod] = useState(null);

  // State for editing fields
  const [bankData, setBankData] = useState({
    name: "",
    country: "",
    iban: "",
    swift: "",
  });

  const [cryptoUpdatedData, setCryptoUpdatedData] = useState({
    address: "",
  });

  const [bankUpdatedData, setBankUpdatedData] = useState({
    name: "",
    country: "",
    iban: "",
    swift: "",
  });

  const [cryptoData, setCryptoData] = useState({
    address: "",
  });

  const handleOnSelectDefaultMethod = (method) => {
    handleSetDefaultAccount(method);
    setSelectedMethod(method);
  };

  const handleEditMethod = (method) => {
    if (method === WithdrawalMethod.BANK) {
      cryptoSheetRef.current?.close();
      bankSheetRef.current?.expand();
    } else if (method === WithdrawalMethod.CRYPTO) {
      bankSheetRef.current?.close();
      cryptoSheetRef.current?.expand();
    }
  };

  const handleSaveBank = async () => {
    if (
      !bankUpdatedData?.country ||
      !bankUpdatedData?.swift ||
      !bankUpdatedData?.iban ||
      !bankUpdatedData?.name
    ) {
      alert("Please Fill All Fields");
      return;
    }
    console.log("Bank data saved:", bankUpdatedData);
    setIsLoading(true);
    const response = await mutateAsyncSubmitBank({
      country: bankUpdatedData?.country,
      bank: bankUpdatedData?.name,
      iban: bankUpdatedData?.iban,
      swift_code: bankUpdatedData?.swift,
    });

    if (response) {
      console.log(response);
      if (response?.id) {
        alert("Bank Account Added!");
      } else alert("Failed Adding Bank Account!");
    } else {
      alert("failed");
    }
    setIsLoading(false);

    setBankData(bankUpdatedData);
    bankSheetRef.current?.close();
  };

  const handleSaveCrypto = async () => {
    if (!cryptoUpdatedData?.address) {
      alert("Please Fill All Fields");
      return;
    }
    console.log("Crypto data saved:", cryptoUpdatedData);
    setIsLoading(true);
    const response = await mutateAsyncSubmitWallet({
      wallet_address: cryptoUpdatedData?.address,
    });

    if (response) {
      console.log(response);
      if (response?.id) {
        alert("Crypto Wallet Added!");
      } else alert("Failed Adding Crypto Wallet!");
    } else {
      alert("failed");
    }
    setIsLoading(false);

    setCryptoData(cryptoUpdatedData);
    cryptoSheetRef.current?.close();
  };

  const handleOnPressCancel = () => {
    cryptoSheetRef.current?.close();
    bankSheetRef.current?.close();
  };

  const handleSetDefaultAccount = async (method) => {
    setIsLoading(true);
    const response = await mutateAsyncSubmitDefaultAccount({
      method: method,
    });

    if (response) {
      if (response?.withdraw_method_preference == method) {
        console.log("success");
      } else alert("Failed Select Default Method!");
    } else {
      alert("failed");
    }
    setIsLoading(false);
  };

  // Calculate appropriate height based on screen size
const screenHeight = Dimensions.get('window').height;
const bankSnapPoint = Math.min(83, 999999); // Ensure it's not too tall
const cryptoSnapPoint = Math.min(55, 9999999);


useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener(
    'keyboardDidShow',
    (event) => {
      // Adjust your BottomSheet when keyboard shows
      const keyboardHeight = event.endCoordinates.height;
      // You might need to adjust your BottomSheet's snapPoints or position
      // For example, you could update a state variable that affects the snapPoints
    }
  );
  
  const keyboardDidHideListener = Keyboard.addListener(
    'keyboardDidHide',
    () => {
      // Reset your BottomSheet when keyboard hides
    }
  );

  return () => {
    keyboardDidShowListener.remove();
    keyboardDidHideListener.remove();
  };
}, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", height: "100%" }}>
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ flex: 1, backgroundColor: "#fff", height: Dimensions.get("window").height }}
        extraScrollHeight={100} 
        enableOnAndroid={true}
      >
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
        <View style={{ flex: 1,padding: 20, gap: 18, height: Dimensions.get("window").height }}>
          {/* === USDT Wallet === */}
          <TouchableOpacity
            onPress={() => handleOnSelectDefaultMethod(WithdrawalMethod.CRYPTO)}
            style={{
              flexDirection: "column",
              marginBottom: 10,
              borderRadius: 10,
              display: "flex",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: "#78BD2E",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  {selectedMethod === WithdrawalMethod.CRYPTO && (
                    <View
                      style={{
                        height: 14,
                        width: 14,
                        borderRadius: 100,
                        backgroundColor: "#78BD2E",
                      }}
                    />
                  )}
                </View>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 15,
                    color: "#202226",
                  }}
                >
                  USDT (Ethereum 2.0)[ERC-20]
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEditMethod(WithdrawalMethod.CRYPTO)}
              >
                <Text
                  style={{
                    color: "#78BD2E",
                    textDecorationLine: "underline",
                    fontSize: 16,
                  }}
                >
                  {t("tabs.menu.WithdrawalAccountsScreen.edit")}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                backgroundColor:
                  selectedMethod === WithdrawalMethod.CRYPTO
                    ? "#F9FFF2"
                    : "#FBFBFB",
                padding: 16,
                borderRadius: 12,
                gap: 12,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#202226",
                    marginBottom: 6,
                    alignSelf:"flex-start"
                  }}
                >
                    {t("tabs.menu.WithdrawalAccountsScreen.walletAddress")}

                </Text>
              </View>
              <View
                style={{
                  fontSize: 13,
                  color: "#202226",
                  borderWidth: 1,
                  borderColor: "#EDEDED",
                  backgroundColor: "#FBFBFB",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  gap: 12,
                  flexDirection: "row",
                }}
              >
                <Image source={require("@/assets/images/trc-icon.png")} />
                <Text>{cryptoData.address || "0x"}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* === Bank Account === */}
          {/* <TouchableOpacity
            onPress={() => handleOnSelectDefaultMethod(WithdrawalMethod.BANK)}
            style={{
              flexDirection: "column",
              marginBottom: 10,
              borderRadius: 10,
              display: "flex",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: "#78BD2E",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  {selectedMethod === WithdrawalMethod.BANK && (
                    <View
                      style={{
                        height: 14,
                        width: 14,
                        borderRadius: 100,
                        backgroundColor: "#78BD2E",
                      }}
                    />
                  )}
                </View>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 15,
                    color: "#202226",
                  }}
                >
                  {t("tabs.menu.WithdrawalAccountsScreen.bankAccount")}

                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEditMethod(WithdrawalMethod.BANK)}
              >
                <Text
                  style={{
                    color: "#78BD2E",
                    textDecorationLine: "underline",
                    fontSize: 16,
                  }}
                >
                   {t("tabs.menu.WithdrawalAccountsScreen.edit")}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                backgroundColor:
                  selectedMethod === WithdrawalMethod.BANK
                    ? "#F9FFF2"
                    : "#FBFBFB",
                padding: 16,
                borderRadius: 12,
                gap: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#202226",
                  marginBottom: 10,
                }}
              >
                {bankData?.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <LocationBankIcon />
                  <Text style={{ color: "#939393", fontSize: 14 }}>
                  {t("tabs.menu.WithdrawalAccountsScreen.location")}
                  </Text>
                </View>
                <Text
                  style={{ color: "#202226", fontSize: 14, fontWeight: 500 }}
                >
                  {bankData?.country}
                </Text>
              </View>
              <Hr />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <IbanBankIcon />
                  <Text style={{ color: "#939393", fontSize: 14 }}>{t("tabs.menu.WithdrawalAccountsScreen.iban")}</Text>
                </View>
                <Text>{bankData?.iban}</Text>
              </View>
              <Hr />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <SwiftBankIcon />
                  <Text style={{ color: "#939393", fontSize: 14 }}>
                  {t("tabs.menu.WithdrawalAccountsScreen.swift")}
                  </Text>
                </View>
                <Text>{bankData?.swift}</Text>
              </View>
            </View>
          </TouchableOpacity> */}


          {/* === Bank Account Bottom Sheet === */}
          {/* <BottomSheet
            ref={bankSheetRef}
            index={-1}
            snapPoints={useMemo(() => [`${bankSnapPoint}%`], [bankSnapPoint])}
            enablePanDownToClose
            backdropComponent={props => (
              <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
              />
            )}
          >
            <BottomSheetView style={styles.sheetContainer}>
              <View
                style={{
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={handleOnPressCancel}
                  style={{ position: "absolute", right: 0 }}
                >
                  <Text
                    style={{
                      color: "#202226",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <Text style={styles.titel}>Edit Bank Account</Text>
              </View>
              <Hr></Hr>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput
                style={styles.input}
                value={bankUpdatedData.name}
                onChangeText={(text) =>
                  setBankUpdatedData((prev) => ({ ...prev, name: text }))
                }
              />

              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                value={bankUpdatedData.country}
                onChangeText={(text) =>
                  setBankUpdatedData((prev) => ({ ...prev, country: text }))
                }
              />
              <Text style={styles.label}>IBAN</Text>
              <TextInput
                style={styles.input}
                value={bankUpdatedData.iban}
                onChangeText={(text) =>
                  setBankUpdatedData((prev) => ({ ...prev, iban: text }))
                }
              />
              <Text style={styles.label}>SWIFT Code</Text>
              <TextInput
                style={styles.input}
                value={bankUpdatedData.swift}
                onChangeText={(text) =>
                  setBankUpdatedData((prev) => ({ ...prev, swift: text }))
                }
              />
              <TouchableOpacity title="OK" onPress={handleSaveBank}>
                <LinearGradient
                  colors={["#74BB29", "#92D050", "#74BB29"]}
                  locations={[0.0201, 0.5083, 0.9757]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>SAVE</Text>
                </LinearGradient>
              </TouchableOpacity>
            </BottomSheetView>
          </BottomSheet> */}

          {/* === Crypto Wallet Bottom Sheet === */}
          <BottomSheet
            ref={cryptoSheetRef}
            index={-1}
            snapPoints={useMemo(() => [`${cryptoSnapPoint}%`], [cryptoSnapPoint])}
            enablePanDownToClose
            backdropComponent={props => (
              <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
              />
            )}
          >
            <BottomSheetView style={styles.sheetContainer}>
              <View
                style={{
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={handleOnPressCancel}
                  style={{ position: "absolute", right: 0 }}
                >
                  <Text
                    style={{
                      color: "#202226",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <Text style={styles.titel}>Edit Wallet Address</Text>
              </View>
              <Hr></Hr>
              <Text style={styles.label}>Wallet Address</Text>
              <View
                style={[
                  styles.input,
                  { alignItems: "center", flexDirection: "row", gap: 12 },
                ]}
              >
                <Image source={require("@/assets/images/trc-icon.png")} />
                <TextInput
                  style={{ width: "100%" }}
                  value={cryptoUpdatedData.address}
                  onChangeText={(text) =>
                    setCryptoUpdatedData((prev) => ({
                      ...prev,
                      address: text,
                    }))
                  }
                />
              </View>
              <TouchableOpacity title="OK" onPress={handleSaveCrypto}>
                <LinearGradient
                  colors={["#74BB29", "#92D050", "#74BB29"]}
                  locations={[0.0201, 0.5083, 0.9757]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>SAVE</Text>
                </LinearGradient>
              </TouchableOpacity>
            </BottomSheetView>
          </BottomSheet>
        </View>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAwareScrollView>
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
    </SafeAreaView>
  );
};

export default WithdrawalAccountsScreen;

const styles = StyleSheet.create({
  container: {},
  sheetContainer: {
    display:"flex",
    padding: 20,
    marginBottom: 220,
    gap: 15,
  },
  titel: {
    fontSize: 18,
    fontWeight: 600,
    color: "#242B42",
  },
  label: {
    fontSize: 14,
    fontWeight: 700,
    color: "#242B42",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6E9ED",
    // backgroundColor:"#E6E9ED",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    height: 48,
  },
  button: {
    paddingVertical: 18,
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
    marginVertical: 8,
    width: "100%", // or set a fixed width
  },
});

const Hr = () => {
  return <View style={styles.hr}></View>;
};
