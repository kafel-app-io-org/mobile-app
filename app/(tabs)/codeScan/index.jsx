import React from "react";
import { View } from "react-native";
import { Redirect } from 'expo-router';

const CodeScanIndexScreen = () => {
  return <Redirect href="(tabs)/codeScan/ScanQrCodeScreen" />;
};

export default CodeScanIndexScreen;
