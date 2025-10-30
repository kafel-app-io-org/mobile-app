import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import sendApiRequest from "../api";
import { useAuth } from "../contexts/AuthContext";

export const queryKeys = {
  landingPageData: () => ["landing-page-data"],
  allOrganizers: () => ["all-organizers"],
  targetBeneficiaries: () => ["target-beneficiaries"],
  allNotifications: () => ["all-notifications"],
  userProfile: () => ["user-profile"],
};

const firebaseAuth = async (data) => {
  console.log(data);
  return sendApiRequest(`auth/firebase-login/`, "POST", undefined, data);
};
export function useFirebaseAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: firebaseAuth,
    onError: (err) => console.log("The error", err),
    onSuccess: () => {
      console.log(`Token Recived`);
    },
  });
}

export function useLandingPageData(enabled = true) {
  const queryString = [].filter(Boolean).join("&"); // Construct query string based on filters

  const data = useQuery({
    queryKey: queryKeys.landingPageData(), // Unique query key for caching
    queryFn: () => sendApiRequest(`landing-page/?${queryString}`, "GET"), // API call to fetch filtered campaigns
    enabled, // Enable query based on provided flag
    //keepPreviousData: true, // Keep previous data while fetching new data
  });

  return data;
}

export function useAllOrganizers(enabled = true) {
  const queryString = [].filter(Boolean).join("&"); // Construct query string based on filters
  const data = useQuery({
    queryKey: queryKeys.allOrganizers(), // Unique query key for caching
    queryFn: () => sendApiRequest(`users/organizes/?${queryString}`, "GET"), // API call to fetch filtered campaigns
    // enabled, // Enable query based on provided flag
    keepPreviousData: true, // Keep previous data while fetching new data
  });
  return data;
}
export function useTargetBeneficiaries(enabled = true) {
  const queryString = [].filter(Boolean).join("&"); // Construct query string based on filters

  const data = useQuery({
    queryKey: queryKeys.targetBeneficiaries(), // Unique query key for caching
    queryFn: () => sendApiRequest(`target-beneficiaries/?${queryString}`, "GET"), // API call to fetch filtered campaigns
    // enabled, // Enable query based on provided flag
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  return data;
}
export function useAllNotifications() {
  const queryString = [].filter(Boolean).join("&"); // Construct query string based on filters

  const data = useQuery({
    queryKey: queryKeys.allNotifications(), // Unique query key for caching
    queryFn: () => sendApiRequest(`notifications/?${queryString}`, "GET"), // API call to fetch filtered campaigns
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  return data;
}

export function useAllFees() {
  const queryString = [].filter(Boolean).join("&"); // Construct query string based on filters

  const data = useQuery({
    queryKey: queryKeys.allNotifications(), // Unique query key for caching
    queryFn: () => sendApiRequest(`fee-percentage/?${queryString}`, "GET"), // API call to fetch filtered campaigns
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  return data;
}
// /notifications/mark-read


const readNotification = async (data) => {
  return sendApiRequest(`notifications/mark-read/`, "POST", undefined, data);
};
export function useReadNotification() {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: readNotification, 
    onError: (err) => console.log("The error", err),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.allNotifications()); 
    },
  });
}

export function useUserProfile() {
  const queryString = [].filter(Boolean).join("&"); // Construct query string based on filters

  const data = useQuery({
    queryKey: queryKeys.userProfile(), // Unique query key for caching
    queryFn: () => sendApiRequest(`users/profile/?${queryString}`, "GET"), // API call to fetch filtered campaigns
    // 👇 Prevent caching:
    cacheTime: 0,       // Remove from cache immediately after unused
    staleTime: 0,       // Always considered stale → triggers fetch
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    keepPreviousData: false, // Optional: avoid flicker, or set true if needed
    });

  return data;
}

const updateUserProfile = async (data) => {
  return sendApiRequest(`users/profile/`, "PATCH", undefined, data);
};
export function useUpdateUserProfile() {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: updateUserProfile, 
    onError: (err) => console.log("The error", err),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.userProfile()); 
    },
  });
}
const updateUserProfileMultiPart = async (data) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  return sendApiRequest(`users/profile/`, "PATCH", undefined, data, headers);

};
export function useUpdateUserProfileMultiPart() {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: updateUserProfileMultiPart, 
    onError: (err) => console.log("The error", err),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.userProfile()); 
    },
  });
}

