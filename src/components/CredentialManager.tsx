import React, { useState, useEffect } from 'react';
import { useCredentialContract } from '../hooks/useCredentialContract';
import { Loader2, Shield, Key, CheckCircle, XCircle, Wallet, UserPlus } from 'lucide-react';

export const CredentialManager: React.FC = () => {
  const { 
    loading, 
    error, 
    createCredential, 
    revokeCredential, 
    verifyCredential, 
    addNewIssuer,
    isIssuer,
    address, 
    isConnected, 
    connect 
  } = useCredentialContract();

  const [issuer, setIssuer] = useState('');
  const [holder, setHolder] = useState('');
  const [schema, setSchema] = useState('');
  const [data, setData] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newIssuerAddress, setNewIssuerAddress] = useState('');

  useEffect(() => {
    if (address) {
      setIssuer(address);
    }
  }, [address]);

  const handleAddIssuer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      await connect();
      return;
    }
    setIsProcessing(true);
    try {
      await addNewIssuer(newIssuerAddress);
      alert('Issuer added successfully!');
      setNewIssuerAddress('');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to add issuer');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      await connect();
      return;
    }

    if (!isIssuer) {
      alert('Your address is not authorized to issue credentials. Please get authorized first.');
      return;
    }

    setIsProcessing(true);
    try {
      const id = await createCredential(issuer, holder, schema, data);
      setCredentialId(id);
      setVerificationResult(null);
      alert('Credential created successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to create credential');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevokeCredential = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    if (!isIssuer) {
      alert('Your address is not authorized to revoke credentials.');
      return;
    }

    setIsProcessing(true);
    try {
      await revokeCredential(credentialId);
      setVerificationResult(null);
      alert('Credential revoked successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to revoke credential');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyCredential = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    setIsProcessing(true);
    try {
      const result = await verifyCredential(credentialId);
      setVerificationResult(result);
      alert('Credential verified successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to verify credential');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8">Credential Manager</h2>

      {!isConnected ? (
        <button
          onClick={connect}
          className="flex items-center justify-center gap-2 w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Wallet className="w-5 h-5" />
          Connect Wallet
        </button>
      ) : (
        <>
          {!isIssuer && (
            <div className="mb-8 p-4 bg-yellow-100/10 border border-yellow-400 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-400" />
                Become an Issuer
              </h3>
              <form onSubmit={handleAddIssuer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your address (needs to be added by an existing issuer):
                  </label>
                  <input
                    type="text"
                    value={address || ''}
                    readOnly
                    className="w-full p-2 bg-black/20 border border-gray-600 rounded-lg"
                  />
                </div>
              </form>
            </div>
          )}

          {isIssuer && (
            <div className="mb-8 p-4 bg-green-100/10 border border-green-400 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-green-400" />
                Add New Issuer
              </h3>
              <form onSubmit={handleAddIssuer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Issuer Address:
                  </label>
                  <input
                    type="text"
                    value={newIssuerAddress}
                    onChange={(e) => setNewIssuerAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full p-2 bg-black/20 border border-gray-600 rounded-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                  Add Issuer
                </button>
              </form>
            </div>
          )}

          <div className="space-y-8">
            <form onSubmit={handleCreateCredential} className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Create Credential
              </h3>
              <div>
                <label className="block text-sm font-medium mb-2">Issuer:</label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="w-full p-2 bg-black/20 border border-gray-600 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Holder:</label>
                <input
                  type="text"
                  value={holder}
                  onChange={(e) => setHolder(e.target.value)}
                  className="w-full p-2 bg-black/20 border border-gray-600 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Schema:</label>
                <input
                  type="text"
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                  className="w-full p-2 bg-black/20 border border-gray-600 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Data:</label>
                <textarea
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full p-2 bg-black/20 border border-gray-600 rounded-lg"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !isIssuer}
                className="flex items-center justify-center gap-2 w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Key className="w-5 h-5" />
                )}
                Issue Credential
              </button>
            </form>

            {credentialId && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Credential ID:</label>
                  <input
                    type="text"
                    value={credentialId}
                    readOnly
                    className="w-full p-2 bg-black/20 border border-gray-600 rounded-lg"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleVerifyCredential}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 flex-1 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Verify
                  </button>
                  <button
                    onClick={handleRevokeCredential}
                    disabled={isProcessing || !isIssuer}
                    className="flex items-center justify-center gap-2 flex-1 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    Revoke
                  </button>
                </div>
              </div>
            )}

            {verificationResult && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Verification Result:</h4>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(verificationResult, null, 2)}
                </pre>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-500">{error.message}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
