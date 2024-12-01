// This file is deprecated as we've moved to Web3.js
// Please use useCredentialContract.ts instead

import { useState } from "react";

export const useAgoricContract = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  console.warn('useAgoricContract is deprecated. Please use useCredentialContract instead.');
  
  return {
    isConnected,
    connect: () => {
      console.warn('Agoric integration has been replaced with Web3.js');
      return Promise.resolve(false);
    },
    disconnect: () => {
      console.warn('Agoric integration has been replaced with Web3.js');
      setIsConnected(false);
    }
  };
};
