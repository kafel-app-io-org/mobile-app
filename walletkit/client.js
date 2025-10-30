// // client.js (Dapp-side)
// // Minimal Dapp flow using WalletConnect Sign Client (via Reown stack)
// // Your app: starts a session, deep-links to MetaMask, then requests a tx.

// import "@walletconnect/react-native-compat"; // polyfills FIRST
// import { Linking, Platform } from "react-native";
// import SignClient from "@walletconnect/sign-client";
// import { requiredNamespaces } from "./namespaces";

// // Keep a single client instance
// let _client = null;

// /** Initialize Sign Client */
// export async function getClient() {
//   if (_client) return _client;
//   console.log("Initializing WalletConnect client...");
//   _client = await SignClient.init({
//     projectId: "c7b7d3b63e266ab15c202cb091806d1f", // put in your .env
//     relayUrl: "wss://relay.walletconnect.com",
//     metadata: {
//       name: "My RN Dapp",
//       description: "Pay with WalletConnect",
//       url: "https://example.com",
//       icons: ["https://example.com/icon.png"],
//     },
    
//   });
//   console.log("SignClient initialized successfully:", signClient);
//   return _client;
// }

// /** Open the wallet app with the wc URI (MetaMask deep link). */
// export async function openWalletDeepLink(uri) {
//   // MetaMask Mobile deep link format:
//   // const metamask = `metamask://wc?uri=${encodeURIComponent(uri)}`;

//   // iOS can also try universal link if you prefer (commented):
//   // const metamaskUniversal = `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
//   // Linking.openURL(`wc:${uri}`)
//   Linking.openURL(`trust://wc?uri=${encodeURIComponent(uri)}`);

// }

// /** Connect to a wallet:
//  * - creates a pairing URI
//  * - deep-links into MetaMask
//  * - waits for approval and returns the session
//  */
// export async function connectWallet() {
//   const client = await getClient();

//    // Disconnect any previous sessions to force the wallet prompt
//   const sessions = Object.values(client.session.getAll());
//   for (const s of sessions) {
//     await client.disconnect({
//       topic: s.topic,
//       reason: { code: 6000, message: "Reset session to force approval" },
//     });
//   }
  
//   const { uri, approval } = await client.connect({
//     requiredNamespaces,
//   });

//   if (uri) {
//     console.log('uri: ', uri)
//     console.log("Opening wallet with URI:", uri);
//     await openWalletDeepLink(uri);
//   }

//   // Wait until user approves in wallet
//   const session = await approval();
//   return session;
// }

// /** Get all active sessions */
// export async function getActiveSessions() {
//   const client = await getClient();
//   return Object.values(client.session.getAll());
// }

// /** Disconnect a session */
// export async function disconnectSession(topic) {
//   const client = await getClient();
//   await client.disconnect({
//     topic,
//     reason: { code: 6000, message: "User disconnected" },
//   });
// }

// /** Helper: extract EVM address from a session (first account) */
// export function getFirstEvmAccount(session) {
//   // CAIP-10 format: "eip155:1:0xABC..."
//   const accounts = session?.namespaces?.eip155?.accounts || [];
//   if (!accounts.length) return null;
//   const parts = accounts[0].split(":");
//   return parts[2] || null;
// }

// /** Convert ETH (string/number) to hex Wei for JSON-RPC */
// export function ethToHexWei(valueEth) {
//   // Accept string or number (e.g., "0.01")
//   const [whole = "0", frac = ""] = String(valueEth).split(".");
//   const fracPadded = (frac + "000000000000000000").slice(0, 18); // 18 decimals
//   const weiStr = `${whole}${fracPadded}`.replace(/^0+/, "") || "0";
//   const wei = BigInt(weiStr);
//   return "0x" + wei.toString(16);
// }

// /** Request a simple ETH payment via eth_sendTransaction
//  *  params: { session, to, valueEth, data? }
//  */
// export async function requestPayment({ session, to, valueEth, data }) {
//   const client = await getClient();
//   const from = getFirstEvmAccount(session);
//   if (!from) throw new Error("No connected account found.");

//   const tx = {
//     from,
//     to,
//     value: ethToHexWei(valueEth),
//     ...(data ? { data } : {}),
//   };

//   // Use Ethereum mainnet (eip155:1) here; adjust if you target another chain
//   const chainId = "eip155:1";

//   const txHash = await client.request({
//     topic: session.topic,
//     chainId,
//     request: {
//       method: "eth_sendTransaction",
//       params: [tx],
//     },
//   });

//   return txHash;
// }