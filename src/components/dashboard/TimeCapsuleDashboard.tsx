import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiUnlock, FiClock, FiMessageCircle, FiImage, FiGift, FiPlus } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import { useTimeCapsuleStore } from '../../store/timeCapsuleStore';
import { TimeCapsule, CapsuleType } from '../../types/timeCapsule';
import CreateCapsuleModal from './CreateCapsuleModal';
import { format } from 'date-fns';

const TimeCapsuleDashboard: React.FC = () => {
  const { address } = useAccount();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CapsuleType | 'all'>('all');
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);
  const { capsules, updateCapsule } = useTimeCapsuleStore();
  const [now, setNow] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
      // Check for capsules that need to be unlocked
      capsules.forEach(capsule => {
        if (capsule.isLocked && new Date(capsule.unlockDate) <= new Date()) {
          updateCapsule(capsule.id, { isLocked: false });
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [capsules, updateCapsule]);

  const getTimeRemaining = (unlockDate: Date) => {
    const total = Date.parse(unlockDate.toString()) - now.getTime();
    if (total <= 0) return { expired: true, text: 'Unlocked' };

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    let text = '';
    if (days > 0) text += `${days}d `;
    if (hours > 0 || days > 0) text += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) text += `${minutes}m `;
    text += `${seconds}s`;

    return { expired: false, text };
  };

  const getCapsuleIcon = (type: CapsuleType) => {
    switch (type) {
      case 'message':
        return <FiMessageCircle />;
      case 'memory':
        return <FiImage />;
      case 'prediction':
        return <FiClock />;
      case 'nft':
        return <FiGift />;
      default:
        return <FiLock />;
    }
  };

  const filterTypes = [
    { value: 'all', label: 'All Capsules' },
    { value: 'message', label: 'Messages' },
    { value: 'memory', label: 'Memories' },
    { value: 'prediction', label: 'Predictions' },
    { value: 'nft', label: 'NFTs' },
    { value: 'legacy', label: 'Legacy' },
  ];

  const filteredCapsules = selectedType === 'all' 
    ? capsules
    : capsules.filter(capsule => capsule.type === selectedType);

  const handleCapsuleClick = (capsule: TimeCapsule) => {
    if (!capsule.isLocked) {
      setSelectedCapsule(capsule);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 relative overflow-hidden">
      {/* Animated background effects */}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-7xl mx-auto space-y-8 z-10"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-cyber font-bold text-[#D06A48]"
            >
              Time Capsules
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 mt-2 font-light tracking-wide"
            >
              Secure your memories in the digital vault of tomorrow
            </motion.p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(96, 165, 250, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-black  rounded-none
                     flex items-center gap-3 text-white hover:bg-gray-700
                     font-cyber"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <FiPlus className="w-5 h-5" />
            </motion.div>
            Create Capsule
          </motion.button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200">
          {filterTypes.map((type, index) => (
            <motion.button
              key={type.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 15px rgba(96, 165, 250, 0.3)',
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedType(type.value as any)}
              className={`px-5 py-2.5 rounded-lg font-cyber whitespace-nowrap border transition-all duration-300
                ${selectedType === type.value
                  ? 'bg-gray-300 text-black border-black shadow-md'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-black/50'}`}
            >
              {type.label}
            </motion.button>
          ))}
        </div>

        {/* Capsules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCapsules.map((capsule, index) => {
              const timeRemaining = getTimeRemaining(capsule.unlockDate);
              return (
                <motion.div
                  key={capsule.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: { 
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20
                    }
                  }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: capsule.isLocked 
                      ? '0 0 20px rgba(239, 68, 68, 0.2)'
                      : '0 0 20px rgba(34, 197, 94, 0.2)'
                  }}
                  onClick={() => handleCapsuleClick(capsule)}
                  className={`group relative bg-gray-100 rounded-xl overflow-hidden
                           border transition-all duration-500
                           ${capsule.isLocked 
                             ? 'border-red-300 hover:border-red-500' 
                             : 'border-green-300 hover:border-green-500'}`}
                >
                  {capsule.isLocked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        backdropFilter: 'blur(8px)',
                      }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-gray-200/50 backdrop-blur-sm"
                    />
                  )}
                  
                  <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl"
                      >
                        {capsule.isLocked ? (
                          <div className="relative">
                            <FiLock className="text-red-500" />
                            <motion.div
                              className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                              animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [1, 0.5, 1]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </div>
                        ) : (
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <FiUnlock className="text-green-500" />
                          </motion.div>
                        )}
                      </motion.div>
                      <div className="flex flex-col items-end">
                        <motion.span 
                          animate={{ 
                            opacity: capsule.isLocked ? [1, 0.5, 1] : 1
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: capsule.isLocked ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                          className={`font-cyber text-sm font-medium ${
                            capsule.isLocked ? 'text-red-500' : 'text-green-500'
                          }`}
                        >
                          {timeRemaining.text}
                        </motion.span>
                        <span className="text-xs text-gray-500 font-light">
                          {format(new Date(capsule.unlockDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <motion.h3 
                        className="text-xl font-cyber font-semibold text-black group-hover:text-blue-500 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {capsule.title}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-700 line-clamp-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {capsule.content}
                      </motion.p>
                    </div>

                    <motion.div 
                      className="mt-4 flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className={`p-2 rounded-lg ${
                        capsule.isLocked ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
                      }`}>
                        {getCapsuleIcon(capsule.type)}
                      </div>
                      <span className="text-sm text-gray-700">
                        {capsule.type.charAt(0).toUpperCase() + capsule.type.slice(1)}
                      </span>
                    </motion.div>
                  </div>

                  {/* Hover effect overlay */}
                  <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 
                             bg-gradient-to-r from-transparent via-gray-200/10 to-transparent
                             pointer-events-none transition-opacity duration-500"
                    animate={{
                      backgroundPosition: ['200% 0', '-200% 0'],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateCapsuleModal onClose={() => setIsCreateModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeCapsuleDashboard;
