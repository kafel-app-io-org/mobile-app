import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  TextInput,
  Platform,
  Modal,
  Button,
  I18nManager
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Searchbar } from "react-native-paper";
import SearchIcon from "@/assets/icons/SearchIcon";
import FiltersIcon from "@/assets/icons/FiltersIcon";
import DatePickerIcon from "@/assets/icons/DatePickerIcon";
import NumberHashIcon from "@/assets/icons/NumberHashIcon";

import { LinearGradient } from "expo-linear-gradient";

import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Dropdown,
  MultiSelect,
  MultiSelectComponent,
} from "react-native-element-dropdown";
import {
  CampaignDonationCard,
  CampaignDonationCardSkeleton,
} from "@/components/CampaignDonationCard";
import {
  useAllDonations,
  useAllCampaigns,
} from "@/query-hooks/campaigns-query-hooks";
import {
  useAllOrganizers,
  useTargetBeneficiaries,
} from "@/query-hooks/general-query-hooks";
import { countries } from "../../../scripts/countries";
import { useTranslation } from "react-i18next";

import DateTimePicker from "@react-native-community/datetimepicker";
const DonationHistoryScreen = () => {
  const { t } = useTranslation();

  const { data: organizersOptions, isPending: isPendingOrganizersOptions } =
    useAllOrganizers();
  const {
    data: beneficiariesTypesOptions,
    isPending: isPendingBeneficiariesTypesOptions,
  } = useTargetBeneficiaries();
  const { data: campaignsOptions, isPending: isPendingCampaignsOptions } =
    useAllCampaigns();

  const countryOptions = countries;

  const filtersSheetRef = useRef(null);
  const isCountryDropdownOpenRef = useRef(false);
  const isCampaignDropdownOpenRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [campaign, setCampaign] = useState("");
  const [minFund, setMinFund] = useState("");
  const [maxFund, setMaxFund] = useState("");
  const [country, setCountry] = useState("");
  const [organizers, setOrganizers] = useState([]);
  const [beneficiariesTypes, setBeneficiariesTypes] = useState([]);

  const [fromDate, setFromDate] = useState(new Date(0));
  const [toDate, setToDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState("date");
  const [activeField, setActiveField] = useState(null);

  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    country: "",
    campaign: "",
    organizers: null,
    beneficiariesTypes: null,
    minFund: "",
    maxFund: "",
  });
  const [tempFilters, setTempFilters] = useState({
    fromDate: null,
    toDate: null,
    country: "",
    campaign: "",
    organizers: null,
    beneficiariesTypes: null,
    minFund: "",
    maxFund: "",
  });

  const [tempFromDate, setTempFromDate] = useState(null);
  const [tempToDate, setTempToDate] = useState(null);

  const openPicker = (field) => {
    if (activeField === "from") {
      setTempFromDate(new Date());
    } else if (activeField === "to") {
      setTempToDate(new Date());
    }
    setActiveField(field);
    setShowPicker(true);
  };

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
  const {
    data: donations,
    isPending: isPendingDonations,
    refetch,
  } = useAllDonations(
    searchQuery,
    filters?.country,
    filters?.campaign,
    filters?.organizers,
    filters?.beneficiariesTypes,
    filters?.fromDate ? filters?.fromDate.toISOString() : undefined,
    filters?.toDate ? filters?.toDate.toISOString() : undefined,
    filters?.minFund,
    filters?.maxFund
  );

  useEffect(() => {
    console.log(donations);
  }, [donations]);

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

  const renderCountriesItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.name}</Text>
        {item.name === tempFilters?.country && (
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
  const renderOrganizersItem = (item) => {
    const isSelected = tempFilters?.organizers?.find((o) => o === item.id);

    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.name}</Text>
        {isSelected && (
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
  const renderCampaignsItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.title}</Text>
        {item.id === tempFilters?.campaign && (
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

  const handleOnPressFilters = () => {
    filtersSheetRef.current?.expand();
  };

  const handleOnPressResetFilters = () => {
    setTempFilters({
      fromDate: null,
      toDate: null,
      country: "",
      organizers: null,
      beneficiariesTypes: null,
      minNumBen: "",
      maxNumBen: "",
      minTarget: "",
      maxTarget: "",
      isOneTime: null,
    });
    setFilters({
      fromDate: null,
      toDate: null,
      country: "",
      organizers: null,
      beneficiariesTypes: null,
      minNumBen: "",
      maxNumBen: "",
      minTarget: "",
      maxTarget: "",
      isOneTime: null,
    });
    filtersSheetRef.current?.close();
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    filtersSheetRef.current?.close();
  };

  // variables
  const data = useMemo(
    () =>
      Array(60)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    filtersSheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    filtersSheetRef.current?.close();
  }, []);

  // render
  const renderItem = useCallback(
    (item) => (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", height: "100%" }}>
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          flex: 1,
          backgroundColor: "#fff",
          height: Dimensions.get("window").height,
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
            //  paddingBottom:200,
          }}
        >
          <View style={styles.sectionHeader}>
            <Searchbar
              placeholder={t("tabs.menu.DonationHistoryScreen.search")}
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

          <View style={{ display: "flex", gap: 10, paddingBottom: 60 }}>
            {donations && Array.isArray(donations) && donations?.length > 0 ? (
              donations?.map((d, index) => (
                <CampaignDonationCard key={index} donation={d} />
              ))
            ) : !isPendingDonations ? (
              <Text
                style={{
                  alignSelf: "center",
                  marginVertical: 40,
                  marginVertical: 40,
                  color: "#333",
                }}
              >
                No Donations Records to Show
              </Text>
            ) : null}

            {isPendingDonations && (
              <>
                <CampaignDonationCardSkeleton />
                <CampaignDonationCardSkeleton />
                <CampaignDonationCardSkeleton />
                <CampaignDonationCardSkeleton />
                <CampaignDonationCardSkeleton />
                <CampaignDonationCardSkeleton />
                <CampaignDonationCardSkeleton />
                <CampaignDonationCardSkeleton />
              </>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
      {/* Bottom Sheet */}

      <BottomSheet
        ref={filtersSheetRef}
        index={-1}
        snapPoints={useMemo(() => ["80%", "100%"], [])}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <KeyboardAwareScrollView
          style={{
            flex: 1,
            backgroundColor: "#fff",
            // height: Dimensions.get("window").height,
          }}
          // extraScrollHeight={100}
          enableOnAndroid={true}
        >
          <View style={styles.sheetHeader}>
            <View
              style={{
                alignItems: "center",
                position: "relative",
                marginBottom: 0,
              }}
            >
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
                  {t("tabs.menu.DonationHistoryScreen.reset")}
                </Text>
              </TouchableOpacity>
              <Text style={styles.titel}>{t("tabs.menu.DonationHistoryScreen.filter")}</Text>
            </View>
            <Hr />
          </View>

          <BottomSheetScrollView contentContainerStyle={styles.sheetContainer}>
            <Text style={styles.label}>{t("tabs.menu.DonationHistoryScreen.campaign")}</Text>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.itemsWrapperStyle}
              itemContainerStyle={styles.itemsStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={campaignsOptions || []}
              search
              maxHeight={200}
              labelField="title"
              valueField="id"
              placeholder={t("tabs.menu.DonationHistoryScreen.selectCampaign")}
              searchPlaceholder={t("tabs.menu.DonationHistoryScreen.search")}
              value={tempFilters?.campaign}
              onChange={(item) => {
                if (tempFilters?.campaign == item.id)
                  setTempFilters((prev) => ({ ...prev, campaign: "" }));
                else setTempFilters((prev) => ({ ...prev, campaign: item.id }));
              }}
              onFocus={() => {
                isCampaignDropdownOpenRef.current = true;
              }}
              onBlur={() => {
                isCampaignDropdownOpenRef.current = false;
              }}
              renderItem={renderCampaignsItem}
            />

            <Text style={styles.label}>{t("tabs.menu.DonationHistoryScreen.country")}</Text>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.itemsWrapperStyle}
              itemContainerStyle={styles.itemsStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={countryOptions}
              search
              maxHeight={200}
              labelField="name"
              valueField="name"
              placeholder={t("tabs.menu.DonationHistoryScreen.selectCountry")}
              searchPlaceholder={t("tabs.menu.DonationHistoryScreen.search")}
              value={tempFilters?.country}
              onChange={(item) => {
                if (tempFilters?.country == item.name)
                  setTempFilters((prev) => ({ ...prev, country: "" }));
                else
                  setTempFilters((prev) => ({ ...prev, country: item.name }));
              }}
              onFocus={() => {
                isCountryDropdownOpenRef.current = true;
              }}
              onBlur={() => {
                isCountryDropdownOpenRef.current = false;
              }}
              renderItem={renderCountriesItem}
            />

            <Text style={styles.label}>{t("tabs.menu.DonationHistoryScreen.organizer")}</Text>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.itemsWrapperStyle}
              itemContainerStyle={styles.itemsStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={organizersOptions || []}
              search
              maxHeight={200}
              labelField="name"
              valueField="id"
              placeholder={
                tempFilters?.organizers?.length > 0
                  ? organizersOptions
                      ?.filter((opt) =>
                        tempFilters?.organizers.includes(opt.id)
                      )
                      .map((opt) => opt.name)
                      .join(", ")
                  : t("tabs.menu.DonationHistoryScreen.selectOrganizer")
              }
              searchPlaceholder={t("tabs.menu.DonationHistoryScreen.search")}
              value={tempFilters?.organizers}
              visibleSelectedItem={false}
              onChange={(item) => {
                setTempFilters((prev) => ({ ...prev, organizers: item }));
              }}
              onFocus={() => {
                isCountryDropdownOpenRef.current = true;
              }}
              onBlur={() => {
                isCountryDropdownOpenRef.current = false;
              }}
              multiple
              mode="DEFAULT"
              renderItem={renderOrganizersItem}
            />

            <Text style={styles.label}>{t("tabs.menu.DonationHistoryScreen.benType")}</Text>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.itemsWrapperStyle}
              itemContainerStyle={styles.itemsStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={beneficiariesTypesOptions || []}
              search
              maxHeight={200}
              labelField="name"
              valueField="id"
              placeholder={
                tempFilters?.beneficiariesTypes?.length > 0
                  ? beneficiariesTypesOptions
                      ?.filter((opt) =>
                        tempFilters?.beneficiariesTypes.includes(opt.id)
                      )
                      .map((opt) => opt.name)
                      .join(", ")
                  : t("tabs.menu.DonationHistoryScreen.selectType")
              }
              searchPlaceholder={t("tabs.menu.DonationHistoryScreen.search")}
              value={tempFilters?.beneficiariesTypes}
              visibleSelectedItem={false}
              onChange={(item) => {
                setTempFilters((prev) => ({
                  ...prev,
                  beneficiariesTypes: item,
                }));
              }}
              multiple
              mode="DEFAULT"
              renderItem={renderOrganizersItem}
            />

            {/* <View style={{ marginBottom: 2 }}> */}
              <Text style={styles.label}>{t("tabs.menu.DonationHistoryScreen.date")}</Text>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={() => openPicker("from")}
                  style={{ flex: 1 }}
                >
                  <View style={styles.inputWithIcon}>
                    <DatePickerIcon />
                    <TextInput
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

                <TouchableOpacity
                  onPress={() => openPicker("to")}
                  style={{ flex: 1 }}
                >
                  <View style={styles.inputWithIcon}>
                    <DatePickerIcon />
                    <TextInput
                      value={
                        tempFilters?.toDate
                          ? tempFilters?.toDate.toDateString()
                          : ""
                      }
                      placeholder="DAY MMM DD YYYY"
                      editable={false}
                      pointerEvents="none"
                      style={{ fontSize: 16 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            {/* </View> */}

            {/* <View style={{ marginBottom: 12 }}> */}
              <Text style={styles.label}>{t("tabs.menu.DonationHistoryScreen.fundAmount")}</Text>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={[styles.inputWithIcon, { flex: 1 }]}>
                  {/* <NumberHashIcon /> */}
                  <TextInput
                    value={tempFilters?.minFund}
                    style={styles.inputField}
                    onChangeText={(text) => {
                      const numericOnly = text.replace(/[^0-9.]/g, ""); // allows numbers and dot
                      setTempFilters((prev) => ({
                        ...prev,
                        minFund: numericOnly,
                      }));
                    }}
                    placeholder={t("tabs.menu.DonationHistoryScreen.from")}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputWithIcon, { flex: 1 }]}>
                  {/* <NumberHashIcon /> */}
                  <TextInput
                    value={tempFilters?.maxFund}
                    style={styles.inputField}
                    onChangeText={(text) => {
                      const numericOnly = text.replace(/[^0-9.]/g, ""); // allows numbers and dot
                      setTempFilters((prev) => ({
                        ...prev,
                        maxFund: numericOnly,
                      }));
                    }}
                    placeholder={t("tabs.menu.DonationHistoryScreen.to")}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            {/* </View> */}

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
                        {t("tabs.menu.DonationHistoryScreen.cancel")}
                      </Text>
                    </TouchableOpacity>

                    <View style={{ backgroundColor: "white", height: 200 }}>
                      <DateTimePicker
                        value={
                          activeField === "from"
                            ? fromDate || new Date()
                            : toDate || new Date()
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
                        {t("tabs.menu.DonationHistoryScreen.select")}
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
                <Text style={styles.buttonText}>{t("tabs.menu.DonationHistoryScreen.apply")}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </KeyboardAwareScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default DonationHistoryScreen;

const styles = StyleSheet.create({
  container: {
    // marginTop: 60,
    // paddingTop: Platform.OS === 'ios' ? 80 : 30,
    backgroundColor: "#fff",
    height: "100%",
    // paddingHorizontal: 16,
    marginBottom: 100,
  },
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
  sectionTitle: {
    color: "#202226",
    fontSize: 18,
    fontWeight: 700,
  },
  seeAllBtn: {
    color: "#838383",
    fontSize: 14,
    fontWeight: 600,
  },
  searchBar: {
    width: "95%",
    backgroundColor: "transparent",
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
  titel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#242B42",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#242B42",
    marginBottom: 4,
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
  inputField: {
    fontSize: 16,
    width: "80%",
    textAlign: I18nManager.isRTL ? "right" : "left",
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
  sheetHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    // gap: 10,
  },
  sheetContainer: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 80,
  },
  sectionTitle: {
    color: "#202226",
    fontSize: 18,
    fontWeight: 700,
  },
  seeAllBtn: {
    color: "#838383",
    fontSize: 14,
    fontWeight: 600,
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
    marginVertical: 16,
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E6E9ED",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    height: 48,
    // marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    textAlign: Platform.OS === 'ios'
    ? (I18nManager.isRTL ? 'left' : 'right')
    : "auto"
  },
  placeholderStyle: {
    fontSize: 16,
    textAlign:
      Platform.OS === "ios" ? (I18nManager.isRTL ? "left" : "right") : "auto",
  },
  selectedTextStyle: {
    fontSize: 16,
    textAlign:
      Platform.OS === "ios" ? (I18nManager.isRTL ? "left" : "right") : "auto",
  },
  iconStyle: {
    width: 20,
    height: 20,
    display:"none"
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.41,
    elevation: 2,
  },
});

const Hr = () => <View style={styles.hr} />;
