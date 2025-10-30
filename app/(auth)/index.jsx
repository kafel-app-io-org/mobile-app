// import { Image, StyleSheet, Platform } from 'react-native';
// import { Redirect } from 'expo-router';
// import { useAuth } from "@/contexts/AuthContext";
// import { useRouter } from "expo-router";
// import { useEffect } from "react";
// export default function AuthIndexScreen() {
//   const { user } = useAuth();

//   if (user) {
//     return <Redirect href="/(tabs)" />;
//   }

//   return <Redirect href="/(auth)/LoginScreen" />;}
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFirebaseAuth } from "@/query-hooks/general-query-hooks";
import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState, useRef, useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; 

import {
  Button,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  Platform,
  I18nManager,
} from "react-native";
import { useTranslation } from "react-i18next";

import { setAuthenticationHeaders } from "../../api/send-api-request";
import { useUserProfile } from "@/query-hooks/general-query-hooks";

// import auth from "@react-native-firebase/auth";
// import { getApp } from "@react-native-firebase/app";
import { auth } from "../../firebaseConfig"; 

import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import PhoneInput, {
  isValidPhoneNumber,
} from "react-native-international-phone-number";
import { OtpInput } from "react-native-otp-entry";
// import logo from "../../../assets/images/kafel-black.png";

export default function AuthIndexScreen() {
  const { mutateAsync: mutateAsyncFirebaseAuth } = useFirebaseAuth();
  const { t } = useTranslation();
  const logAsyncStorage = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    console.log("AsyncStorage contents:", items);
  };
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);
  // const [code, setCode] = useState("");
  const { user, setUser } = useAuth();

  // TODO: REMOVE TESTING NUMBER
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);

  // function   onAuthStateChanged (user)  {

  // }
  const onAuthStateChanged = async (user) => {
    // const { data: userProfile, isPending: isPendingUserProfile, refetch: refetchUserProfile } = await useUserProfile();
    // console.log('userProfile $$$$', userProfile)
    // setUser(user);
    console.log("reeeeee@");
    if (initializing) setInitializing(false);
  };

  // [
  //   "user",
  //   '{"id":4,"created_at":"2025-04-27T11:29:05.000Z","updated_at":"2025-05-14T15:12:34.000Z","created_by":null,"updated_by":6,"deleted_by":null,"deleted_at":null,"name":"عمر خالد محمد عليان","password":null,"phone_number":"+970599999999","passcode":"$2b$08$.deafGFbO.8wbbV0MQvplONOyHaoj6KcrvZe1uzCXA0KnS29xjfUS","status":"active","country":"Palestine","city":"Gaza","email":"moh.sal@gmail.com","notes":"فادي إبراهيم محمود موسى","address":"غزة","image":"/public/images/1747162197595-IMG_0015.PNG","role":"user","withdraw_method_preference":"bank"}', 
  // ];
  // Handle the button press
  async function sendCode() {
    //TODO UNCOMMINT THIS BLOCK
    if (!isValidPhoneNumber(phoneNumber, selectedCountry)) {
      console.log(phoneNumber);
      console.log(selectedCountry);
      return alert("Invalid Phone Number");
    }
    setIsLoading(true);
    try {
      const number = getFullPhoneNumber(phoneNumber, selectedCountry);
      console.log("waiting confirmation", number);
      const confirmation = await signInWithPhoneNumber(auth, number);
      console.log("confirmation recived");
      console.log(confirmation);
      setConfirm(confirmation);
    } catch (err) {
      console.error("Phone auth error", err);
      alert(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogin = async (code) => {
    setIsLoading(true);

    const userCredential = await confirmCode(code);
    const user = await userCredential.user;
    const idToken = await user.getIdToken();
    console.log("firebase id token", idToken);

    const token = await handleGetAuthData(idToken);
    console.log("token", token?.access_token);
    console.log("user profile", JSON.stringify(token?.user));

    await AsyncStorage.setItem("token", token?.access_token);
    await AsyncStorage.setItem("user", JSON.stringify(token?.user));

    setUser(token?.user);

    setAuthenticationHeaders({
      Authorization: token ? `Bearer ${token}` : "",
    });

    setIsLoading(false);
    logAsyncStorage();
  };
  async function confirmCode(code) {
    try {
      const userCredential = await confirm.confirm(code);
      const isNewUser = userCredential.additionalUserInfo?.isNewUser;
      if (isNewUser) {
        console.log("New user registered!");
      } else {
        console.log("Existing user logged in!");
      }
      return userCredential;
    } catch (error) {
      alert("Invalid Code!", error);
      setIsLoading(false);
      console.log(error);
    }
  }

  const handleGetAuthData = async (firebaseIdToken) => {
    const response = await mutateAsyncFirebaseAuth({
      idToken: firebaseIdToken,
    });
    console.log("handleGetAuthData : ", response);

    if (response && response?.token) {
      return response?.token;
    } else {
      alert("Failed Reciving Token from Server");
    }
  };

  const getFullPhoneNumber = (phoneNumber, selectedCountry) => {
    const callingCode = selectedCountry.callingCode; // e.g. "1" for US
    const cleanedInput = phoneNumber.replace(/\s+/g, "").replace(/^0+/, "");
    return `${callingCode}${cleanedInput}`;
  };

  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up on unmount
  }, [secondsLeft]);

  // if (initializing) {
  //   console.log('sds')
  //   return null};
  if (!user) {
    if (!confirm) {
      return (
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#fff", height: "100%" }}
        >
          {/* <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          > */}
          <KeyboardAwareScrollView
            style={{
              flex: 1,
              backgroundColor: "#fff",
              // paddingHorizontal: 30,
              // paddingStart: 30,
              // paddingEnd: 30,

              // height: Dimensions.get("window").height,
            }}

            // extraScrollHeight={100}
            // enableOnAndroid={true}
          >
            <View
              style={{
                paddingHorizontal: 30,
                paddingVertical: "15%",
              }}
            >
              <View style={styles.logoWarapper}>
              {/* <Image source={logo} style={styles.logo} /> */}
              <Image source={require("../../assets/images/kafel-black.png")} style={styles.logo} />
                {/* <Image
                  source={require("@/assets/images/kafel-black.png")}
                  style={styles.logo}
                /> */}
              </View>
              <Text style={styles.title}>{t("auth.signIn")}</Text>
              <Text style={styles.para}>{t("auth.welcome")}</Text>

              <View>
                <PhoneInput
                  rtl={I18nManager.isRTL}
                  value={phoneNumber}
                  onChangePhoneNumber={setPhoneNumber}
                  selectedCountry={selectedCountry}
                  onChangeSelectedCountry={setSelectedCountry}
                  placeholder=""
                  defaultCountry="US"
                  popularCountriess={["PS", "US", "IL"]}
                  phoneInputStyles={{
                    container: {
                      backgroundColor: "#fff",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: "#CBCBCB",
                      height: 60,
                    },
                    flagContainer: {
                      borderTopLeftRadius: 7,
                      borderBottomLeftRadius: 7,
                      backgroundColor: "#fff",
                      justifyContent: "center",
                    },
                    flag: {},
                    caret: {
                      color: "#CBCBCB",
                      fontSize: 16,
                    },
                    divider: {
                      backgroundColor: "#CBCBCB",
                    },
                    callingCode: {
                      fontSize: 16,
                      margin: 0,
                      paddingHorizontal: 0,
                      color: "#202226",
                    },
                    countryName: {
                      margin: 0,
                      paddingHorizontal: 0,
                    },
                    input: {
                      color: "#202226",
                    },
                  }}
                  modalStyles={{
                    modal: {
                      backgroundColor: "#fff",
                      borderWidth: 1,
                    },
                    backdrop: {
                    },
                    divider: {
                      backgroundColor: "transparent",
                    },
                    countriesList: {},
                    searchInput: {
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#CBCBCB",
                      color: "#202226",
                      backgroundColor: "#fff",
                      paddingHorizontal: 12,
                      height: 46,
                    },
                    countryButton: {
                      borderWidth: 1,
                      borderColor: "#CBCBCB",
                      color: "#202226",
                      backgroundColor: "#fff",
                      marginVertical: 4,
                      paddingVertical: 0,
                    },
                    noCountryText: {},
                    noCountryContainer: {},
                    flag: {
                      color: "#FFFFFF",
                      fontSize: 20,
                    },
                    callingCode: {
                      color: "#202226",
                    },
                    countryName: {
                      color: "#202226",
                    },
                    sectionTitle: {
                      marginVertical: 10,
                      color: "#202226",
                    },
                  }}
                />
              </View>

              <TouchableOpacity
                id="sign-in-button"
                style={styles.button}
                onPress={() => sendCode()}
              >
                <LinearGradient
                  colors={["#74BB29", "#92D050", "#74BB29"]}
                  locations={[0.0201, 0.5083, 0.9757]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}> {t("auth.sendCode")}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={{ marginTop: "10%" }}>
                <Text style={styles.codeText}>
                  {" "}
                  {t("auth.didntReciveCode")}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.resendButton}> {t("auth.resend")}</Text>
                </TouchableOpacity>
              </View>
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
    } else {
      return (
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#fff", height: "100%" }}
        >
          <KeyboardAwareScrollView
            style={{
              flex: 1,
              backgroundColor: "#fff",
              paddingHorizontal: 30,
              paddingVertical: "15%",

              // height: Dimensions.get("window").height,
            }}

            // extraScrollHeight={100}
            // enableOnAndroid={true}
          >
            <View style={{ paddingBottom: 60 }}>
              <View style={styles.logoWarapper}>
              {/* <Image source={logo} style={styles.logo} /> */}
              <Image source={require("../../assets/images/kafel-black.png")} style={styles.logo} />
                {/* <Image
                  source={require("@/assets/images/kafel-black.png")}
                  style={styles.logo}
                /> */}
              </View>
              <Text style={styles.title}> {t("auth.verifyOTP")}</Text>
              <Text style={styles.paraOtp}>{t("auth.otpDesc")}</Text>
              <OtpInput
                blurOnFilled={true}
                // hideStick={true}
                rtl={I18nManager.isRTL}
                numberOfDigits={6}
                type="numeric"
                onFilled={(text) => {
                  //   setCode(text);
                  console.log(`OTP is ${text}`);
                  handleLogin(text);
                }}
                textInputProps={{
                  accessibilityLabel: "One-Time Password",
                }}
                textProps={{
                  accessibilityRole: "text",
                  accessibilityLabel: "OTP digit",
                  allowFontScaling: false,
                }}
                theme={{
                  containerStyle: styles.otpContainer,
                  pinCodeContainerStyle: styles.otpPinCodeContainer,
                  focusedPinCodeContainerStyle:
                    styles.otpActivePinCodeContainer,
                  pinCodeTextStyle: styles.otpPinCodeText,

                  // focusStickStyle: styles.focusStick,
                  // focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                  // placeholderTextStyle: styles.placeholderText,
                  // filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                  // disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
                }}
                // onTextChange={(text)=>setCode(text)}
                autoFocus
              />

              <View>
                <Text style={styles.codeText}>{t("auth.codeSent")}</Text>
                <TouchableOpacity>
                  {/* <Text style={styles.resendButton}>Resend in </Text> */}

                  {secondsLeft > 0 ? (
                    <TouchableOpacity
                      disabled={secondsLeft > 0}
                      onPress={() => sendCode()}
                    >
                      <Text style={styles.resendButton}>
                        {t("auth.resendIn")}
                        {secondsLeft}s
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setSecondsLeft(60); // Reset timer on resend
                        // Trigger resend logic here
                      }}
                    >
                      <Text style={[styles.resendButton, { color: "#74BB29" }]}>
                        {t("auth.resendCode")}
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLogin()}
              >
                {/* <Text style={styles.buttonText}>Send Verification Code</Text> */}
                <LinearGradient
                  colors={["#74BB29", "#92D050", "#74BB29"]}
                  locations={[0.0201, 0.5083, 0.9757]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>{t("auth.continue")}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
          {/* <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          > */}

          {/* </TouchableWithoutFeedback> */}
          {isLoading && (
            <View
              style={{
                // position: "absolute",
                // top: 0,
                // // bottom: 0,
                // left: 0,
                // // right: 0,
                // backgroundColor: "rgba(0, 0, 0, 0.2)",
                // justifyContent: "center",
                // alignItems: "center",
                // zIndex: 999,

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
    }
  } else if (user && !isLoading) {
    return <Redirect href="/(tabs)" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    // paddingTop: 120,
  },
  logoWarapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    width: 140,
    height: 60,
    objectFit: "contain",
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  para: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 30,
    color: "#808080",
    alignSelf: "flex-start",
    textAlign: "center",
  },
  input: {
    borderColor: "#CBCBCB",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 0,
    backgroundColor: "#fff",
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
  codeText: {
    color: "#808080",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
  },
  resendButton: {
    color: "#202226",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  paraOtp: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 20,
    color: "#808080",
    textAlign: "center",
  },
  codeContainer: {
    justifyContent: "space-between",
    marginBottom: 30,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
  },
  resendButton: {
    color: "#202226",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  otpContainer: {
    marginVertical: 30,
  },
  otpPinCodeContainer: {
    borderColor: "#fff",
    borderRadius: 0,
    borderBottomColor: "#E5E7EB",
  },
  otpActivePinCodeContainer: {
    borderColor: "#fff",
    borderRadius: 0,
    borderBottomColor: "#74BB29",
  },
  otpPinCodeText: {
    color: "#74BB29",
  },
});
