import React, { useState, useEffect } from "react";
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

import { formatDate, formatTime, convertToFloatCents } from "@/utils/helper";

import ProfileLocationIcon from "@/assets/icons/ProfileLocationIcon";
import ProfileMailIcon from "@/assets/icons/ProfileMailIcon";
import ProfilePhoneIcon from "@/assets/icons/ProfilePhoneIcon";
import { useAuth } from "@/contexts/AuthContext";
import {
  useUserProfile,
  useUpdateUserProfile,
} from "@/query-hooks/general-query-hooks";

import { useTranslation } from "react-i18next";

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { data: user, isPending: isPendingUser, refetch } = useUserProfile();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");

  const { setUser } = useAuth();

  useEffect(() => {
    console.log(user?.name);
    setName(user?.name);
    setEmail(user?.email);
    setAddress(user?.address);
    setImage(user?.image)
    setPhoneNumber(user?.phone_number)

    // setUser(user);
  }, [user]);
  console.log(user)

  return (
    <View style={styles.container}>
      <Image style={styles.profileImage} source={{ uri: `${API_BASE_URL}${image}` }}/>
      <View style={{ alignSelf: "center", alignItems: "center" }}>
        <Text style={styles.userName}>{name??t("tabs.menu.ProfileScreen.anonymous")}</Text>
        <Text style={styles.dateJoined}>{formatDate(user?.created_at)}</Text>
      </View>
      <View style={{gap:25, marginTop:30}}>
        <View style={styles.rowWrapper}>
            <ProfilePhoneIcon/>
            <View style={styles.rowTextWrapper}>
                <Text style={styles.label}>{t("tabs.menu.ProfileScreen.phone")}</Text>
                <Text style={styles.value}>{phoneNumber}</Text>
            </View>
        </View>
        <View style={styles.rowWrapper}>
            <ProfileMailIcon/>
            <View style={styles.rowTextWrapper}>
                <Text style={styles.label}>{t("tabs.menu.ProfileScreen.email")}</Text>
                <Text style={styles.value}>{`${email||''}`}</Text>
            </View>
        </View>
        <View style={styles.rowWrapper}>
            <ProfileLocationIcon/>
            <View style={styles.rowTextWrapper}>
                <Text style={styles.label}>{t("tabs.menu.ProfileScreen.address")}</Text>
                <Text style={styles.value}>{`${address || ''}`}</Text>
            </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    // justifyContent:"center",
    // alignItems:"center"
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: "#FFF",
    height: Dimensions.get("window").height,
  },
  profileImage: {
    alignSelf: "center",
    width: 125,
    height: 125,
    backgroundColor: "#C4C4C4",
    borderRadius: 100,
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
    flexDirection:"row",
    alignItems: "center",
    gap: 25
  },
  rowTextWrapper: {
    gap: 8,
    maxWidth: "80%", 
  },
  icon: {},
  label: {
    fontSize: 15,
    fontWeight: "400",
    color: "#808080",
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
    color: "#202226",
  },
});
