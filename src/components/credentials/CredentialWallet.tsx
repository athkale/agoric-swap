import React from 'react';
import { useAuthStore } from '../../lib/store';
import { Shield, Plus, Check, Eye } from 'lucide-react';
import CredentialCard from './CredentialCard';
import IssueCredential from './IssueCredential';

export default function CredentialWallet() {
  const { credentials } = useAuthStore();
  const [isIssuing, setIsIssuing] = React.useState(false);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold">Credential Wallet</h2>
          </div>
          <button
            onClick={() => setIsIssuing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Credential
          </button>
        </div>

        {credentials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No credentials yet. Add your first credential to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map((credential) => (
              <CredentialCard key={credential.id} credential={credential} />
            ))}
          </div>
        )}
      </div>

      {isIssuing && (
        <IssueCredential onClose={() => setIsIssuing(false)} />
      )}
    </div>
  );
}