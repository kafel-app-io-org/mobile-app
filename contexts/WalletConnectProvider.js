// import "react-native-get-random-values";
// import "react-native-url-polyfill/auto";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Linking } from "react-native";
// import SignClient from "@walletconnect/sign-client";

// // Add this at the TOP of your WalletConnect context file

// // import { requiredNamespaces } from "./namespaces";

// if (!global.crypto?.getRandomValues) {
//   throw new Error(
//     "Crypto polyfill not detected! Verify it loads before any WalletConnect code."
//   );
// }

// // Create Context
// const WalletConnectContext = createContext(null);
// const requiredNamespaces = {
//   eip155: {
//     methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
//     chains: ["eip155:1"], // Ethereum mainnet
//     events: ["accountsChanged", "chainChanged"],
//   },
// };

// export function WalletConnectProvider({ children }) {
//   const [client, setClient] = useState(null);
//   const [sessions, setSessions] = useState([]);
//   const [connecting, setConnecting] = useState(false);
//   const [lastTxHash, setLastTxHash] = useState(null);
//   const [error, setError] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     if (!client) return;

//     const handleSessionProposal = async (proposal) => {
//       console.log("Session proposal received:", proposal);
//       // This is where you'd normally show UI for approval
//       // But since we want auto-approval for payments:
//       try {
//         const { acknowledged } = await client.approve({
//           id: proposal.id,
//           namespaces: requiredNamespaces,
//         });
//         console.log("Session approved:", acknowledged);
//       } catch (e) {
//         console.error("Approval error:", e);
//       }
//     };

//     client.on("session_proposal", handleSessionProposal);

//     return () => {
//       client.off("session_proposal", handleSessionProposal);
//     };
//   }, [client]);

//   useEffect(() => {
//     if (!client) return;

//     const handlePairingProposal = async (proposal) => {
//       console.log("Pairing proposal:", proposal);
//       try {
//         await client.approve({ id: proposal.id });
//         console.log("Pairing approved");
//       } catch (e) {
//         console.error("Pairing approval failed:", e);
//       }
//     };

//     client.on("pairing_proposal", handlePairingProposal);

//     return () => {
//       client.off("pairing_proposal", handlePairingProposal);
//     };
//   }, [client]);

//   // Update in connect/disconnect functions
//   // Init SignClient
//   const initClient = async () => {
//     console.log("Initializing WalletConnect client...");

//     if (client) return client;

//     try {
//       console.log("start init client");
//       const c = await SignClient.init({
//         projectId: "c7b7d3b63e266ab15c202cb091806d1f",
//         relayUrl: "wss://relay.walletconnect.com",
//         metadata: {
//           name: "Kafel App",
//           description: "Pay with WalletConnect",
//           url: "https://dev-server.kafel.app/",
//           icons: ["https://dev-server.kafel.app//icon.png"],
//           redirect: {
//             native: "kafelapp://",
//             universal: "https://dev-server.kafel.app/wc",
//           },
//         },
//       });

//       console.log("SignClient initialized successfully:", c);
//       setClient(c);

//       // Load sessions from AsyncStorage
//       const stored = await AsyncStorage.getItem("WC_SESSIONS");
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         setSessions(parsed);
//       }
//       console.log("SignClient instance:", client);

//       return c;
//     } catch (e) {
//       console.error("Failed to initialize client:", e);
//       setError("Failed to initialize WalletConnect client");
//       throw e;
//     }
//   };

//   const saveSessions = async (sessionsArray) => {
//     try {
//       setSessions(sessionsArray);
//       await AsyncStorage.setItem("WC_SESSIONS", JSON.stringify(sessionsArray));
//     } catch (e) {
//       console.error("Failed to save sessions:", e);
//       setError("Failed to save session data");
//     }
//   };

//   const clearSessions = async (c) => {
//     try {
//       const all = Object.values(c.session.getAll());
//       for (const s of all) {
//         try {
//           await c.disconnect({
//             topic: s.topic,
//             reason: { code: 6000, message: "Reset session" },
//           });
//         } catch (e) {
//           console.warn("Failed to disconnect session:", s.topic, e);
//         }
//       }
//       await saveSessions([]);
//     } catch (e) {
//       console.error("Failed to clear sessions:", e);
//       setError("Failed to reset sessions");
//       throw e;
//     }
//   };

//   // Open wallet deep link
//   const openWalletDeepLink = async (uri) => {
//     try {
//       await Linking.openURL(`trust://wc?uri=${encodeURIComponent(uri)}`);
//     } catch (e) {
//       await Linking.openURL(uri); // fallback to raw URI
//     }
//   };

//   // Connect wallet
//   const connect = async () => {
//     setConnecting(true);
//     setError(null);

//     try {
//       const c = await initClient();
//       await clearSessions(c);

//       console.log("Creating new connection...");
//       const { uri, approval } = await c.connect({
//         requiredNamespaces,
//         pairingTopic: undefined, // Ensure new pairing
//       });

//       if (!uri) throw new Error("No connection URI generated");
//       console.log("Connection URI:", uri);

//       // Open wallet
//       try {
//         await Linking.openURL(`wc:${uri}?relay-protocol=irn`);
//       } catch (e) {
//         console.warn("Standard WC link failed, trying others...");
//         await Linking.openURL(`trust://wc?uri=${encodeURIComponent(uri)}`);
//       }

//       // Wait for approval
//       const session = await Promise.race([
//         approval(),
//         new Promise((_, reject) =>
//           setTimeout(() => reject(new Error("Approval timeout")), 45000)
//         ),
//       ]);

//       console.log("New session established:", session);
//       await saveSessions([session]);
//       return session;
//     } catch (e) {
//       console.error("Connection failed:", e);
//       setError(e.message);
//       throw e;
//     } finally {
//       setConnecting(false);
//     }
//   };

//   // Get first account
//   const getFirstEvmAccount = (session) => {
//     const accounts = session?.namespaces?.eip155?.accounts || [];
//     if (!accounts.length) return null;
//     return accounts[0].split(":")[2];
//   };

//   // Convert ETH to hex wei
//   const ethToHexWei = (valueEth) => {
//     try {
//       const value = parseFloat(valueEth);
//       if (isNaN(value) || value < 0) {
//         throw new Error("Invalid ETH amount");
//       }
//       const wei = BigInt(Math.round(value * 1e18));
//       return "0x" + wei.toString(16);
//     } catch (e) {
//       console.error("ETH conversion error:", e);
//       throw new Error("Invalid ETH amount");
//     }
//   };

//   // Pay transaction
//   const pay = async ({ to, valueEth, data }) => {
//     setError(null);
//     setLastTxHash(null);

//     if (!to || !valueEth) {
//       const errMsg = "Recipient address and amount are required";
//       setError(errMsg);
//       throw new Error(errMsg);
//     }

//     try {
//       let session = sessions[0];
//       if (!session) {
//         session = await connect();
//       }

//       const from = getFirstEvmAccount(session);
//       if (!from) throw new Error("No connected account found");

//       const tx = {
//         from,
//         to,
//         value: ethToHexWei(valueEth),
//         ...(data ? { data } : {}),
//       };

//       const txHash = await client.request({
//         topic: session.topic,
//         chainId: "eip155:1",
//         request: {
//           method: "eth_sendTransaction",
//           params: [tx],
//         },
//       });

//       setLastTxHash(txHash);
//       return txHash;
//     } catch (e) {
//       const errMsg = e.message || "Transaction failed";
//       console.error("Transaction error:", e);
//       setError(errMsg);
//       throw new Error(errMsg);
//     }
//   };

//   const validateSession = (session) => {
//     if (!session) return false;
//     if (!session.namespaces?.eip155?.accounts?.length) return false;
//     return true;
//   };
//   // Disconnect a session
//   const disconnect = async (topic) => {
//     if (!client) return;
//     await client.disconnect({
//       topic,
//       reason: { code: 6000, message: "User disconnected" },
//     });
//     const all = Object.values(client.session.getAll());
//     await saveSessions(all);
//   };

//   const value = {
//     sessions,
//     connecting,
//     lastTxHash,
//     error,
//     connect,
//     pay,
//     disconnect,
//   };

//   useEffect(() => {
//     if (!client) return;

//     const onSessionEvent = (event) => {
//       console.log("Session event:", event);
//       // Update sessions when changes occur
//       const all = Object.values(client.session.getAll());
//       saveSessions(all);
//     };

//     client.on("session_event", onSessionEvent);
//     client.on("session_delete", onSessionEvent);

//     return () => {
//       client.off("session_event", onSessionEvent);
//       client.off("session_delete", onSessionEvent);
//     };
//   }, [client]);

//   return (
//     <WalletConnectContext.Provider value={value}>
//       {children}
//     </WalletConnectContext.Provider>
//   );
// }

// export const useWalletConnect = () => useContext(WalletConnectContext);
