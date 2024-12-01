import React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useAuthStore } from '../../lib/store';
import { useNavigate } from 'react-router-dom';

export default function ConnectWallet() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isConnected && address) {
      setAuth(address);
      navigate('/dashboard');
    } else {
      clearAuth();
    }
  }, [isConnected, address, setAuth, clearAuth, navigate]);

  return (
    <button
      onClick={() => open()}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg 
                font-semibold text-lg tracking-wide shadow-lg hover:shadow-xl
                hover:from-blue-600 hover:to-purple-600 transform hover:scale-105
                transition-all duration-200 ease-in-out"
    >
      {isConnected ? (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Connected
        </span>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
}