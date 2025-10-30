import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import sendApiRequest from "../api";
import { useAuth } from "../contexts/AuthContext";

export const queryKeys = {
  allTransactions: (searchText, type, from, to) => ["all-transactions", searchText, type, from, to],
  transactionsDetails: (id) => ["transactions-details" + id],
  landingPageData: () => ["landing-page-data"],
  transactionsDetails: (id) => ["transactions-details", id],

};

const isEmpty = value => {
  return value === undefined || value === null || value.length === 0;
};

// export function useAllTransactions(searchText, type, from, to) {
//   const searchString = !isEmpty(searchText) ? `searchValue=${searchText}` : '';
//   const typeString = !isEmpty(type) ? `transactionType=${type}` : '';
//   const fromString = !isEmpty(from) ? `fromDate=${from}` : '';
//   const toString = !isEmpty(to) ? `toDate=${to}` : '';
//   const queryString = [searchString, typeString, fromString, toString]
//     .filter(Boolean)
//     .join('&'); // Construct query string based on parameter s

//     console.log(queryString)
//   const data = useQuery({
//     queryKey: queryKeys.allTransactions(searchText, type, from, to), // Unique query key for caching
//     queryFn: () => sendApiRequest(`transfers/?${queryString}`, "GET"), // API call to fetch filtered campaigns
//     keepPreviousData: true, // Keep previous data while fetching new data
//   });

//   return data;
// }
export function useAllTransactions(searchText, type="all", from, to) {
  
  const searchString = !isEmpty(searchText) ? `searchValue=${searchText}` : '';
  const typeString = !isEmpty(type) ? `category=${type}` : '';
  const fromString = !isEmpty(from) ? `fromDate=${from}` : '';
  const toString = !isEmpty(to) ? `toDate=${to}` : '';
  const queryString = [searchString, typeString, fromString, toString]
    .filter(Boolean)
    .join('&'); // Construct query string based on parameter s

    console.log(queryString)
  const data = useQuery({
    queryKey: queryKeys.allTransactions(searchText, type, from, to), // Unique query key for caching
    queryFn: () => sendApiRequest(`transactions/?${queryString}`, "GET"), // API call to fetch filtered campaigns
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  return data;
}

export function useTransationDetails(id) {
  const data = useQuery({
    queryKey: queryKeys.transactionsDetails(id), // Unique query key for caching
    queryFn: () => sendApiRequest(`transactions/${id}`, "GET"), // API call to fetch filtered campaigns
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  return data;
}


const transferTransaction = async (data) => {
  return sendApiRequest(`transfers/`, "POST", undefined, data);
};
export function useTransferTransaction() { 
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: transferTransaction, 
    onError: (err) => console.log("The error", err),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.allTransactions()); 
      queryClient.invalidateQueries(queryKeys.landingPageData()); 
      console.log(`Transfer Success`); 
    },
  });
}

// const withdraw = async (data) => {
//   return sendApiRequest(`withdrawal/`, "POST", undefined, data);
// };
// export function useWithdraw() {
//   const queryClient = useQueryClient(); 
//   return useMutation({
//     mutationFn: withdraw, 
//     onError: (err) => console.log("The error", err),
//     onSuccess: () => {
//       queryClient.invalidateQueries(queryKeys.allTransactions()); 
//       queryClient.invalidateQueries(queryKeys.landingPageData()); 
//       console.log(`Transfer Success`); 
//     },
//   });
// }

// export function useTransationDetails(id, enabled = true) {
//   const queryString = [].filter(Boolean).join("&"); // Construct query string based on filters
//   const data = useQuery({
//     queryKey: queryKeys.transactionsDetails(id), // Unique query key for caching
//     queryFn: () => sendApiRequest(`transactions/${id}`, "GET"), // API call to fetch filtered campaigns
//     enabled, // Enable query based on provided flag
//     keepPreviousData: true, // Keep previous data while fetching new data
//   });

//   return data;
// }
