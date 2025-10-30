import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
// import {InternationalPhoneNumberInput} from "react-native-international-phone-number";
import PhoneInput, {
  isValidPhoneNumber,
} from "react-native-international-phone-number";
const Login = () => {
  // const auth = () => {};
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");
  const router = useRouter();


  const handleLogin = async () => {

    router.push({
      pathname: "/(auth)/VerifyCodeScreen",
    });

    // if (!isValidPhoneNumber(inputValue, selectedCountry)) {
    //   return alert("Invalid Phone Number");
    // }

    // try {
    //   console.log(getFullPhoneNumber(inputValue, selectedCountry));
    //   const { result } = await requestPhoneVerification(inputValue);
    //   console.log(result);
    //   if (result) {
    //     router.push({
    //       pathname: "/(auth)/VerifyCodeScreen",
    //     });
    //   } else alert("ffffff");
    // } catch (err) {
    //   console.error("Phone auth error", err);
    //   alert("Failed to send code");
    // }
  };

  const getFullPhoneNumber = (inputValue, selectedCountry) => {
    const callingCode = selectedCountry.callingCode; // e.g. "1" for US
    // Clean input: remove spaces and leading zeros
    const cleanedInput = inputValue.replace(/\s+/g, "").replace(/^0+/, "");
    return `${callingCode}${cleanedInput}`;
  };


  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.logoWarapper}>
          <Image
            source={require("@/assets/images/kafel-black.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.para}>
          Welcome to Kafel! Sign in to access your account, manage donations,
          and track your impact.
        </Text>

        <View>
          <PhoneInput
            value={inputValue}
            onChangePhoneNumber={setInputValue}
            selectedCountry={selectedCountry}
            onChangeSelectedCountry={setSelectedCountry}
            placeholder=""
            defaultCountry="ps"
            popularCountriess={["PS"]}
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
              backdrop: {},
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
          onPress={handleLogin}
        >
          <LinearGradient
            colors={["#74BB29", "#92D050", "#74BB29"]}
            locations={[0.0201, 0.5083, 0.9757]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Send Verification Code</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ marginTop: 100 }}>
          <Text style={styles.codeText}>Didn't Recive Code?</Text>
          <TouchableOpacity>
            <Text style={styles.resendButton}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    // </TouchableWithoutFeedback>
  );
};
export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingTop: 120,
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
  },
  para: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 30,
    color: "#808080",
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
});

