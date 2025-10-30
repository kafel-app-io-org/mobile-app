import React, { useEffect, useState } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  useUserProfile,
  useUpdateUserProfile,
  useUpdateUserProfileMultiPart
} from "@/query-hooks/general-query-hooks";
import { API_BASE_URL, getAuthenticationHeaders } from "@/api/send-api-request";
import UploadIcon from "@/assets/icons/UploadIcon";
import axios from 'axios';
import { useTranslation } from "react-i18next";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const EditProfileScreen = () => {
  let { data: user, isPending: isPendingUser, refetch } = useUserProfile();

  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [overview, setOverview] = useState("");
  
  useEffect(() => {
    console.log(user?.name);
    setName(user?.name);
    setEmail(user?.email);
    setAddress(user?.address);
    setImage(user?.image);
    setPhoneNumber(user?.phone_number);
    setCountry(user?.country);
    setCity(user?.city);
    setWebsite(user?.website);
    setOverview(user?.overview);
    
    
  }, [user]);

  const { mutateAsync: mutateAsyncupdateUserProfile } = useUpdateUserProfile();

  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState(null);
  const handleOnPressSaveChanges = async () => {
    setIsLoading(true)
    const response = await mutateAsyncupdateUserProfile({
      name: name,
      email: email,
      address: address,
      phone_number: phone_number,
      country: country,
      city: city,
      website: website,
      overview: overview,
    }); 
    // if(!response.name){
    //   Alert('Update Failed!');
    // }
    setIsLoading(false);
    router.back();
  };

  const [isLoading, setIsLoading] = useState(false);

  // const handleOnPressUpload = async () => {
  //   // Ask for permission
  //   const permissionResult =
  //     await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (permissionResult.status !== "granted") {
  //     alert("Permission to access media library is required!");
  //     return;
  //   }

  //   // Launch picker
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     const asset = result.assets[0];

  //     const imageFile = {
  //       uri: asset.uri,
  //       name: asset.fileName || asset.uri.split("/").pop() || "upload.jpg",
  //       type: "image/jpeg", // Expo doesn't always return MIME type, so we assume JPEG
  //     };

  //     // Set image in state
  //     setSelectedImage(imageFile);
  //     // handleUpdateImage();

  //     setIsLoading(true);
  //     const formData = new FormData();
  //     formData.append("email", email);
  //     if (imageFile) {
  //       formData.append("imageFile", {
  //         uri: imageFile.uri,
  //         name: imageFile.name,
  //         type: imageFile.type,
  //       });
  //     }
  //     console.log('formData content:', formData);
  //     const response = await useUpdateUserProfile(formData);
  //     if (response) {
  //       refetch();
  //       setIsLoading(false);
  //       if (response?.image) {
  //         alert("Profile Image Updated Successfully!");
  //       }
  //     }
  //     console.log('enddddedd')
  //   }
  // };

  const handleOnPressUpload = async () => {
    // Ask for permission
    const authHeader = getAuthenticationHeaders();
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }
  
    // Launch picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const asset = result.assets[0];
  
      const image = {
        uri: asset.uri,
        name: asset.fileName || asset.uri.split("/").pop() || "upload.jpg",
        type: "image/jpeg", // fallback
      };
  
      setSelectedImage(image);
  
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("phone_number", phone_number);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("website", website);
      formData.append("overview", overview);
      formData.append("image", {
        uri: image.uri,
        name: image.name,
        type: image.type,
      });
  
      try {

        console.log({
          ...authHeader,
          "Content-Type": "multipart/form-data",
        })
        setIsLoading(true);
        const response = await axios.patch(
          `${API_BASE_URL}/users/profile`,
          formData,
          {
            headers: {
              ...authHeader,
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        if (response?.data?.image) {
          // by RSR alert("Profile Image Updated Successfully!");
        }
  
        refetch();
      } catch (error) {
        console.error("Error uploading image:", error?.response || error);
        alert(t("tabs.menu.EditProfileScreen.updateFailed"));
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleUpdateImage = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("phone_number", phone_number);
    formData.append("country", country);
    formData.append("city", city);
    formData.append("website", website);
    formData.append("overview", overview);
    if (selectedImage) {
      formData.append("image", {
        uri: selectedImage.uri,
        name: selectedImage.name,
        type: selectedImage.type,
      });
    }
    console.log('formData content:', formData);
    const response = await useUpdateUserProfileMultiPart(formData);
    if (response) {
      refetch();
      setIsLoading(false);
      if (response?.image) {
        alert("Profile Image Updated Successfully!");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ position: "relative" }}>
        <Image
          style={styles.profileImage}
          source={{ uri: `${API_BASE_URL}${image}` }}
        />

        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 8,
            right: "50%",
            transform: [{ translateX: 65 }, { translateY: 0 }],
            backgroundColor: "#202226",
            borderRadius: 20,
            borderColor: "#FFF",
            borderWidth: 6,
            padding: 6,
            zIndex: 10,
          }}
          onPress={handleOnPressUpload}
        >
          <UploadIcon />
        </TouchableOpacity>
      </View>

      <View style={{ gap: 15, marginTop: 30 }}>
        <View style={styles.rowWrapper}>
          <View style={styles.rowTextWrapper}>
            <Text style={styles.label}>{t("tabs.menu.EditProfileScreen.name")}</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />
          </View>
        </View>
        {/* <View style={styles.rowWrapper}>
          <View style={styles.rowTextWrapper}>
            <Text style={styles.label}>Mobile Phone</Text>
            <TextInput style={styles.input}>+970 597232227</TextInput>
          </View>
        </View> */}
        <View style={styles.rowWrapper}>
          <View style={styles.rowTextWrapper}>
            <Text style={styles.label}>{t("tabs.menu.EditProfileScreen.email")}</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} />
          </View>
        </View>
        <View style={styles.rowWrapper}>
          <View style={styles.rowTextWrapper}>
            <Text style={styles.label}>{t("tabs.menu.EditProfileScreen.address")}</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />
          </View>
        </View>
        <TouchableOpacity onPress={handleOnPressSaveChanges}>
          <LinearGradient
            colors={["#74BB29", "#92D050", "#74BB29"]}
            locations={[0.0201, 0.5083, 0.9757]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{t("tabs.menu.EditProfileScreen.saveChanges")}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
            // height:"800",
          }}
        >
          <ActivityIndicator size="large" color="#74BB29" />
        </View>
      )}
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    // justifyContent:"center",
    // alignItems:"center"
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: "#FFF",
    flex: 1,
    // height: Dimensions.get("window").height,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    width: "100%",
  },
  rowTextWrapper: {
    gap: 8,
    // maxWidth: "80%",
    width: "100%",
  },
  icon: {},
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
});
