import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import sendApiRequest from "../api";
import { useAuth } from "../contexts/AuthContext";

export const queryKeys = {
  allTransactions: () => ["all-transactions"],
  landingPageData: () => ["landing-page-data"],
  allAccounts:() => ["accounts"],
  defaultAccount:() => ["default-account"],
};

export function useAllAccounts(enabled = true) {
    const queryString = [].filter(Boolean).join("&"); // Construct query string based on filters
  
    const data = useQuery({
      queryKey: queryKeys.allAccounts(), // Unique query key for caching
      queryFn: () => sendApiRequest(`withdraw/accounts/?${queryString}`, "GET"), // API call to fetch filtered campaigns
      enabled, // Enable query based on provided flag
    });
  
    return data;
  }

const withdraw = async (data) => {
  return sendApiRequest(`withdraw/`, "POST", undefined, data);
};
export function useWithdraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdraw,
    onError: (err) => console.log("The error", err),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.allTransactions());
      queryClient.invalidateQueries(queryKeys.landingPageData());
      console.log(`Transfer Success`);
    },
  });
}

const submitBank = async (data) => {
  return sendApiRequest(`withdraw/accounts/bank/`, "POST", undefined, data);
};
export function useSubmitBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitBank,
    onError: (err) => console.log("The error", err),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.allAccounts());
      console.log(`Transfer Success`);
    },
  });
}

const submitWallet = async (data) => {
  return sendApiRequest(`withdraw/accounts/crypto/`, "POST", undefined, data);
};
export function useSubmitWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitWallet,
    onError: (err) => console.log("The error", err),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.allAccounts());
      console.log(`Transfer Success`);
    },
  });
}


const deposite = async (data) => {
    return sendApiRequest(`deposit`, "POST", undefined, data);
  };
  export function useDeposite() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deposite,
      onError: (err) => console.log("The error", err),
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.allTransactions());
        queryClient.invalidateQueries(queryKeys.landingPageData());
        console.log(`Transfer Success`);
      },
    });
  }



  export function useDefaultAccount(enabled = true) {
    const queryString = [].filter(Boolean).join("&"); // Construct query string based on filters
  
    const data = useQuery({
      queryKey: queryKeys.defaultAccount(), // Unique query key for caching
      queryFn: () => sendApiRequest(`users/withdraw-method-preference/?${queryString}`, "GET"), // API call to fetch filtered campaigns
      enabled, // Enable query based on provided flag
    });
  
    return data;
  }


  const submitDefaultAccount = async (data) => {
    return sendApiRequest(`users/withdraw-method-preference/`, "POST", undefined, data);
  };
  export function useSubmitDefaultAccount() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: submitDefaultAccount,
      onError: (err) => console.log("The error", err),
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.defaultAccount());
        console.log(`Success`);
      },
    });
  }
  

  