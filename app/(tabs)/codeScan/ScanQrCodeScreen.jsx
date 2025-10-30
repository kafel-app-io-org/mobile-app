import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  PermissionStatus,
} from "expo-camera";
import { useRouter } from "expo-router";
import { Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { API_BASE_URL } from "@/api/send-api-request"

const ScanQrCodeScreen = () => {
  const [facing, setFacing] = useState("back");
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [freezeFrame, setFreezeFrame] = useState(false);
  const [qrValue, setQrValue] = useState(null);
  const [flash, setFlash] = useState("off");
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef(null);

  const [showActionMenu, setShowActionMenu] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    if (permission?.status === undefined) return;
    console.log(permission?.status);
    if (permission?.status === PermissionStatus.UNDETERMINED) {
      requestPermission();
    }

    if (permission?.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Camera Permission Required",
        "Please enable camera access in your device settings.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ],
        { cancelable: true }
      );
    }
  }, [permission]);

  useEffect(() => {
    (async () => {
      if (!permission || permission.status === "undetermined") {
        const response = await requestPermission();
        console.log("Requested Permission:", response.status);
      }
    })();
  }, []);

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please Allow Camera Permission To Proceed</Text>
      </View>
    );
  }

  const handleQrCodeScanned = ({ data }) => {
    if (cameraRef.current) {
      cameraRef.current.pausePreview();
    }

    setScanned(true);
    setQrValue(data);

    if (isValidQrCodeData(data)) {
      setPendingData(JSON.parse(data));

      setShowActionMenu(true);
    } else {
      Alert.alert("Invalid QR Code, Please Try Again");
    }
  };

  const isValidQrCodeData = (data) => {
    try {
      const parsed = JSON.parse(data);
      return (
        parsed &&
        typeof parsed.name === "string" &&
        typeof parsed.phone === "string"
      );
    } catch (error) {
      return false;
    }
  };
  const handleOnAccept = (data) => {
    if (cameraRef.current) {
      cameraRef.current.resumePreview();
    }

    setScanned(false);

    try {
      // const parsed = JSON.parse(data);
      router.replace({
        pathname: "(tabs)/transactions/SendTransactionScreen",
        params: {
          recipient: JSON.stringify(data),
        },
      });
    } catch (err) {
      Alert.alert("Invalid QR code format");
    }
  };
  const handleOnReject = (data) => {
    if (cameraRef.current) {
      cameraRef.current.resumePreview();
    }

    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        flash={flash}
        zoom={zoom}
        onBarcodeScanned={scanned ? null : handleQrCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      </CameraView>
      <Modal
        transparent
        visible={showActionMenu}
        animationType="fade"
        onRequestClose={() => setShowActionMenu(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 24,
              width: "80%",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Text style={styles.modalHeader}>Pay To:</Text>
            <View style={styles.hr} />
            <View style={styles.modalRecipientBlock}>
              <Image style={styles.modalRecipientImage}  source={{ uri: `${API_BASE_URL}${pendingData?.image}` }}
              />
              <View style={styles.modalRecipientInfo}>
                <Text style={styles.modalRecipientname}>
                  {pendingData?.name}
                </Text>
                <Text style={styles.modalRecipientphone}>
                  {pendingData?.phone}
                </Text>
              </View>
            </View>
            <View style={styles.hr} />

            <TouchableOpacity
              style={{ width: "100%", marginVertical: 5 }}
              onPress={() => {
                handleOnAccept(pendingData);
                setShowActionMenu(false);
              }}
            >
              <LinearGradient
                colors={["#74BB29", "#92D050", "#74BB29"]}
                locations={[0.0201, 0.5083, 0.9757]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Continue to Payment</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: "100%", marginVertical: 5 }}
              onPress={() => {
                handleOnReject(pendingData);
                setShowActionMenu(false);
              }}
            >
              <LinearGradient
                colors={["#74BB29", "#92D050", "#74BB29"]}
                locations={[0.0201, 0.5083, 0.9757]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[{ padding: 2, borderRadius: 14 }]}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    paddingVertical: 16,
                  }}
                >
                  <Text style={[styles.buttonText, { color: "#74BB29" }]}>
                    Cancel
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingBottom: 0 },
  rescan: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    fontSize: 18,
    color: "#007bff",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  hr: {
    marginVertical: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    // flex: 1,
    // alignSelf: "flex-end",
    // alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  overlay: {
    position: "absolute",
    top: -60,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  frame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    width: 30,
    height: 30,
    borderColor: "#74BB29",
    position: "absolute",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  popUpModal: {
    alignSelf: "center",
    position: "absolute",
    top: -60,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  popUpModalFrame: {
    width: 260,
    height: 260,
    position: "relative",
    backgroundColor: "#fff",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
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
  modalHeader: {
    fontSize: 24,
    fontWeight: 500,
    color: "#27364E",
    marginBottom: 10,
    marginTop: 10,
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
    width: 80,
    height: 80,
    backgroundColor: "#D9D9D9",
    borderRadius: 100,
  },
  modalRecipientInfo: {
    gap: 5,
  },
  modalRecipientname: {
    fontSize: 16,
    fontWeight: 600,
    color: "##838FA0",
    flexWrap: 'wrap', 
    maxWidth: "90%"
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
});

export default ScanQrCodeScreen;
