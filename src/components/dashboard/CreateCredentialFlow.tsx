import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiCheck, FiLock, FiShield } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { useCredentialStore, Credential } from '../../store/credentialStore';
import toast from 'react-hot-toast';

interface CreateCredentialFlowProps {
  onClose: () => void;
}

const steps = [
  {
    id: 'did',
    title: 'Create Your DID',
    description: 'Generate a unique, secure decentralized identifier.',
    icon: <FiLock className="w-6 h-6" />,
  },
  {
    id: 'details',
    title: 'Enter Credentials',
    description: 'Provide your credential details securely.',
    icon: <FiUpload className="w-6 h-6" />,
  },
  {
    id: 'verify',
    title: 'Verify',
    description: 'Verify your credentials on the blockchain.',
    icon: <FiCheck className="w-6 h-6" />,
  },
  {
    id: 'secure',
    title: 'Stay Secure',
    description: 'Your credentials are now securely stored.',
    icon: <FiShield className="w-6 h-6" />,
  },
];

export const CreateCredentialFlow: React.FC<CreateCredentialFlowProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [credentialData, setCredentialData] = useState({
    name: '',
    type: 'student',
    description: '',
    // Additional fields based on type will be added dynamically
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxFiles: 1,
  });

  const handleNextStep = async () => {
    if (currentStep === steps.length - 1) {
      // Final step - create credential
      try {
        // Here you would typically:
        // 1. Upload image to IPFS or your storage solution
        // 2. Create DID if not exists
        // 3. Sign credential with DID
        // 4. Store on blockchain
        setIsVerifying(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate blockchain verification
        toast.success('Credential created and verified successfully!');
        onClose();
      } catch (error) {
        toast.error('Failed to create credential');
      } finally {
        setIsVerifying(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={() => onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 p-6 rounded-xl w-full max-w-2xl m-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center w-1/4 ${
                  index <= currentStep ? 'text-purple-400' : 'text-gray-500'
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: index === currentStep ? 1.2 : 1,
                    color: index <= currentStep ? '#A78BFA' : '#6B7280',
                  }}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2"
                >
                  {step.icon}
                </motion.div>
                <p className="text-sm font-medium text-center">{step.title}</p>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-700 w-full rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-purple-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-400">
                {steps[currentStep].description}
              </p>

              {/* Step-specific content */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
                             transition-colors ${
                               isDragActive
                                 ? 'border-purple-500 bg-purple-500/10'
                                 : 'border-gray-600 hover:border-purple-500/50'
                             }`}
                  >
                    <input {...getInputProps()} />
                    {previewUrl ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white">Click or drag to change image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8">
                        <FiUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-400">
                          Drag & drop an image here, or click to select
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Credential Details Form */}
                  <input
                    type="text"
                    placeholder="Credential Name"
                    value={credentialData.name}
                    onChange={e => setCredentialData({ ...credentialData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-white/10 
                             focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                  <textarea
                    placeholder="Description"
                    value={credentialData.description}
                    onChange={e => setCredentialData({ ...credentialData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-white/10 
                             focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{
                      rotate: isVerifying ? 360 : 0,
                    }}
                    transition={{
                      duration: 1,
                      repeat: isVerifying ? Infinity : 0,
                      ease: 'linear',
                    }}
                  >
                    <FiCheck className="w-12 h-12 text-purple-500" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-700">
          <button
            onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentStep === 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-white hover:bg-white/10'
            }`}
            disabled={currentStep === 0}
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            disabled={isVerifying}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg 
                     font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50
                     disabled:cursor-not-allowed flex items-center"
          >
            {isVerifying ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                />
                Verifying...
              </>
            ) : currentStep === steps.length - 1 ? (
              'Finish'
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
