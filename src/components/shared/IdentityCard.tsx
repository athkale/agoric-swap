import React from 'react';
import { Shield } from 'lucide-react';
import { useAccount } from 'wagmi';

export default function IdentityCard() {
  const { address } = useAccount();

  return (
    <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-4">
        <Shield className="w-8 h-8 text-blue-400" />
        <h3 className="text-xl font-semibold">Digital Identity</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-400">Wallet Address</p>
        <p className="font-mono text-sm">{address || 'Not connected'}</p>
      </div>
    </div>
  );
}