import React from 'react';
import { Credential } from '../../types/did';
import { Shield, Calendar, User, Check } from 'lucide-react';

interface CredentialCardProps {
  credential: Credential;
}

export default function CredentialCard({ credential }: CredentialCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="font-semibold">{credential.type}</h3>
            <p className="text-sm text-gray-400">Issued by {credential.issuer}</p>
          </div>
        </div>
        <Check className="w-5 h-5 text-green-400" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Calendar className="w-4 h-4" />
          <span>Issued: {new Date(credential.issuanceDate).toLocaleDateString()}</span>
        </div>
        {credential.expirationDate && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Expires: {new Date(credential.expirationDate).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <User className="w-4 h-4" />
          <span>Holder: {credential.holder.slice(0, 6)}...{credential.holder.slice(-4)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <button className="w-full px-4 py-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
          View Details
        </button>
      </div>
    </div>
  );
}