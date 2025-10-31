// [UNCHANGED IMPORTS]
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { router } from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  Keyboard,
  TextInput,
  Platform,
  Modal,
  Alert,
  Linking,
  I18nManager,
  ActivityIndicator,
} from "react-native";
import { Skeleton } from "moti/skeleton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Searchbar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  TransactionCard,
  TransactionCardSkeleton,
} from "@/components/TransactionCard";
import {
  useAllTransactions,
  useTransationDetails,
} from "@/query-hooks/transactions-query-hooks";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

import { LinearGradient } from "expo-linear-gradient";
import SearchIcon from "@/assets/icons/SearchIcon";
import FiltersIcon from "@/assets/icons/FiltersIcon";
import DatePickerIcon from "@/assets/icons/DatePickerIcon";
import {
  formatDate,
  formatTime,
  convertToFloatCents,
  formatCurrency,
} from "@/utils/helper";

import TransactionFromIcon from "@/assets/icons/TransactionFromIcon";
import TransactionToIcon from "@/assets/icons/TransactionToIcon";
import TransactionDateIcon from "@/assets/icons/TransactionDateIcon";
import TransactionReferanceIcon from "@/assets/icons/TransactionReferanceIcon";
import TransactionTypeIcon from "@/assets/icons/TransactionTypeIcon";
import TransactionAmountIcon from "@/assets/icons/TransactionAmountIcon";

import { useTranslation } from "react-i18next";

const colorMode = {
  light: {
    backgroundColor: "#E1E9EE",
    foregroundColor: "#F2F8FC",
  },
};

const FEE_PERCENTAGE = 0.05;

const AllTransactionsScreen = () => {
  const { t } = useTranslation();
  const { transaction_id_param, refreshKey: transaction_id_refreshKey  } = useLocalSearchParams();
  const filtersSheetRef = useRef(null);
  const detailsSheetRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState("all");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [mode, setMode] = useState("date");

  const isDropdownOpenRef = useRef(false);

  useEffect(()=>{
    console.log('transaction_id_param' , transaction_id_param)
    if (!transaction_id_param) return;
    setTimeout(() => {
      console.log('whaa')
      handleOnPressTransation(transaction_id_param)
    }, 1000);
    // return () => clearTimeout(1000); 
  }, [transaction_id_param, transaction_id_refreshKey])

  const typeOptions = [
    { label: "All", value: "all" },
    { label: "Transfer", value: "transfer" },
    { label: "deposit", value: "deposit" },
    { label: "Withdraw", value: "withdraw" },
  ];

  const renderItem = (item) => {
    console.log("type", type);
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === tempFilters?.type && (
          <AntDesign
            style={styles.icon}
            color="#74BB29"
            name="checkcircle"
            size={20}
          />
        )}
      </View>
    );
  };

  // const {
  //   data: transactions,
  //   isPending: isPendingTransactions,
  //   refetch,
  // } = useAllTransactions(
  //   searchQuery,
  //   type,
  //   fromDate.toISOString(),
  //   toDate.toISOString()
  // );

  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    type: "",
  });
  const [tempFilters, setTempFilters] = useState({
    fromDate: null,
    toDate: null,
    type: "",
  });

  const {
    data: transactions,
    isPending: isPendingTransactions,
    refetch,
  } = useAllTransactions(
    searchQuery,
    filters?.type || "all",
    filters?.fromDate ? filters.fromDate.toISOString() : undefined,
    filters?.toDate ? filters.toDate.toISOString() : undefined
  );

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleOnPressFilters = () => {
    filtersSheetRef.current?.expand();
  };

  const handleOnPressResetFilters = () => {
    setTempFilters({
      fromDate: null,
      toDate: null,
      type: "all",
    });
    setFilters({
      fromDate: null,
      toDate: null,
      type: "all",
    });
    filtersSheetRef.current?.close();
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    filtersSheetRef.current?.close();
  };

  const openPicker = (field) => {
    if (activeField === "from") {
      setTempFromDate(new Date());
    } else if (activeField === "to") {
      setTempToDate(new Date());
    }
    setActiveField(field);
    setShowPicker(true);
  };

  const [tempFromDate, setTempFromDate] = useState(null);
  const [tempToDate, setTempToDate] = useState(null);

  const handleDateChange = (event, selectedDate) => {
    console.log("selectedDate: ", selectedDate);
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (activeField === "from") {
      if (!selectedDate) setTempFromDate(new Date());
      else setTempFromDate(selectedDate);
    } else if (activeField === "to") {
      if (!selectedDate) setTempToDate(new Date());
      else setTempToDate(selectedDate);
    }
  };

  const handlePressSelectDate = (activeField) => {
    if (activeField === "from") {
      setTempFilters((prev) => ({
        ...prev,
        fromDate: tempFromDate,
      }));
    } else if (activeField === "to") {
      setTempFilters((prev) => ({
        ...prev,
        toDate: tempToDate,
      }));
    }
  };
  const handleOnPressCancelSelectDate = () => {
    setShowPicker(false);
  };
  const transactionRef = useRef(null);
  const sheetRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [transactionId, setTransationId] = useState(null);
  const {
    data: transaction,
    isPending: isPendingTransactionDump,
    refetch: refetchTransaction,
  } = useTransationDetails(transactionId);
  const [isPendingTransaction, setIsPendingTransaction] = useState(false);


const handleOnPressTransation = (id) => {
    // setIsPendingTransaction(true);

  if (transactionId != id){
    setIsPendingTransaction(true);
    transactionRef.current = null;  // erase old transaction data
    setTransationId(id);
  }
  console.log('aaa')

  sheetRef.current?.expand();  // expand sheet

};
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) return;
      const { data, error } = await refetchTransaction();

      console.log('refetchTransaction: ',data)
      if (error) {
        console.error('Error fetching transaction:', error);
        Alert.alert("Error");
        setIsPendingTransaction(false);
        setRefreshKey(Date.now());
        return;
      }

      transactionRef.current = data;
      setIsPendingTransaction(false);
      setRefreshKey(Date.now());
  };

  fetchTransaction();
}, [transactionId]);


  // const handleOnPressTransation = async (id) => {
  //   console.log(id)
  //   setTransationId(id);
  //   isPendingTransactionRef.current = true;
  //   setRefreshKey(Date.now());  // trigger TransactionSheet re-render
  //   const { data, error } = await refetchTransaction();

  //   if (error) {
  //     console.error('Error fetching transaction:', error);
  //     Alert.alert("Error")
  //     isPendingTransactionRef.current = false;
  //     setRefreshKey(Date.now());  // trigger TransactionSheet re-render
  //     return;
  //   }

  //   transactionRef.current = data;
  //   isPendingTransactionRef.current = false;
  //   setRefreshKey(Date.now()); // trigger TransactionSheet re-render
  //   sheetRef.current?.expand();
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", height: "100%" }}>
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          flex: 1,
          // height: Dimensions.get("window").height,
        }}
        extraScrollHeight={100}
        enableOnAndroid={true}
      >
        <View
          style={{
            flex: 1,
            padding: 16,
            gap: 18,
            // height: Dimensions.get("window").height,
          }}
        >
          <View style={styles.sectionHeader}>
            <Searchbar
              placeholder={t("tabs.transactions.AllTransactionsScreen.search")}
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              icon={() => (
                <SearchIcon name="magnify" size={24} color="#74BB29" />
              )}
              clearIcon="close-circle"
              onIconPress={() => console.log("Search icon pressed")}
              theme={{
                colors: {
                  primary: "#74BB29",
                  surfaceVariant: "transparent",
                },
              }}
            />
            <TouchableOpacity onPress={handleOnPressFilters}>
              <FiltersIcon />
            </TouchableOpacity>
          </View>

          <View style={{ display: "flex", gap: 12, paddingBottom: 60 }}>
            {transactions &&
            Array.isArray(transactions) &&
            transactions.length > 0 ? (
              transactions?.map((item, index) => (
                <TransactionCard
                  key={index}
                  transactionData={item}
                  handleOnPressTransation={handleOnPressTransation}
                />
              ))
            ) : !isPendingTransactions ? (
              <Text
                style={{
                  alignSelf: "center",
                  marginVertical: 40,
                  color: "#333",
                }}
              >
                {t("tabs.transactions.AllTransactionsScreen.noTransactions")}
              </Text>
            ) : null}

            {isPendingTransactions && (
              <>
                {Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <TransactionCardSkeleton key={index} />
                  ))}
              </>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
      {/* Bottom Sheet */}
      <BottomSheet
        ref={filtersSheetRef}
        index={-1}
        // snapPoints={useMemo(() => ["75%"], [])}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <BottomSheetView style={styles.sheetContainer}>
          <View style={{ alignItems: "center", position: "relative" }}>
            <TouchableOpacity
              onPress={handleOnPressResetFilters}
              style={{ position: "absolute", right: 0 }}
            >
              <Text
                style={{
                  color: "#202226",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {t("tabs.transactions.AllTransactionsScreen.reset")}
              </Text>
            </TouchableOpacity>
            <Text style={styles.titel}>
              {t("tabs.transactions.AllTransactionsScreen.filter")}
            </Text>
          </View>

          <Hr />
          <Text style={styles.label}>
            {t("tabs.transactions.AllTransactionsScreen.type")}
          </Text>
          <Dropdown
            inverted={false}
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.itemsWrapperStyle}
            itemContainerStyle={styles.itemsStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={typeOptions}
            // search
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder={t(
              "tabs.transactions.AllTransactionsScreen.selectType"
            )}
            searchPlaceholder={t(
              "tabs.transactions.AllTransactionsScreen.search"
            )}
            // value={type}
            value={tempFilters?.type}
            // onChange={(item) => {
            //   // setType(item.value);
            //   setTempFilters( (prev)=> prev.type = item.value)
            // }}
            onChange={(item) => {
              setTempFilters((prev) => ({
                ...prev,
                type: item.value,
              }));
            }}
            onFocus={() => {
              isDropdownOpenRef.current = true;
              console.log("Dropdown opened", isDropdownOpenRef.current);
            }}
            onBlur={() => {
              isDropdownOpenRef.current = false;
              console.log("Dropdown closed", isDropdownOpenRef.current);
            }}
            renderItem={renderItem}
          />

          <Text style={styles.label}>
            {t("tabs.transactions.AllTransactionsScreen.fromDate")}
          </Text>
          <TouchableOpacity onPress={() => openPicker("from")}>
            <View style={styles.inputWithIcon}>
              <DatePickerIcon />
              <TextInput
                // value={fromDate ? fromDate.toDateString() : ""}
                value={
                  tempFilters?.fromDate
                    ? tempFilters?.fromDate?.toDateString()
                    : ""
                }
                placeholder="DAY MMM DD YYYY"
                editable={false}
                pointerEvents="none"
                style={{ fontSize: 16 }}
              />
            </View>
          </TouchableOpacity>

          <Text style={styles.label}>
            {t("tabs.transactions.AllTransactionsScreen.toDate")}
          </Text>
          <TouchableOpacity onPress={() => openPicker("to")}>
            <View style={styles.inputWithIcon}>
              <DatePickerIcon />
              <TextInput
                // value={toDate ? toDate.toDateString() : ""}
                value={
                  tempFilters?.toDate ? tempFilters?.toDate.toDateString() : ""
                }
                placeholder="DAY MMM DD YYYY"
                editable={false}
                pointerEvents="none"
                style={{ fontSize: 16 }}
              />
            </View>
          </TouchableOpacity>

          {showPicker && Platform.OS === "ios" && (
            <Modal transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                    onPress={handleOnPressCancelSelectDate}
                  >
                    <Text
                      style={{
                        color: "#000",
                        fontSize: 16,
                        justifyContent: "flex-end",
                      }}
                    >
                      {t("tabs.transactions.AllTransactionsScreen.cancel")}
                    </Text>
                  </TouchableOpacity>
                  <View style={{ backgroundColor: "white", height: 200 }}>
                    <DateTimePicker
                      value={
                        activeField === "from"
                          ? tempFromDate || new Date()
                          : tempToDate || new Date()
                      }
                      mode={mode}
                      is24Hour={true}
                      display="spinner"
                      onChange={handleDateChange}
                      style={{ flex: 1 }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setShowPicker(false);
                      handlePressSelectDate(activeField);
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 16,
                        color: "#000",
                        textAlign: "center",
                        fontSize: 18,
                      }}
                    >
                      {t("tabs.transactions.AllTransactionsScreen.select")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
          {showPicker && Platform.OS === "android" && (
            <DateTimePicker
              value={
                activeField === "from"
                  ? tempFromDate || new Date()
                  : tempToDate || new Date()
              }
              mode={mode}
              is24Hour={true}
              display="spinner"
              onChange={handleDateChange}
              //  style={{ flex: 1 }}
            />
          )}

          <TouchableOpacity onPress={handleApplyFilters}>
            <LinearGradient
              colors={["#74BB29", "#92D050", "#74BB29"]}
              locations={[0.0201, 0.5083, 0.9757]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {t("tabs.transactions.AllTransactionsScreen.apply")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>

      <TransactionSheet
        ref={sheetRef}
        transactionRef={transactionRef}
        isPendingTransaction={isPendingTransaction}
        refreshKey={refreshKey}
      />

      {/* <DetailsSheet temp={temp} detailsSheetRef={detailsSheetRef} /> */}
    </SafeAreaView>
  );
};

export default AllTransactionsScreen;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#EDEDED",
    backgroundColor: "#FBFBFB",
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "space-between",
    paddingRight: 16,
  },
  searchBar: {
    width: "95%",
    backgroundColor: "transparent",
  },
  sheetContainer: {
    padding: 20,
    gap: 15,
    paddingBottom: 80,
  },
  titel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#242B42",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#242B42",
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6E9ED",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    height: 48,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: "#E6E9ED",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    height: 48,
    marginBottom: 10,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  button: {
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  hr: {
    borderBottomColor: "#EAECF0",
    borderBottomWidth: 1,
    marginVertical: 1,
  },
  dropdown: {
    // margin: 16,
    // height: 50,
    // backgroundColor: "white",
    // borderRadius: 12,
    // padding: 12,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    // elevation: 2,
    borderWidth: 1,
    borderColor: "#E6E9ED",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    height: 48,
    marginBottom: 10,
    // textAlign: I18nManager.isRTL ? "right" : "left", // affects Android
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    // textAlign: I18nManager.isRTL ? "left" : "right",
    textAlign:
      Platform.OS === "ios" ? (I18nManager.isRTL ? "left" : "right") : "auto",
  },
  placeholderStyle: {
    fontSize: 16,
    // textAlign: I18nManager.isRTL ? "left" : "right",
    textAlign:
      Platform.OS === "ios" ? (I18nManager.isRTL ? "left" : "right") : "auto",
  },
  selectedTextStyle: {
    fontSize: 16,
    alignSelf: "flex-start",
    textAlign:
      Platform.OS === "ios" ? (I18nManager.isRTL ? "left" : "right") : "auto",
  },
  iconStyle: {
    width: 20,
    height: 20,
    display: "none",

    // left:"auto",
    // right:"92%",

    // right: I18nManager.isRTL ? "92%":"auto",
    // left: I18nManager.isRTL ? "auto":"92%",
    // right: Platform.OS === 'ios'
    // ? (I18nManager.isRTL ? "92%":"auto")
    // : "auto" ,

    // left: Platform.OS === 'ios'
    // ? (I18nManager.isRTL ? "auto":"92%")
    // : "auto"
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 14,
  },
  itemsStyle: {
    borderRadius: 14,
  },
  itemsWrapperStyle: {
    borderRadius: 14,
    marginTop: 4,
    shadowOpacity: 10,
    // overflow:"hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.41,
    elevation: 2,
  },
  key: {
    fontSize: 12,
    fontWeight: 400,
    color: "#939393",
  },
  value: {
    fontSize: 14,
    fontWeight: 500,
    color: "#202226",
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  receiptContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignSelf: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    gap: 15,
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  receiptRow: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    width: 240,
    height: 120,
    objectFit: "contain",
  },
});

const Hr = () => <View style={styles.hr} />;

const DataRow = ({ keyText, valueText, icon, isPending }) => {
  return (
    <View style={styles.dataRow}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {icon}
        <Text style={styles.key}>{keyText}</Text>
      </View>
      {isPending ? (
        <Skeleton colorMode={colorMode} width={80} height={20} radius={20} />
      ) : (
        <Text style={styles.value}>{valueText}</Text>
      )}
    </View>
  );
};

import ViewShot from "react-native-view-shot";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { PermissionStatus } from "expo-camera";
import { useRouter, useLocalSearchParams } from "expo-router";

const TransactionSheet = React.forwardRef(
  ({ transactionRef, isPendingTransaction, refreshKey }, ref) => {
    const [transaction, setTransaction] = useState(null);
    // const [isPendingTransaction, setIsPendingTransaction] = useState(null);
    // const isPendingTransactions = false;
    useEffect(() => {
      setTransaction(transactionRef.current); // Re-read ref on each trigger
      // setIsPendingTransaction(isPendingTransactionRef.current)
      console.log('isPendingTransaction on refresh', isPendingTransaction)
    }, [refreshKey]);

    const handleOnPressOk = () => {
      ref.current?.close();
    };

    const handleOnPressDownloadRecipt = async () => {
      //Request media library permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log(status);

      if (status === undefined) return;
      if (status === PermissionStatus.UNDETERMINED) {
        await MediaLibrary.requestPermissionsAsync();
      }

      if (status === PermissionStatus.DENIED) {
        Alert.alert(
          "Permission Denied",
          "Cannot save receipt without permission.",
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
      try {
        if (status !== "granted") {
          //   Alert.alert(
          //     "Permission Denied",
          //     "Cannot save receipt without permission."
          //   );
          return;
        }

        // Capture the receipt view as PNG
        const uri = await captureRef(receiptRef, {
          format: "png",
          quality: 1,
        });

        // Save to device's gallery
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert(
          t("tabs.transactions.AllTransactionsScreen.success"),
          t("tabs.transactions.AllTransactionsScreen.saved")
        );
      } catch (error) {
        console.error(
          t("tabs.transactions.AllTransactionsScreen.error"),
          error
        );
        Alert.alert(
          "Error",
          t("tabs.transactions.AllTransactionsScreen.error")
        );
      }
    };
    const receiptRef = useRef();

    const snap = transaction?.category == "transfer" ? 580 : 470;
    const { t } = useTranslation();
    const router = useRouter();

    const handleOnPressCampaign = (campaignData) => {
      router.replace(`/(tabs)/campaigns`);
      setTimeout(() => {
        router.push({
          pathname: `/(tabs)/campaigns/CampaignDetailsScreen`,
          params: campaignData,
        });
      }, 0);
    };
    return (
      <BottomSheet
        // ref={detailsSheetRef}
        ref={ref}
        index={-1}
        snapPoints={useMemo(() => [], [])}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        {isPendingTransaction && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <ActivityIndicator size="large" color="#74BB29" />
          </View>
        )}
        <BottomSheetView style={styles.sheetContainer}>
          {isPendingTransaction && <View style={{ height: 300 }}></View>}
          {!isPendingTransaction && (
            <>
              <View style={{ alignItems: "center", position: "relative" }}>
                <TouchableOpacity
                  onPress={handleOnPressOk}
                  style={{ position: "absolute", right: 0 }}
                >
                  <Text
                    style={{
                      color: "#202226",
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    {t("tabs.transactions.AllTransactionsScreen.ok")}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.titel}>
                  {t("tabs.transactions.AllTransactionsScreen.details")}
                </Text>
              </View>

              <Hr />
              {transaction?.category == "transfer" && (
                <>
                  <DataRow
                    isPending={isPendingTransaction}
                    keyText={t("tabs.transactions.AllTransactionsScreen.from")}
                    valueText={`${transaction?.sourceName}`}
                    valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                    icon={<TransactionFromIcon />}
                  />

                  <Hr />

                  <DataRow
                    isPending={isPendingTransaction}
                    keyText={t("tabs.transactions.AllTransactionsScreen.to")}
                    valueText={`${transaction?.targetName}`}
                    valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                    icon={<TransactionToIcon />}
                  />
                  <Hr />
                </>
              )}
              {transaction?.category == "donation" && (
                <>
                  {/* <DataRow
                  isPending={isPendingTransactions}
                  keyText={t("tabs.transactions.AllTransactionsScreen.campaign")}
                  valueText={`${transaction?.campaign_name}`}
                  icon={<TransactionToIcon />}
                /> */}

                  <View style={styles.dataRow}>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      {<TransactionTypeIcon />}
                      <Text style={styles.key}>
                        {t("tabs.transactions.AllTransactionsScreen.campaign")}
                      </Text>
                    </View>
                    {isPendingTransaction ? (
                      <Skeleton
                        colorMode={colorMode}
                        width={80}
                        height={20}
                        radius={20}
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          handleOnPressCampaign({
                            id: transaction?.campaign_id,
                          })
                        }
                        style={styles.value}
                      >
                        <Text
                          style={{
                            textDecorationLine: "underline",
                            color: "#74BB29",
                          }}
                        >{`${transaction?.campaign_name}`}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Hr />
                </>
              )}
              <DataRow
                isPending={isPendingTransaction}
                keyText={t("tabs.transactions.AllTransactionsScreen.date")}
                valueText={`${formatDate(transaction?.date)} ${formatTime(
                  transaction?.date
                )}`}
                valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                icon={<TransactionDateIcon />}
              />
              <Hr />

              <DataRow
                isPending={isPendingTransaction}
                keyText={t("tabs.transactions.AllTransactionsScreen.amount")}
                valueText={`${formatCurrency(
                  convertToFloatCents(
                    transaction?.amount?.toString().replace(/^[-]/, "")
                  )
                )}$`}
                valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                icon={<TransactionAmountIcon />}
              />
              <Hr />
              {(transaction?.category == "deposit" ||
                transaction?.category == "withdraw" ||
                transaction?.category == "transfer") && (
                <>
                  <DataRow
                    isPending={isPendingTransaction}
                    keyText={t("tabs.transactions.AllTransactionsScreen.fee")}
                    valueText={`${formatCurrency(
                      convertToFloatCents(
                        transaction?.transaction?.entries[2]?.amount 
                      )
                    )}$`}
                    valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                    icon={<TransactionAmountIcon />}
                  />
                  <Hr />
                </>
              )}
              <DataRow
                isPending={isPendingTransaction}
                keyText={t(
                  "tabs.transactions.AllTransactionsScreen.transactionType"
                )}
                valueText={t(
                  `tabs.transactions.AllTransactionsScreen.${transaction?.type}`
                )}
                // valueText={`${transaction?.type}`}
                valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                icon={<TransactionTypeIcon />}
              />
              {(transaction?.comment) && (
                <>   
                <Hr />           
              <DataRow
                isPending={isPendingTransaction}
                keyText={t("tabs.transactions.AllTransactionsScreen.comments")}
                valueText={`${transaction?.comment}`}
                valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                icon={<TransactionReferanceIcon />}
              />
              </>
              )}
              <Hr />
              <DataRow
                isPending={isPendingTransaction}
                keyText={t("tabs.transactions.AllTransactionsScreen.referance")}
                valueText={`${transaction?.reference}`}
                valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                icon={<TransactionReferanceIcon />}
              />
              

              <TouchableOpacity onPress={handleOnPressDownloadRecipt}>
                <LinearGradient
                  colors={["#74BB29", "#92D050", "#74BB29"]}
                  locations={[0.0201, 0.5083, 0.9757]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {t("tabs.transactions.AllTransactionsScreen.download")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </BottomSheetView>

        <ViewShot
          ref={receiptRef}
          options={{ format: "png", quality: 1.0 }}
          style={{
            position: "absolute",
            top: -9999,
            left: -9999,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFF",
            borderColor: "#86C443",
            borderWidth: 2,
            borderStyle: "dashed",
          }}
        >
          <Image
            source={require("@/assets/images/kafel-black.png")}
            style={styles.logo}
          />
          <View style={styles.receiptContainer}>
            {transaction?.category == "transfer" && (
              <>
                <DataRow
                  isPending={isPendingTransaction}
                  keyText={t("tabs.transactions.AllTransactionsScreen.from")}
                  valueText={`${transaction?.sourceName}`}
                  valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                  icon={<TransactionFromIcon />}
                />
                <Hr />

                <DataRow
                  isPending={isPendingTransaction}
                  keyText={t("tabs.transactions.AllTransactionsScreen.to")}
                  valueText={`${transaction?.targetName}`}
                  valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                  icon={<TransactionToIcon />}
                />
                <Hr />
              </>
            )}
            {transaction?.category == "donation" && (
              <>
                <DataRow
                  isPending={isPendingTransaction}
                  keyText={t(
                    "tabs.transactions.AllTransactionsScreen.campaign"
                  )}
                  valueText={`${transaction?.campaign_name}`}
                  valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                  icon={<TransactionTypeIcon />}
                />
                <Hr />
              </>
            )}
            <DataRow
              isPending={isPendingTransaction}
              keyText={t("tabs.transactions.AllTransactionsScreen.date")}
              valueText={`${formatDate(transaction?.date)} ${formatTime(
                transaction?.date
              )}`}
              valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
              icon={<TransactionDateIcon />}
            />
            <Hr />

            <DataRow
              isPending={isPendingTransaction}
              keyText={t("tabs.transactions.AllTransactionsScreen.amount")}
              valueText={`${formatCurrency(
                convertToFloatCents(
                  transaction?.amount?.toString().replace(/^[-]/, "")
                )
              )}$`}
              valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
              icon={<TransactionAmountIcon />}
            />
            <Hr />
            {(transaction?.category == "deposit" ||
              transaction?.category == "withdraw" ||
              transaction?.category == "transfer") && (
              <>
                <DataRow
                  isPending={isPendingTransaction}
                  keyText={t("tabs.transactions.AllTransactionsScreen.fee")}
                  valueText={`${formatCurrency(
                    convertToFloatCents(
                      transaction?.transaction?.entries[2]?.amount
                      // (transaction?.amount/(1-FEE_PERCENTAGE) * FEE_PERCENTAGE)?.toString().replace(/^[-]/, "")
                    )
                  )}$`}
                  valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
                  icon={<TransactionAmountIcon />}
                />
                <Hr />
              </>
            )}

            <DataRow
              isPending={isPendingTransaction}
              keyText={t(
                "tabs.transactions.AllTransactionsScreen.transactionType"
              )}
              valueText={t(
                `tabs.transactions.AllTransactionsScreen.${transaction?.type}`
              )}
              valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
              icon={<TransactionTypeIcon />}
            />
            {(transaction?.comment) && (
                <>            
            <Hr />
            <DataRow
              isPending={isPendingTransaction}
              keyText={t("tabs.transactions.AllTransactionsScreen.comments")}
              valueText={`${transaction?.transfer_comment}`}
              valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
              icon={<TransactionReferanceIcon />}
            />
            </>
              )}
            <Hr />
            <DataRow
              isPending={isPendingTransaction}
              keyText={t("tabs.transactions.AllTransactionsScreen.referance")}
              valueText={`${transaction?.reference}`}
              valueTextStyle={{ fontSize: 12 }}   // ⬅️ make it 12px
              icon={<TransactionReferanceIcon />}
            />
          </View>
        </ViewShot>
      </BottomSheet>
    );
  }
);
