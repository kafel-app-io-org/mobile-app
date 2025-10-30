import queryString from "query-string";
import ApiError from "./ApiError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebaseConfig";
import { Alert } from "react-native";
import { router, Redirect } from "expo-router";

let authenticationHeaders = {};

// export const API_BASE_URL = "http://localhost:3000";
// export const API_BASE_URL = "http://35.159.41.243";
// export const API_BASE_URL = "https://dev-server.kafel.app";
export const API_BASE_URL = "https://kafel.xyz";
// export const API_BASE_URL = "https://cory-noncollinear-groundably.ngrok-free.dev"
export const PLAY_STORE_BASE_URL = "https://play.google.com/store/apps/details?id=com.kafel.app";
export const APP_STORE_BASE_URL = "https://apps.apple.com/us/app/google-chrome/id535886823"; // replace with real App Store ID
export const APP_BASE_SCHEME = "kafelapp"; // must match app.json -> "scheme"

export function setAuthenticationHeaders(value) {
  authenticationHeaders = value;
}
export function getAuthenticationHeaders() {
  return authenticationHeaders;
}




const handleLogout = async () => {
  console.log("log out called");
  setUser(null);
  try {
    // await auth.signOut();
    const currentUser = auth.currentUser;
    if (currentUser) {
      await auth.signOut();
    } else {
      console.warn("No user is currently signed in.");
    }

    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    setAuthenticationHeaders({ Authorization: "" });
    setUser(null);
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    console.log("Navigating to auth screen...");
    setUser(null);
    router.replace("/(auth)");
    // return <Redirect href="/(auth)" />;
  }
};

const loadUser = async () => {
  const storedToken = await AsyncStorage.getItem("token");
  const userString = await AsyncStorage.getItem("user");

  const storedUser = userString ? JSON.parse(userString) : null;

  if (storedUser && storedToken) {
    // Set authentication headers
    setAuthenticationHeaders({
      ["Authorization"]: storedToken ? "Bearer " + storedToken : "",
    });
  }
};

export default async function sendApiRequest(
  path,
  method,
  query,
  body,
  headers = {},
  options = {},
  url
) {
  loadUser();
  const baseUrl = url ? url : API_BASE_URL;
  const fetchUrl = queryString.stringifyUrl({
    query,
    url: baseUrl + "/" + path,
  });

  headers = {
    ...authenticationHeaders,
    "Content-Type": "application/json",
    ...headers,
    accept: "*/*",
  };

  let requestBody;
  if (body instanceof FormData) {
    delete headers["Content-Type"];
    requestBody = body;
  } else {
    requestBody = body !== undefined ? JSON.stringify(body) : undefined;
  }

  let response;
  try {
    response = await fetch(fetchUrl, {
      body: requestBody,
      method,
      mode: "cors",
      headers: {
        ...headers,
      },
    });
    console.log("response: ", response);
    console.log(`${method} Request on: ${fetchUrl}, 
      Headers: ${headers}, 
      Body: ${requestBody}, 
      `);
    console.log(method, fetchUrl);
    console.log(headers);
    console.log(requestBody);
    if (response.status === 401 && user) {
      console.error("Error status:", response.status);
      handleLogout();
      Alert.alert(
        "Session Expired",
        "Your session has expired, please log in again!",
        [
          {
            text: "OK",
            onPress: () => {
              // Your function here
              router.replace("/(auth)");
              // return <Redirect href="/(auth)" />;
            },
          },
        ],
        { cancelable: false }
      );
      return response.status;
    }
    if (
      response.status === 404 ||
      response.status === 403 ||
      response.status === 400 ||
      response.status === 500
    ) {
      console.error("Error status:", response.status);
      console.log("response", response);
      return response.status;
    }

    if (!response.ok) {
      throw new ApiError(
        response.statusText,
        response.status,
        await response.text()
      );
    }

    const isJsonResponse = response.headers
      .get("content-type")
      ?.toLowerCase()
      .includes("application/json");

    const parsedResponse = isJsonResponse
      ? await response.json()
      : await response.text();
    return parsedResponse;
  } catch (error) {
    console.error("Network request failed:", error);
    throw new ApiError("Network error", error.message);
  }
}
