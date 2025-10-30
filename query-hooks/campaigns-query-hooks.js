import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import sendApiRequest from "../api";
import { useAuth } from "../contexts/AuthContext";

export const queryKeys = {
  allCampaigns: (
    searchText,
    country,
    fromDate,
    toDate,
    organizers,
    beneficiariesTypes,
    minBeneficiaries,
    maxBeneficiaries,
    minTarget,
    maxTarget,
    isOneTime
  ) => [
    "all-campaigns",
    searchText,
    country,
    fromDate,
    toDate,
    organizers,
    beneficiariesTypes,
    minBeneficiaries,
    maxBeneficiaries,
    minTarget,
    maxTarget,
    isOneTime,
  ],
  allDonations: (
    searchText,
    country,
    campaign,
    organizers,
    beneficiariesTypes,
    fromDate,
    toDate,
    minFund,
    maxFund
  ) => [
    "all-donations",
    country,
    campaign,
    organizers,
    beneficiariesTypes,
    fromDate,
    toDate,
    minFund,
    maxFund,
  ],
  campaignsDetails: (id) => ["campaign-details" + id],
  campaignsBeneficiaries: (id) => ["campaign-beneficiaries" + id],
  allTransactions: () => ["all-transactions"],
  landingPageData: () => ["landing-page-data"],
};

const isEmpty = (value) => {
  return value === undefined || value === null || value.length === 0;
};

export function useAllCampaigns(
  searchText,
  country,
  fromDate,
  toDate,
  organizers,
  beneficiariesTypes,
  minBeneficiaries,
  maxBeneficiaries,
  minTarget,
  maxTarget,
  isOneTime
) {
  console.log("organizers", organizers);
  const searchString = !isEmpty(searchText) ? `searchValue=${searchText}` : "";
  const countryString = !isEmpty(country) ? `country=${country}` : "";
  const fromString = !isEmpty(fromDate) ? `fromDate=${fromDate}` : "";
  const toString = !isEmpty(toDate) ? `toDate=${toDate}` : "";
  const minBeneficiariesString = !isEmpty(minBeneficiaries)
    ? `minBeneficiaries=${minBeneficiaries}`
    : "";
  const maxBeneficiariesString = !isEmpty(maxBeneficiaries)
    ? `maxBeneficiaries=${maxBeneficiaries}`
    : "";
  const minTargetString = !isEmpty(minTarget) ? `minTarget=${minTarget}` : "";
  const maxTargetString = !isEmpty(maxTarget) ? `maxTarget=${maxTarget}` : "";
  const isOneTimeString = !isEmpty(isOneTime) ? `isOneTime=${isOneTime}` : "";
  const organizersString = !isEmpty(organizers)
    ? `organizers=${organizers}`
    : "";
  const beneficiariesTypesString = !isEmpty(beneficiariesTypes)
    ? `beneficiariesTypes=${beneficiariesTypes}`
    : "";
  const queryString = [
    searchString,
    countryString,
    fromString,
    toString,
    minBeneficiariesString,
    maxBeneficiariesString,
    minTargetString,
    maxTargetString,
    isOneTimeString,
    organizersString,
    beneficiariesTypesString,
  ]
    .filter(Boolean)
    .join("&"); // Construct query string based on parameter s

  console.log("queryString: ", queryString);
  const data = useQuery({
    queryKey: queryKeys.allCampaigns(
      searchText,
      country,
      fromDate,
      toDate,
      organizers,
      beneficiariesTypes,
      minBeneficiaries,
      maxBeneficiaries,
      minTarget,
      maxTarget,
      isOneTime
    ), // Unique query key for caching
    queryFn: () => sendApiRequest(`campaigns/?${queryString}`, "GET"), // API call to fetch filtered campaigns
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  return data;
}
export function useCampaignDetails(id, enabled = true) {
  const queryString = [].filter(Boolean).join("&"); // Construct query string based on filters
  const data = useQuery({
    queryKey: queryKeys.campaignsDetails(id), // Unique query key for caching
    queryFn: () => sendApiRequest(`campaigns/${id}`, "GET"), // API call to fetch filtered campaigns
    enabled, // Enable query based on provided flag
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  return data;
}

export function useDonationBenDistribution(id, enabled = true) {
  const queryString = [].filter(Boolean).join("&"); // Construct query string based on filters
  const data = useQuery({
    queryKey: queryKeys.campaignsBeneficiaries(id), // Unique query key for caching
    queryFn: () =>
      sendApiRequest(
        `donations/${id}/distributions`,
        "GET"
      ), // API call to fetch filtered campaigns
    enabled, // Enable query based on provided flag
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  return data;
}

const donateCampaign = async (data) => {
  return sendApiRequest(`donations/`, "POST", undefined, data);
};
export function useDonateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: donateCampaign,
    onError: (err) => console.log("The error", err),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries(queryKeys.allTransactions());
      queryClient.invalidateQueries(queryKeys.landingPageData());
      queryClient.invalidateQueries(
        queryKeys.campaignsDetails(variables?.campaign_id)
      );
      console.log(`donate Success`);
    },
  });
}

export function useAllDonations(
  searchText,
  country,
  campaign,
  organizers,
  beneficiariesTypes,
  fromDate,
  toDate,
  minFund,
  maxFund
) {
  const searchString = !isEmpty(searchText) ? `searchValue=${searchText}` : "";
  const countryString = !isEmpty(country) ? `country=${country}` : "";
  const campaignString = !isEmpty(campaign) ? `campaignId=${campaign}` : "";
  const fromString = !isEmpty(fromDate) ? `fromDate=${fromDate}` : "";
  const toString = !isEmpty(toDate) ? `toDate=${toDate}` : "";
  const minFundString = !isEmpty(minFund) ? `minAmount=${minFund}` : "";
  const maxFundString = !isEmpty(maxFund) ? `maxAmount=${maxFund}` : "";
  const organizersString = !isEmpty(organizers)
    ? `organizers=${organizers}`
    : "";
  const beneficiariesTypesString = !isEmpty(beneficiariesTypes)
    ? `beneficiariesTypes=${beneficiariesTypes}`
    : "";

    const queryString = [
      searchString,
      countryString,
      campaignString,
      fromString,
      toString,
      minFundString,
      maxFundString,
      organizersString,
      beneficiariesTypesString,
    ]
      .filter(Boolean)
      .join("&"); // Construct query string based on parameter s
  
  const data = useQuery({
    queryKey: queryKeys.allDonations(
      searchText,
      country,
      campaign,
      organizers,
      beneficiariesTypes,
      fromDate,
      toDate,
      minFund,
      maxFund
    ), // Unique query key for caching
    queryFn: () => sendApiRequest(`donations/?${queryString}`, "GET"), // API call to fetch filtered campaigns
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  return data;
}
