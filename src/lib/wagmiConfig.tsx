import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia, polygon, polygonAmoy } from "wagmi/chains";

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const metadata = {
  name: "Agoric Swap",
  description:
    "Your Secure Gateway to Seamless Crypto Management Across All Chains** 🚀🔐",
  url: "https://safeconnect.vercel.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
const chains = [mainnet, sepolia, polygon, polygonAmoy] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  auth: {
    email: true,
    socials: ["github", "google"],
    walletFeatures: false,
  },
});
