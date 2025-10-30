import { createContext, useState, useEffect, useContext } from "react";
import {
  setAuthenticationHeaders,
  API_BASE_URL,
} from "../api/send-api-request";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { initializeApp } from "@react-native-firebase/app";
// import { firebaseApp } from "../firebaseAuth.js";
// import { getApp, initializeApp } from "@react-native-firebase/app";
import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import { auth } from "../firebaseConfig"
console.log('woooooo')
import {
  useLandingPageData,
  useUserProfile,
} from "@/query-hooks/general-query-hooks";
// if (Platform.OS === "web") {
//   const firebaseConfig = {
//     apiKey: "AIzaSyCuL7OwWxTLjOf57-EB2nT5xHlM7ITgTtU",
//     authDomain: "kafel-dev-1.firebaseapp.com",
//     databaseURL: "https://kafel-dev-1.firebaseio.com",
//     projectId: "kafel-dev-1",
//     storageBucket: "kafel-dev-1.appspot.com",
//     messagingSenderId: "1097669804574",
//     appId: "1:1097669804574:web:c288a4f86a9a9249b5240f",
//     measurementId: "G-QJQLLWWHJC",
//   };

//   try {
//     initializeApp(firebaseConfig);
//   } catch (error) {
//     // Already initialized - safe to ignore
//     if (!/already exists/i.test(error.message)) {
//       console.error("Firebase initialization error", error.stack);
//     }
//   }
// }



const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// const firebaseApp = getApp();

// let auth;
// if (Platform.OS !== "web") {
//   // auth = getAuth();
// } else {
//   auth = getAuth(firebaseApp);;
// }
export const AuthProvider = ({ children }) => {
  // web requires dynamic initialization on web prior to using firebase

  const router = useRouter();

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true); // Add loading state

    const {
    data: profile,
    isPending: isPendingpProfile,
    refetch: refetchProfile,
  } = useUserProfile();

  const [userProfile, setUserProfile] = useState(null);


  useEffect(() => {
    console.log(profile);
    setUserProfile(profile);
  }, [profile]);


  // const handleLogout = async () => {
  //   console.log("log out called")
  //   try {
  //     await auth.signOut();
  //     await AsyncStorage.removeItem("user");
  //     await AsyncStorage.removeItem("token");
  //     setAuthenticationHeaders({ Authorization: "" });
  //     setUser(null);

  //   } catch (error) {
  //     console.error("Error during logout:", error);
  //   }
  // };
  const handleLogout = async () => {
    console.log("log out called")
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
      console.log('Navigating to auth screen...')

      setUser(null);
      router.replace("/(auth)")
      // return <Redirect href="/(auth)" />;
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");

        const userString = await AsyncStorage.getItem("user");
        const storedUser = userString ? JSON.parse(userString) : null;

        if (storedUser && storedToken) {
          setAuthenticationHeaders({
            Authorization: storedToken ? `Bearer ${storedToken}` : "",
          });
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
      }
      setLoading(false); 
    };

    loadUser();
  }, []);


  return (
    <AuthContext.Provider value={{ user, setUser, loading, handleLogout, userProfile, setUserProfile, refetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
