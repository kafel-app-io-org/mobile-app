// namespaces.js
// Define what your Dapp requires from the wallet (Ethereum Mainnet)

export const requiredNamespaces = {
  eip155: {
    methods: ["eth_sendTransaction", "personal_sign"],
    chains: ["eip155:1"], // Ethereum mainnet
    events: ["accountsChanged", "chainChanged"],
  },
};