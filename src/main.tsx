import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './lib/wagmi';
import { queryClient } from './lib/queryClient';
import App from './App';
import './index.css';

// Initialize React Query and Wagmi before rendering
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

// Wrap the app with error boundary
const AppWithProviders = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
          <App />
        </WagmiConfig>
      </QueryClientProvider>
    </StrictMode>
  );
};

root.render(<AppWithProviders />);
