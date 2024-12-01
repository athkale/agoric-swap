import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

const projectId = 'e81f503a854c7cd03cb88213ce45ba67';

const metadata = {
  name: 'XDigi Platform',
  description: 'Universal Identity Management System',
  url: 'https://XDigi.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, sepolia];

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
});

createWeb3Modal({ wagmiConfig: config, projectId, chains });