import React from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import i18n from '../i18n'; 
import { I18nManager } from "react-native";
import { Platform } from 'react-native';
import { switchLanguage, getCurrentLanguage } from "../i18n"

const lang = getCurrentLanguage();
console.log(lang);
if(lang == "ar"){
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true); // restart with RTL
}

const Root = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const authenticate = async () => {
    console.log("pppp");

    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    console.log("pdppp");

    if (!compatible) {
      // alert("Device doesn't support authentication.");
      setChecking(false);
      setAuthenticated(true);
      return;
    }

    if (!enrolled) {
      // alert("No biometrics or passcode enrolled.");
      setChecking(false);
      setAuthenticated(true);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access the app",
      fallbackLabel: "Use Passcode",
      cancelLabel: "Cancel",
    });
    setAuthenticated(result.success);
    setChecking(false);
  };
  useEffect(() => {
    authenticate();
  }, []);

  if (checking)
    return (
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
    );

  if (!authenticated) {
    return (
      //by RSR
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Authentication failed or was cancelled.</Text>
        <Button title="Try Again" onPress={authenticate} />
      </View>
    );
  }
  return <Redirect href="(tabs)" />;
};

export default Root;
