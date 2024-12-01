import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiCheck, FiX, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCredentialStore } from '../../store/credentialStore';
import { CreateCredentialFlow } from '../../components/dashboard/CreateCredentialFlow';

export const Credentials: React.FC = () => {
  const [isCreateFlowOpen, setIsCreateFlowOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const { credentials, deleteCredential } = useCredentialStore();

  const handleDeleteCredential = (id: string) => {
    deleteCredential(id);
    toast.success('Credential deleted successfully');
  };

  const handleVerifyCredential = async (id: string) => {
    // Here you would typically:
    // 1. Fetch the credential from blockchain
    // 2. Verify the signature
    // 3. Check revocation status
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate verification
    toast.success('Credential verified successfully');
  };

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case 'student':
        return '🎓';
      case 'employee':
        return '💼';
      case 'developer':
        return '💻';
      case 'business':
        return '🏢';
      default:
        return '📄';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Credentials
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateFlowOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg 
                   flex items-center gap-2 hover:from-blue-600 hover:to-purple-600 
                   transition-colors shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Create Credential
        </motion.button>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {credentials.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-gray-400 text-lg">
                No credentials yet. Create your first credential to get started.
              </p>
            </motion.div>
          ) : (
            credentials.map((credential) => (
              <motion.div
                key={credential.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-xl bg-slate-800/50 backdrop-blur-xl 
                         border border-white/10 hover:border-purple-500/50 transition-all duration-300
                         hover:shadow-lg hover:shadow-purple-500/10"
              >
                {/* Card Header with Image */}
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  {credential.imageUrl ? (
                    <img
                      src={credential.imageUrl}
                      alt={credential.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {getCredentialIcon(credential.type)}
                    </div>
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                               transition-opacity flex items-center justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleVerifyCredential(credential.id)}
                      className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                    >
                      <FiCheck className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteCredential(credential.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedCredential(credential.id)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                    >
                      <FiDownload className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 
                                   transition-colors line-clamp-1">
                        {credential.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1 capitalize">{credential.type}</p>
                    </div>
                  </div>

                  {/* Credential Details */}
                  <div className="mt-4 space-y-2">
                    {'institution' in credential && (
                      <p className="text-sm text-gray-400">
                        🏫 {credential.institution}
                      </p>
                    )}
                    {'company' in credential && (
                      <p className="text-sm text-gray-400">
                        🏢 {credential.company}
                      </p>
                    )}
                    {'skills' in credential && (
                      <p className="text-sm text-gray-400">
                        💻 {credential.skills.slice(0, 2).join(', ')}
                        {credential.skills.length > 2 && '...'}
                      </p>
                    )}
                    {'companyName' in credential && (
                      <p className="text-sm text-gray-400">
                        🏢 {credential.companyName}
                      </p>
                    )}
                  </div>

                  {/* Issue Date */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-500">
                      Issued on {credential.issueDate}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Create Credential Flow */}
      <AnimatePresence>
        {isCreateFlowOpen && (
          <CreateCredentialFlow onClose={() => setIsCreateFlowOpen(false)} />
        )}
      </AnimatePresence>

      {/* Credential Details Modal */}
      <AnimatePresence>
        {selectedCredential && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setSelectedCredential(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 p-6 rounded-xl w-full max-w-lg m-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Credential Details</h2>
                <button
                  onClick={() => setSelectedCredential(null)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {/* Add credential details here */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
