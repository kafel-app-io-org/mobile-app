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
} from "react-native";
import { API_BASE_URL } from "@/api/send-api-request"

import { useAuth } from "@/contexts/AuthContext";
import { BlurView } from "expo-blur";
import QRCode from "react-native-qrcode-svg";
const ReceiveTransactionScreen = () => {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/receiveBg.png")}
        style={styles.bgImage}
      />

      <View style={styles.userInfo}>
        <Image
          // source={require("@/assets/images/.png")}x
          source={{ uri: `${API_BASE_URL}${user?.image}` }}
          style={styles.userImage}
        />
        <Text style={styles.userName}>{user?.name??'Anonymous'}</Text>
        <Text style={styles.phoneNumber}>{user?.phone_number}</Text>

        <View style={styles.qrCode}>
          {/* <QRCode
            value="https://zaki.net"
            size={200}
            style={styles.qrCode}
            color="black"
            backgroundColor="white"
          /> */}
        </View>
      </View>
      
      <BlurView intensity={70} tint="light" style={styles.qrCodeWarper}>
        {/* <View style={{ width: 240, height: 240 }} /> */}
        <View style={styles.qrCode}>
        <QRCode
          value={JSON.stringify({ name: user?.name??'Anonymous', phone: user?.phone_number, image: user?.image })}
          size={200}
          color="#74BB29"
          backgroundColor="white"
        />
      </View>
      </BlurView>
      {/* <View style={styles.qrCode}>
        <QRCode
          value={JSON.stringify({ name: user?.name??'Anonymous', phone: user?.phone_number, image: user?.image })}
          size={200}
          color="#74BB29"
          backgroundColor="white"
        />
      </View> */}
    </View>
  );
};

export default ReceiveTransactionScreen;

const styles = StyleSheet.create({
  container: {
    // justifyContent:"center",
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 40,
    backgroundColor: "#FfF",
    height: Dimensions.get("window").height,
    position: "relative",
  },
  bgImage: {
    position: "absolute",
    width: Dimensions.get("window").width, 
    height: Dimensions.get("window").height,
    top: -100,
    // left:0,
    objectFit: "cover",
    zIndex: 0,
    // backgroundColor:"#EE1"
  },
  userInfo: {
    alignItems: "center",
    marginTop: 20,
    position: "relative",
    width: "100%",
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: "#C4C4C4",
  },
  userName: {
    fontSize: 27,
    fontWeight: 700,
    color: "#202226",
    marginTop: 20,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: 400,
    color: "#808080",
    marginTop: 10,
    marginBottom: 40,
  },
  qrCodeWarper: {
    // position: "absolute",
    // top: Dimensions.get("window").height / 2 - 240,
    // left: Dimensions.get("window").width / 2 - 120,
    backgroundColor: "#00000013",
    borderRadius: 12,
    overflow: "hidden",
    // opacity: 0.5,
    zIndex: 1,
    width:240,
    height: 240,

    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },
  qrCode: {
    // position: "absolute",
    // top: Dimensions.get("window").height / 2 - 240,
    // left: Dimensions.get("window").width / 2 - 120,
    zIndex: 2,
    // borderRadius: 12,
    overflow: "hidden",
    // padding: 20,

  },
});
