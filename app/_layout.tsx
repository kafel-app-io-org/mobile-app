import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Linking } from "react-native";
import "react-native-reanimated";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
// import { WalletConnectProvider } from "../contexts/WalletConnectProvider";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getApp, initializeApp } from "@react-native-firebase/app";
import { Platform,
          KeyboardAvoidingView, 
          ScrollView,
          SafeAreaView,
 } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableWithoutFeedback, Keyboard } from "react-native";

import "@walletconnect/react-native-compat";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, arbitrum } from "@wagmi/core/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createAppKit,
  defaultWagmiConfig,
  AppKit,
} from "@reown/appkit-wagmi-react-native";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
// const projectId = "c7b7d3b63e266ab15c202cb091806d1f";
const projectId = "a1989ed4b574deff5a69f065a4af4538";
const metadata = {
  name: "Kafel App",
  description: "Pay with Crypto",
  // url: "https://dev-server.kafel.app/",
  // url: "https://cory-noncollinear-groundably.ngrok-free.dev/",
  url: "https://kafel.xyz",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
  redirect: {
    native: "kafelapp://",
    // universal: "https://dev-server.kafel.app/",
    // universal: "https://cory-noncollinear-groundably.ngrok-free.dev/",
    universal: "https://kafel.xyz/",
  },
};
//             universal: "https://dev-server.kafel.app/wc",

const chains = [mainnet, polygon, arbitrum] as const;
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createAppKit({
  projectId,
  metadata,
  wagmiConfig,
  defaultChain: mainnet, // Optional
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  debug: true,
});

function LayoutSelector() {
  const { user, loading } = useAuth();
  if (loading) {
    return null;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="(menu)" options={{ headerShown: false }} /> */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  // useEffect(() => {
  //   const handleDeepLink = ({ url }) => {
  //     if (url?.startsWith("kafelapp://")) {
  //       console.log("Received WalletConnect redirect:", url);
  //       // Handle WalletConnect session approval
  //     }
  //   };

  //   // Listen for incoming links
  //   Linking.addEventListener("url", handleDeepLink);

  //   // Check if app was opened from a deep link
  //   Linking.getInitialURL().then((url) => {
  //     if (url) handleDeepLink({ url });
  //   });

  //   return () => {
  //     Linking.removeAllListeners("url");
  //   };
  // }, []);

  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // by RSR
    <SafeAreaView style={{ flex: 1, backgroundColor: "#53f3e6ff" }}>
        <KeyboardAvoidingView
          style={{ flexGrow: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            // contentContainerStyle={{ flexGrow: 1, padding: 16 }}
            contentContainerStyle={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <GestureHandlerRootView>
              <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <QueryClientProvider client={queryClient}>
                  <WagmiProvider config={wagmiConfig}>
                    <AuthProvider>
                      <TouchableWithoutFeedback
                        onPress={Keyboard.dismiss}
                        accessible={false}
                      >
                        <LayoutSelector />
                      </TouchableWithoutFeedback>
                      <StatusBar style="auto" />
                    </AuthProvider>
                    <AppKit />
                  </WagmiProvider>
                </QueryClientProvider>
              </ThemeProvider>
            </GestureHandlerRootView>
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
  );
}
