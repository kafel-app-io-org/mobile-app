// payments/usdtConfig.js
export const USDT_DESTS = [
  // 1) Ethereum
  {
    chainId: 1,
    chainName: "Ethereum",
    tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT mainnet
    decimals: 6,
    merchant: "0xF99439cBFbe4A1E96823662805633351220E4099",   //Raed's wallet
  }, 
  // 2) Polygon
  {
    chainId: 137,
    chainName: "Polygon",
    tokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT polygon
    decimals: 6,
    // merchant: "0xYourMerchantOnPolygon...",
  },
  // 3) Arbitrum
  {
    chainId: 42161,
    chainName: "Arbitrum",
    tokenAddress: "0xfd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    decimals: 6,
    // merchant: "0xYourMerchantOnArbitrum...",
  },
  // 4) Base 
  {
    chainId: 8453,
    chainName: "Base",
    tokenAddress: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4", // USDT on Base
    decimals: 6,
    // merchant: "0xYourMerchantOnBase...",
  },
];