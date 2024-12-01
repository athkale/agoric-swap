import { createWeb3Modal } from '@web3modal/wagmi/react';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, hardhat } from 'viem/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

// Get projectId at https://cloud.walletconnect.com
const projectId = 'e81f503a854c7cd03cb88213ce45ba67';

// Create custom hardhat chain configuration
const localHardhat = {
  ...hardhat,
  id: 31337,
  name: 'Hardhat Local',
  network: 'hardhat',
  nativeCurrency: {
    name: 'Hardhat Ether',
    symbol: 'hETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
};

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [localHardhat, mainnet],
  [publicProvider()]
);

// Set up connectors
const connectors = [
  new MetaMaskConnector({ chains }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId,
    },
  }),
];

// Create wagmiConfig
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Create modal configuration
const metadata = {
  name: 'XDigi Platform',
  description: 'XDigi Platform Web3 Integration',
  url: typeof window !== 'undefined' ? window.location.origin : '',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Initialize modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': 'Roboto, sans-serif',
    '--w3m-accent-color': '#6366f1',
    '--w3m-bg-color': '#1e1e1e',
    '--w3m-overlay-backdrop-filter': 'blur(5px)',
  }
});
