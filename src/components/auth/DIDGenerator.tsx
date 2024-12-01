import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Shield } from 'lucide-react';
import { useAuthStore } from '../../lib/store';

export default function DIDGenerator() {
  const { address } = useAccount();
  const { setDID } = useAuthStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDID = async () => {
    if (!address) return;
    
    setIsGenerating(true);
    try {
      // Generate a DID using the user's address
      const did = {
        id: `did:XDigi:${address.toLowerCase()}`,
        controller: address,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        status: 'active' as const,
      };
      
      // In a production environment, this would interact with the blockchain
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDID(did);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-4">
        <Shield className="w-8 h-8 text-blue-400" />
        <h3 className="text-xl font-semibold">Generate Your DID</h3>
      </div>
      <p className="text-gray-400 mb-4">
        Create your decentralized identifier to start using XDigi.
      </p>
      <button
        onClick={generateDID}
        disabled={!address || isGenerating}
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold 
                 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Generate DID'}
      </button>
    </div>
  );
}