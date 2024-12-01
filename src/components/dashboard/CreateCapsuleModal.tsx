import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUpload, FiLock, FiEye, FiEyeOff, FiChevronDown, FiImage, FiFilm } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { useAccount } from 'wagmi';
import { useTimeCapsuleStore } from '../../store/timeCapsuleStore';
import { CapsuleType } from '../../types/timeCapsule';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

interface CreateCapsuleModalProps {
  onClose: () => void;
}

const CreateCapsuleModal: React.FC<CreateCapsuleModalProps> = ({ onClose }) => {
  const { address } = useAccount();
  const { addCapsule } = useTimeCapsuleStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'message' as CapsuleType,
    unlockDate: '',
    visibility: 'private' as 'public' | 'private',
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setAttachments((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.webm'],
    },
    maxFiles: 5,
  });

  const handleSubmit = async () => {
    try {
      if (!address) throw new Error('Please connect your wallet');
      if (!formData.title) throw new Error('Please enter a title');
      if (!formData.content) throw new Error('Please enter content');
      if (!formData.unlockDate) throw new Error('Please select an unlock date');

      // In a real app, you would upload attachments to IPFS here
      const attachmentUrls = attachments.map((file) => ({
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file),
      }));

      addCapsule({
        ...formData,
        createdBy: address,
        isLocked: true,
        unlockDate: new Date(formData.unlockDate),
        attachments: attachmentUrls,
      });

      toast.success('Time capsule created successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create time capsule');
    }
  };

  const capsuleTypes: Array<{ value: CapsuleType; label: string }> = [
    { value: 'message', label: 'Message' },
    { value: 'memory', label: 'Memory' },
    { value: 'prediction', label: 'Prediction' },
    { value: 'nft', label: 'NFT' },
    { value: 'legacy', label: 'Legacy' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark-900/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white backdrop-blur-xl rounded-lg w-full max-w-2xl overflow-hidden "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-dark-600 flex justify-between items-center relative">
          <motion.div 
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent"
            animate={{
              opacity: [0.5, 1, 0.5],
              scaleX: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-cyber font-bold text-[#D06A48]"
            >
              Create Time Capsule
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-dark-300 text-sm mt-1"
            >
              Step {step} of 2
            </motion.p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-500 rounded-lg transition-all duration-300 text-dark-200 hover:[#D06A48]"
          >
            <FiX className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-cyber text-dark-200 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-mb bg-slate-200 focus:ring-1 focus:ring-gray-600 outline-none
                               text-dark-100 placeholder-dark-400 transition-all duration-300
                               hover:border-neon-blue/50"
                      placeholder="Enter a title for your time capsule"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-cyber text-dark-200 mb-2">Type</label>
                    <div className="relative">
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as CapsuleType })}
                        className="w-full px-4 py-3 rounded-mb bg-slate-200 focus:ring-1 focus:ring-gray-600 outline-none
                               text-dark-100 placeholder-dark-400 transition-all duration-300
                               hover:border-neon-blue/50"
                      >
                        {capsuleTypes.map((type) => (
                          <option key={type.value} value={type.value} className="bg-dark-800">
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-300 pointer-events-none">
                        <FiChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-cyber text-dark-200 mb-2">Content</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-3 rounded-mb bg-slate-200 focus:ring-1 focus:ring-gray-600 outline-none
                               text-dark-100 placeholder-dark-400 transition-all duration-300
                               hover:border-neon-blue/50 min-h-[120px] resize-none"
                      placeholder="Write your message, memory, or prediction..."
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 0 20px rgba(96, 165, 250, 0.3)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-black border  rounded-none
                             text-white  hover:bg-gray-500
                            duration-300 "
                  >
                    Next Step
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Additional Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-cyber text-dark-200 mb-2">Unlock Date</label>
                    <input
                      type="datetime-local"
                      value={formData.unlockDate}
                      onChange={(e) => setFormData({ ...formData, unlockDate: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl
                               focus:ring-2 focus:ring-neon-blue focus:border-transparent outline-none
                               text-dark-100 transition-all duration-300 hover:border-neon-blue/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-cyber text-dark-200 mb-2">Visibility</label>
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, visibility: 'private' })}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                  border transition-all duration-300 font-cyber ${
                          formData.visibility === 'private'
                            ? 'bg-dark-800 border-neon-blue text-neon-blue shadow-neon-glow'
                            : 'bg-dark-700 border-dark-600 text-dark-300 hover:border-neon-blue/50'
                        }`}
                      >
                        <FiLock className="w-4 h-4" />
                        Private
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, visibility: 'public' })}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                  border transition-all duration-300 font-cyber ${
                          formData.visibility === 'public'
                            ? 'bg-dark-800 border-neon-blue text-neon-blue shadow-neon-glow'
                            : 'bg-dark-700 border-dark-600 text-dark-300 hover:border-neon-blue/50'
                        }`}
                      >
                        <FiEye className="w-4 h-4" />
                        Public
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-cyber text-dark-200 mb-2">Attachments</label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300
                                ${isDragActive 
                                  ? 'border-neon-blue bg-dark-700/50' 
                                  : 'border-dark-600 hover:border-neon-blue/50'}`}
                    >
                      <input {...getInputProps()} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <div className="w-12 h-12 mx-auto rounded-xl bg-dark-700 flex items-center justify-center text-dark-300">
                          <FiUpload className="w-6 h-6" />
                        </div>
                        <p className="text-dark-200">
                          {isDragActive ? (
                            "Drop your files here"
                          ) : (
                            "Drag & drop files here or click to select"
                          )}
                        </p>
                        <p className="text-dark-400 text-sm">
                          Supported: Images (PNG, JPG, GIF) and Videos (MP4, WebM)
                        </p>
                      </motion.div>
                    </div>
                    {attachments.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 space-y-2"
                      >
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-dark-300">
                                {file.type.startsWith('image/') ? (
                                  <FiImage className="w-4 h-4" />
                                ) : (
                                  <FiFilm className="w-4 h-4" />
                                )}
                              </div>
                              <span className="text-dark-200 text-sm truncate max-w-[200px]">
                                {file.name}
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setAttachments(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="p-2 hover:bg-dark-600 rounded-lg text-dark-300 hover:text-neon-red transition-colors"
                            >
                              <FiX className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-dark-700 border border-dark-600 rounded-xl
                             text-dark-200 font-cyber hover:border-neon-blue/50
                             transition-all duration-300"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 0 20px rgba(96, 165, 250, 0.3)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-dark-800 border border-neon-blue rounded-xl
                             text-neon-blue font-cyber hover:bg-dark-700
                             transition-all duration-300 shadow-neon-glow"
                  >
                    Create Capsule
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateCapsuleModal;
