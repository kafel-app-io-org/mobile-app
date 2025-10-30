// // useWalletKit.js
// // Simple React hook that exposes connect, pay, sessions state.

// import { useEffect, useMemo, useState } from "react";
// import {
//   connectWallet,
//   getActiveSessions,
//   disconnectSession,
//   requestPayment,
//   getClient
// } from "./client";
// import { requiredNamespaces } from "./namespaces";
// import { openWalletDeepLink } from "./client";

// export function useWalletKit() {
//   const [sessions, setSessions] = useState([]);
//   const [connecting, setConnecting] = useState(false);
//   const [lastTxHash, setLastTxHash] = useState(null);
//   const [error, setError] = useState(null);

//   // Load active sessions on mount/focus
//   useEffect(() => {
//     (async () => {
//       try {
//         setSessions(await getActiveSessions());
//       } catch (e) {
//         console.warn(e);
//       }
//     })();
//   }, []);

//   async function connect() {
//     try {
//       setConnecting(true);
//       setError(null);
//       const session = await connectWallet();
//       const all = await getActiveSessions();
//       setSessions(all);
//       return session;
//     } catch (e) {
//       setError(e?.message || "Failed to connect");
//       throw e;
//     } finally {
//       setConnecting(false);
//     }
//   }

  
//    async function payTransaction({ to, valueEth, data }) {
//   const client = await getClient();

//   // Disconnect previous sessions to force wallet prompt
//   const sessions = Object.values(client.session.getAll());
//   for (const s of sessions) {
//     await client.disconnect({
//       topic: s.topic,
//       reason: { code: 6000, message: "Reset session to force approval" },
//     });
//   }

//   try {
//     // Connect & get session (await approval)
//     const { uri, approval } = await client.connect({
//       requiredNamespaces,
//     });

//     if (uri) {
//       await openWalletDeepLink(uri); // e.g., trust://wc?uri=...
//     }

//     const session = await approval(); // Wait for user to approve in wallet

//     // Send the transaction
//     const txHash = await requestPayment({ session, to, valueEth, data });
//     return { success: true, txHash };

//   } catch (error) {
//     // Handle user rejection or failure
//     console.warn("Transaction failed or rejected:", error);
//     return { success: false, error: error.message || "Transaction failed" };
//   }
// }

//   async function pay({ to, valueEth, data }) {
//     setError(null);
//     setLastTxHash(null);

//     // Use the first active session; you could add UI to choose one
//     let session = sessions[0];

//     // If not connected yet, connect first
//     if (!session) {
//       session = await connect();
//     }

//     const txHash = await requestPayment({ session, to, valueEth, data });
//     setLastTxHash(txHash);
//     return txHash;
//   }

//   async function disconnect(topic) {
//     await disconnectSession(topic);
//     setSessions(await getActiveSessions());
//   }

//   return {
//     sessions,
//     connecting,
//     lastTxHash,
//     error,
//     connect,
//     pay,
//     payTransaction,
//     disconnect,
//   };
// }