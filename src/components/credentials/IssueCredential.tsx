import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { useAccount } from 'wagmi';

interface IssueCredentialProps {
  onClose: () => void;
}

export default function IssueCredential({ onClose }: IssueCredentialProps) {
  const { address } = useAccount();
  const { addCredential } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    issuer: '',
    claims: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setIsLoading(true);
    try {
      // In production, this would interact with a blockchain
      const credential = {
        id: `cred:${Math.random().toString(36).slice(2)}`,
        type: formData.type,
        issuer: formData.issuer,
        holder: address,
        issuanceDate: new Date().toISOString(),
        claims: JSON.parse(formData.claims),
        proof: {
          type: 'EcdsaSecp256k1Signature2019',
          created: new Date().toISOString(),
          proofPurpose: 'assertionMethod',
          verificationMethod: 'did:example:123#key-1',
        },
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      addCredential(credential);
      onClose();
    } catch (error) {
      console.error('Error issuing credential:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Issue New Credential</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Credential Type</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Academic Degree"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Issuer</label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., University Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Claims (JSON)</label>
            <textarea
              value={formData.claims}
              onChange={(e) => setFormData(prev => ({ ...prev, claims: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder='{"degree": "Bachelor of Science", "field": "Computer Science"}'
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold 
                     hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Issuing...' : 'Issue Credential'}
          </button>
        </form>
      </div>
    </div>
  );
}