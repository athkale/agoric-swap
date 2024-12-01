import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiCheck, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { makeCapTP, E } from '@agoric/captp';
import { makeNetworkConnection } from '@agoric/sdk';

interface CredentialFormProps {
  onClose?: () => void;
}

export const CredentialForm: React.FC<CredentialFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'academic',
    recipient: '',
    chains: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableChains] = useState([
    { id: 'agoric-1', name: 'Agoric Mainnet' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'bsc', name: 'Binance Smart Chain' },
    { id: 'polygon', name: 'Polygon' },
  ]);

  // Connect to Agoric network
  useEffect(() => {
    const connectToAgoric = async () => {
      try {
        // Connect to the local Agoric instance
        const { connectionHandler, dispatch } = makeNetworkConnection('ws://127.0.0.1:8000');
        const { bootstrap: bootP } = makeCapTP('CredentialApp', dispatch, connectionHandler);
        
        // Get the Zoe service
        const boot = await bootP;
        const zoe = await E(boot).getZoe();
        
        // Get the credential contract instance
        const bundle = await E(boot).getBundle();
        const installation = await E(zoe).install(bundle);
        const { creatorFacet, publicFacet } = await E(zoe).startInstance(installation);
        
        setContract({ creatorFacet, publicFacet });
        setIsConnected(true);
        
        toast.success('Connected to Agoric network');
      } catch (error) {
        console.error('Failed to connect to Agoric:', error);
        toast.error('Failed to connect to Agoric network');
      }
    };

    connectToAgoric();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChainToggle = (chainId: string) => {
    setFormData(prev => ({
      ...prev,
      chains: prev.chains.includes(chainId)
        ? prev.chains.filter(id => id !== chainId)
        : [...prev.chains, chainId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please wait for Agoric connection');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create credential data
      const credentialData = {
        ...formData,
        issuedAt: new Date().toISOString(),
      };

      // Issue credential using Agoric contract
      const result = await E(contract.creatorFacet).issueCredential(
        'self', // issuer address
        credentialData,
        'signature', // would be actual signature in production
        formData.chains,
      );

      // Show success animation
      toast.custom((t) => (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-dark-800 text-white p-4 rounded-lg shadow-neon-glow border border-neon-green flex items-center gap-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="bg-neon-green/20 p-2 rounded-full"
          >
            <FiCheck className="w-5 h-5 text-neon-green" />
          </motion.div>
          <div className="flex flex-col">
            <div className="font-semibold">Credential Created!</div>
            <div className="text-sm text-dark-200">
              ID: {result.credentialId.slice(0, 8)}...
            </div>
          </div>
        </motion.div>
      ), {
        duration: 5000,
      });

      // Close form or redirect
      if (onClose) {
        onClose();
      } else {
        navigate('/dashboard/credentials');
      }
    } catch (error) {
      console.error('Error creating credential:', error);
      toast.error('Failed to create credential. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800/50 backdrop-blur-xl rounded-xl p-6 border border-dark-600 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:20px_20px] opacity-10" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-cyber font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Create Cross-Chain Credential
          </h2>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg bg-dark-700 text-dark-300 hover:text-neon-red transition-colors"
            >
              <FiX className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Connection Status */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-neon-green' : 'bg-neon-red'}`} />
            <span className="text-dark-200">
              {isConnected ? 'Connected to Agoric' : 'Connecting to Agoric...'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-dark-700/50 border border-dark-600 text-white 
                         focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                placeholder="e.g., Bachelor's Degree in Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-dark-700/50 border border-dark-600 text-white 
                         focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                placeholder="Brief description of the credential..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Recipient Address</label>
              <input
                type="text"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-dark-700/50 border border-dark-600 text-white 
                         focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all
                         font-mono"
                placeholder="agoric1..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-dark-700/50 border border-dark-600 text-white 
                         focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
              >
                <option value="academic">Academic</option>
                <option value="professional">Professional</option>
                <option value="certification">Certification</option>
                <option value="award">Award</option>
              </select>
            </div>

            {/* Chain Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Verify On Chains
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableChains.map(chain => (
                  <motion.button
                    key={chain.id}
                    type="button"
                    onClick={() => handleChainToggle(chain.id)}
                    className={`p-3 rounded-lg border ${
                      formData.chains.includes(chain.id)
                        ? 'border-neon-blue bg-neon-blue/10 text-white'
                        : 'border-dark-600 bg-dark-700/50 text-dark-300'
                    } transition-all flex items-center gap-2`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiLink className="w-4 h-4" />
                    {chain.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple 
                     text-white font-medium shadow-neon-glow relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting || !isConnected}
          >
            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />

            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  Issue Credential
                </>
              )}
            </span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
