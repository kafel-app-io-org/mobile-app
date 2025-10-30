import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto"; // for URL, TextEncoder/TextDecoder
import SignClient from "@walletconnect/sign-client";
import { getSdkError } from "@walletconnect/utils";
import { Linking } from "react-native";

const WalletConnectContext = createContext(null);

export function WalletConnectProvider({ children }) {
  const [client, setClient] = useState(null);
  const [session, setSession] = useState(null);

  // Lazy initialization of client
  const initClient = async () => {
    if (!client) {
      console.log("Initializing WalletConnect client...");
      let signClient;
      try {
        console.log("Starting SignClient.init...");
        signClient = await SignClient.init({
          projectId: "a1989ed4b574deff5a69f065a4af4538",
          relayUrl: "wss://relay.walletconnect.com",
          metadata: {
            name: "Kafel App",
            description: "Pay with crypto using WalletConnect",
            // url: "https://dev-server.kafel.app/",
            // url: "https://cory-noncollinear-groundably.ngrok-free.dev/",
            url: "https://kafel.xyz",
            // icons: ["https://dev-server.kafel.app//icon.png"],
            // icons: ["https://cory-noncollinear-groundably.ngrok-free.dev//icon.png"],
            icons: ["https://kafel.xyz/icon.png"],
            redirect: {
              // native: "com.kafel.app://",
              native: "kafelapp://",
              // universal: "com.kafel.app",
              // universal: "https://cory-noncollinear-groundably.ngrok-free.dev",
              universal: "https://kafel.xyz",
            },
          },
        });
        console.log("SignClient initialized successfully:", signClient);
        setClient(signClient);
      } catch (err) {
        console.error("SignClient.init failed:", err);
      }

      // Restore previous session if exists
      const storedSession = await AsyncStorage.getItem("walletconnectSession");
      if (storedSession) {
        const restoredSession = JSON.parse(storedSession);
        setSession(restoredSession);
        console.log("Restored previous session:", restoredSession);
      }
      console.log("signClient", signClient);
      return signClient;
    }
    console.log("client", client);

    return client;
  };

  //   const connect = async () => {
  //     const wcClient = await initClient();
  //     if (!wcClient) return;

  //     if (session) {
  //       console.log("Using existing session:", session);
  //       return session;
  //     }

  //     try {
  //       const { uri, approval } = await wcClient.connect({
  //         requiredNamespaces: {
  //           eip155: {
  //             methods: ["eth_sendTransaction", "personal_sign"],
  //             chains: ["eip155:1"], // Mainnet
  //             events: ["accountsChanged", "chainChanged"],
  //           },
  //         },
  //       });

  //       if (uri) {
  //         console.log("Opening wallet with URI:", uri);
  //         // Linking.openURL(`wc:${uri}`);

  //         // Listen for deep link from wallet
  //         const listener = ({ url }) => {
  //           console.log("Wallet redirect received:", url);
  //           Linking.removeAllListeners("url");

  //           // approval() can now safely resolve
  //           approval()
  //             .then((newSession) => {
  //               setSession(newSession);
  //               AsyncStorage.setItem(
  //                 "walletconnectSession",
  //                 JSON.stringify(newSession)
  //               );
  //               console.log("New session established:", newSession);
  //             })
  //             .catch((err) => console.error(err));
  //         };

  //         Linking.addEventListener("url", listener);
  //         Linking.openURL(`wc:${uri}`);
  //       }

  //       console.log("New session established:", session);
  //       return session;
  //     } catch (err) {
  //       console.error("WalletConnect connection error:", err);
  //     }
  //   };
  const connect = async () => {
    const wcClient = await initClient();
    if (!wcClient) return;

    if (session) return session;

    try {
      const { uri, approval } = await wcClient.connect({
        requiredNamespaces: {
          eip155: {
            methods: ["eth_sendTransaction", "personal_sign"],
            chains: ["eip155:1"],
            events: ["accountsChanged", "chainChanged"],
          },
        },
      });

      if (uri) {
        console.log("Opening wallet with URI:", uri);
        Linking.openURL(`wc:${uri}`); // wallet app opens
      }

      const newSession = await approval(); // <-- resolves only when wallet approves
      setSession(newSession);
      await AsyncStorage.setItem(
        "walletconnectSession",
        JSON.stringify(newSession)
      );
      console.log("New session established:", newSession);
      return newSession;
    } catch (err) {
      console.error("WalletConnect connection error:", err);
    }
  };
  const disconnect = async () => {
    if (client && session) {
      await client.disconnect({
        topic: session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
      setSession(null);
      await AsyncStorage.removeItem("walletconnectSession");
      console.log("Disconnected WalletConnect session");
    }
  };

  //   const sendTransaction = async (ethAmount = 0.01) => {
  //     if (!client) {
  //       console.error("WalletConnect client not initialized");
  //       return;
  //     }
  //     if (!session) {
  //       console.error("No active session");
  //       return;
  //     }

  //     try {
  //       const valueInWei =
  //         "0x" + BigInt(Math.floor(Number(ethAmount) * 1e18)).toString(16);

  //       const tx = {
  //         from: session.namespaces.eip155.accounts[0].split(":")[2],
  //         to: "0xEf7A29dbb8B4A72449C3dfD757F9e0Dc724964Cc", // merchant wallet
  //         data: "0x",
  //         gas: "0x5208", // 21000
  //         value: valueInWei,
  //       };

  //       console.log("Sending transaction:", tx);

  //       const result = await client.request({
  //         topic: session.topic,
  //         chainId: "eip155:1",
  //         request: {
  //           method: "eth_sendTransaction",
  //           params: [tx],
  //         },
  //       });

  //       console.log("Transaction hash:", result);
  //       return result;
  //     } catch (err) {
  //       console.error("Transaction error:", err);
  //     }
  //   };
  const sendTransaction = async (ethAmount = 0.01, activeSession = null) => {
    const usedSession = activeSession || session;
    if (!client) {
      console.error("WalletConnect client not initialized");
      return;
    }
    if (!usedSession) {
      console.error("No active session");
      return;
    }

    const valueInWei =
      "0x" + BigInt(Math.floor(Number(ethAmount) * 1e18)).toString(16);

    const tx = {
      from: usedSession.namespaces.eip155.accounts[0].split(":")[2],
      to: "0xEf7A29dbb8B4A72449C3dfD757F9e0Dc724964Cc",
      data: "0x",
      gas: "0x5208", // 21000
      value: valueInWei,
    };

    console.log("Sending transaction:", tx);

    try {
      const result = await client.request({
        topic: usedSession.topic,
        chainId: "eip155:1",
        request: {
          method: "eth_sendTransaction",
          params: [tx],
        },
      });

      console.log("Transaction hash:", result);
      return result;
    } catch (err) {
      console.error("Transaction error:", err);
    }
  };
  return (
    <WalletConnectContext.Provider
      value={{ client, session, connect, disconnect, sendTransaction }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
}

export const useWalletConnect = () => useContext(WalletConnectContext);
