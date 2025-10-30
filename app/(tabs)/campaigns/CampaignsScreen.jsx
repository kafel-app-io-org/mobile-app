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
  Keyboard,
  Button,
  TouchableWithoutFeedback,
  I18nManager,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Searchbar } from "react-native-paper";
import SearchIcon from "@/assets/icons/SearchIcon";
import FiltersIcon from "@/assets/icons/FiltersIcon";
import DatePickerIcon from "@/assets/icons/DatePickerIcon";
import NumberHashIcon from "@/assets/icons/NumberHashIcon";
import { LinearGradient } from "expo-linear-gradient";
import { CampaignCard, CampaignCardSkeleton } from "@/components/CampaignCard";
import { useAllCampaigns } from "@/query-hooks/campaigns-query-hooks";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import {
  Dropdown,
  MultiSelect,
  MultiSelectComponent,
} from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { countries } from "../../../scripts/countries";
import {
  useAllOrganizers,
  useTargetBeneficiaries,
} from "@/query-hooks/general-query-hooks";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

const CampaignsScreen = () => {
  const { t } = useTranslation();

  const { data: organizersOptions, isPending: isPendingOrganizersOptions } =
    useAllOrganizers();
  const {
    data: beneficiariesTypesOptions,
    isPending: isPendingBeneficiariesTypesOptions,
  } = useTargetBeneficiaries();

  const countryOptions = countries;

  const filtersSheetRef = useRef(null);
  const isCountryDropdownOpenRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [minNumBen, setMinNumBen] = useState("");
  const [maxNumBen, setMaxNumBen] = useState("");
  const [minTarget, setMinTarget] = useState("");
  const [maxTarget, setMaxTarget] = useState("");
  const [isOneTime, setIsOneTime] = useState(null);
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
    organizers: null,
    beneficiariesTypes: null,
    minNumBen: "",
    maxNumBen: "",
    minTarget: "",
    maxTarget: "",
    isOneTime: null,
  });
  const [tempFilters, setTempFilters] = useState({
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
      if (selectedDate) setTempFromDate(selectedDate);
      else setTempFromDate(new Date());
    } else if (activeField === "to") {
      if (selectedDate) setTempToDate(selectedDate);
      else setTempToDate(new Date());
    }
  };

  const handlePressSelectDate = () => {
    console.log("activeField", activeField);
    if (activeField === "from") {
      setTempFilters((prev) => ({
        ...prev,
        fromDate: tempFromDate,
      }));
    } else if (activeField === "to") {
      console.log("a@@@", tempToDate);
      setTempFilters((prev) => ({
        ...prev,
        toDate: tempToDate,
      }));
    }

    setTimeout(() => {
      console.log("asasas", tempFilters);
    }, 2222);
    setShowPicker(false);
  };

  const handleOnPressCancelSelectDate = () => {
    setShowPicker(false);
  };

  const {
    data: campaigns,
    isPending: isPendingCampaigns,
    refetch,
  } = useAllCampaigns(
    searchQuery,
    filters?.country,
    filters?.fromDate ? filters?.fromDate.toISOString() : undefined,
    filters?.toDate ? filters?.toDate.toISOString() : undefined,
    filters?.organizers,
    filters?.beneficiariesTypes,
    filters?.minNumBen,
    filters?.maxNumBen,
    filters?.minTarget,
    filters?.maxTarget,
    filters?.isOneTime
  );

  useEffect(() => {
    console.log(campaigns);
  }, [campaigns]);

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
    console.log(item.name, tempFilters?.country)
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
  const renderBenTypesItem = (item) => {
    const isSelected = tempFilters?.beneficiariesTypes?.find((o) => o === item.id);

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
  const screenHeight = Dimensions.get("window").height;
  const snapPoint = 95;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", height: "100%" }}>
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          flex: 1,
          backgroundColor: "#fff",
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
              placeholder={t("tabs.campaigns.CampaignsScreen.search")}
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
            {campaigns && Array.isArray(campaigns) && campaigns.length > 0 ? (
              campaigns?.map((c, index) => (
                <CampaignCard key={index} campaignData={c} />
              ))
            ) : !isPendingCampaigns ? (
              <Text
                style={{
                  alignSelf: "center",
                  marginVertical: 40,
                  marginVertical: 40,
                  color: "#333",
                }}
              >
                {t("tabs.campaigns.CampaignsScreen.noCampaigns")}
              </Text>
            ) : null}

            {isPendingCampaigns && (
              <>
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
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
                  {t("tabs.campaigns.CampaignsScreen.reset")}
                </Text>
              </TouchableOpacity>
              <Text style={styles.titel}>
                {t("tabs.campaigns.CampaignsScreen.filter")}
              </Text>
            </View>
            <Hr />
          </View>

          <BottomSheetScrollView contentContainerStyle={styles.sheetContainer}>
            <Text style={styles.label}>
              {t("tabs.campaigns.CampaignsScreen.country")}
            </Text>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.itemsWrapperStyle}
              itemContainerStyle={styles.itemsStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={countryOptions || []}
              search
              maxHeight={200}
              labelField="name"
              valueField="name"
              placeholder={t("tabs.campaigns.CampaignsScreen.selectCountry")}
              searchPlaceholder={t("tabs.campaigns.CampaignsScreen.search")}
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

            <Text style={styles.label}>
              {t("tabs.campaigns.CampaignsScreen.organizer")}
            </Text>
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
                  : t("tabs.campaigns.CampaignsScreen.selectOrganizer")
              }
              searchPlaceholder={t("tabs.campaigns.CampaignsScreen.search")}
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

            <Text style={styles.label}>
              {t("tabs.campaigns.CampaignsScreen.benType")}{" "}
            </Text>
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
                  : t("tabs.campaigns.CampaignsScreen.selectType")
              }
              searchPlaceholder={t("tabs.campaigns.CampaignsScreen.search")}
              value={tempFilters?.beneficiariesTypes}
              visibleSelectedItem={false}
              onChange={(item) => {
                setTempFilters((prev) => ({
                  ...prev,
                  beneficiariesTypes: item,
                }));
              }}
              onFocus={() => {
                isCountryDropdownOpenRef.current = true;
              }}
              onBlur={() => {
                isCountryDropdownOpenRef.current = false;
              }}
              multiple
              mode="DEFAULT"
              renderItem={renderBenTypesItem}
            />

            {/* <View style={{ marginBottom: 2 }}> */}
            <Text style={styles.label}>
              {t("tabs.campaigns.CampaignsScreen.date")}
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => openPicker("from")}
                style={{ flex: 1 }}
              >
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

              <TouchableOpacity
                onPress={() => openPicker("to")}
                style={{ flex: 1 }}
              >
                <View style={styles.inputWithIcon}>
                  <DatePickerIcon />
                  <TextInput
                    // value={toDate ? toDate.toDateString() : ""}
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

            {/* <View style={{ marginBottom: 2 }}> */}
            <Text style={styles.label}>
              {t("tabs.campaigns.CampaignsScreen.numBen")}
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={[styles.inputWithIcon, { flex: 1 }]}>
                <NumberHashIcon />
                <TextInput
                  value={tempFilters?.minNumBen}
                  style={styles.inputField}
                  onChangeText={(text) => {
                    const numericOnly = text.replace(/[^0-9.]/g, ""); // allows numbers and dot
                    // setMinNumBen(numericOnly);
                    setTempFilters((prev) => ({
                      ...prev,
                      minNumBen: numericOnly,
                    }));
                  }}
                  placeholder={t("tabs.campaigns.CampaignsScreen.from")}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputWithIcon, { flex: 1 }]}>
                <NumberHashIcon />
                <TextInput
                  value={tempFilters?.maxNumBen}
                  style={styles.inputField}     
                               onChangeText={(text) => {
                    const numericOnly = text.replace(/[^0-9.]/g, ""); // allows numbers and dot
                    // setMaxNumBen(numericOnly);
                    setTempFilters((prev) => ({
                      ...prev,
                      maxNumBen: numericOnly,
                    }));
                  }}
                  placeholder={t("tabs.campaigns.CampaignsScreen.to")}
                  keyboardType="numeric"
                />
              </View>
            </View>
            {/* </View> */}

            {/* <View style={{ marginBottom: 12 }}> */}
            <Text style={styles.label}>
              {t("tabs.campaigns.CampaignsScreen.target")}
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={[styles.inputWithIcon, { flex: 1 }]}>
                <NumberHashIcon />
                <TextInput
                  value={tempFilters?.minTarget}
                  style={styles.inputField}                  onChangeText={(text) => {
                    const numericOnly = text.replace(/[^0-9.]/g, ""); // allows numbers and dot
                    // setMinTarget(numericOnly);
                    setTempFilters((prev) => ({
                      ...prev,
                      minTarget: numericOnly,
                    }));
                  }}
                  placeholder={t("tabs.campaigns.CampaignsScreen.from")}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputWithIcon, { flex: 1 }]}>
                <NumberHashIcon />
                <TextInput
                  value={tempFilters?.maxTarget}
                  style={styles.inputField}                  onChangeText={(text) => {
                    const numericOnly = text.replace(/[^0-9.]/g, ""); // allows numbers and dot
                    // setMaxTarget(numericOnly);
                    setTempFilters((prev) => ({
                      ...prev,
                      maxTarget: numericOnly,
                    }));
                  }}
                  placeholder={t("tabs.campaigns.CampaignsScreen.to")}
                  keyboardType="numeric"
                />
              </View>
            </View>
            {/* </View> */}

            <View style={{ flexDirection: "row", gap: 70, marginBottom: 12 }}>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={
                  () =>
                    setTempFilters((prev) => ({
                      ...prev,
                      isOneTime: prev?.isOneTime === true ? null : true,
                    }))

                  // setIsOneTime((prev) => (prev === true ? null : true))
                }
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "#78BD2E",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 6,
                  }}
                >
                  {tempFilters?.isOneTime == true && (
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: "#78BD2E",
                      }}
                    />
                  )}
                </View>
                <Text>{t("tabs.campaigns.CampaignsScreen.oneTime")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() =>
                  // setIsOneTime((prev) => (prev === false ? null : false))
                  setTempFilters((prev) => ({
                    ...prev,
                    isOneTime: prev?.isOneTime === false ? null : false,
                  }))
                }
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "#78BD2E",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 6,
                  }}
                >
                  {tempFilters?.isOneTime == false && (
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: "#78BD2E",
                      }}
                    />
                  )}
                </View>
                <Text>{t("tabs.campaigns.CampaignsScreen.monthly")}</Text>
              </TouchableOpacity>
            </View>

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
                        {t("tabs.campaigns.CampaignsScreen.cancel")}
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
                    <TouchableOpacity onPress={handlePressSelectDate}>
                      <Text
                        style={{
                          marginBottom: 16,
                          color: "#000",
                          textAlign: "center",
                          fontSize: 18,
                        }}
                      >
                        {t("tabs.campaigns.CampaignsScreen.select")}
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
                  {t("tabs.campaigns.CampaignsScreen.apply")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </KeyboardAwareScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default CampaignsScreen;

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
    // alignSelf:"flex-start"
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
    // justifyContent: "flex-start",
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
    display: "none",
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
