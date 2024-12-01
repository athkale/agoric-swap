import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useDisconnect } from 'wagmi';
import {
  FiHome,
  FiUser,
  FiKey,
  FiMenu,
  FiX,
  FiLogOut,
  FiClock,
  FiBox,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AgoricCredentialSystem } from './AgoricCredentialSystem';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const menuItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: FiHome,
      gradient: '',
    },
    {
      name: 'Time Capsules',
      href: '/dashboard/time-capsules',
      icon: FiClock,
      gradient: '',
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: FiUser,
      gradient: '',
    },
    {
      name: 'Credentials',
      href: '/dashboard/credentials',
      icon: FiKey,
      gradient: '',
      component: AgoricCredentialSystem,
    },
  ];

  const handleDisconnect = () => {
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
    navigate('/');
    setShowDisconnectModal(false);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 bg-white" />
      <div className="fixed inset-0 bg-white opacity-30" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-50" />
        <div className="absolute top-0 right-0 w-1 h-full bg-white opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-50" />
        <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-50" />
      </div>

      {/* Mobile menu button */}
      <motion.button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-sm border border-gray-300 
                   text-black rounded-xl shadow shadow-gray-300"
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isSidebarOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isSidebarOpen ? <FiX className="w-6 h-6 text-black" /> : <FiMenu className="w-6 h-6 text-black" />}
        </motion.div>
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed top-0 left-0 h-screen w-[280px] bg-white/90 backdrop-blur-xl 
                     border-r border-gray-300 shadow shadow-gray-400 z-40"
          >
            <div className="flex flex-col h-full">
              <div className="p-6">
                {/* Logo */}
                {/* <div className="mb-4 flex justify-center">
                  <img src="src/logo.svg" alt="Logo" className="w-16 h-16 object-contain" />
                </div> */}
                <motion.h2 
                  className="font-cyber text-2xl font-bold text-[#D06A48]"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Time Capsule
                </motion.h2>
                <motion.p 
                  className="text-gray-700 mt-2 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Secure your digital legacy
                </motion.p>
              </div>

              <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className={`group flex items-center w-full p-3 rounded-xl transition-all
                             hover:bg-gray-100 relative overflow-hidden ${
                               location.pathname === item.href ? 'bg-gray-200' : ''
                             }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />

                    {/* Icon container */}
                    <motion.div 
                      className={`p-2 rounded-lg bg-white shadow shadow-gray-300
                               relative z-10`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <item.icon className="w-5 h-5 text-black" />
                    </motion.div>

                    {/* Menu text */}
                    <span className="ml-3 font-medium text-black group-hover:text-black 
                                   transition-colors relative z-10">
                      {item.name}
                    </span>

                    {/* Active indicator */}
                    {location.pathname === item.href && (
                      <motion.div
                        className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#D06A48]"
                        layoutId="activeIndicator"
                      />
                    )}
                  </motion.button>
                ))}
              </nav>

              {/* Stats Card */}
              <div className="p-4">
                <motion.div 
                  className="p-4 rounded-xl bg-white/90 border border-gray-300 backdrop-blur-lg
                           relative overflow-hidden shadow shadow-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-gray-100 bg-[size:20px_20px] opacity-10" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-3">
                      <motion.div 
                        className="p-2 rounded-lg bg-white shadow shadow-gray-300"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FiTrendingUp className="w-5 h-5 text-[#D06A48]" />
                      </motion.div>
                      <h3 className="ml-3 font-cyber font-semibold text-black">Quick Stats</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Active Capsules</span>
                        <motion.span 
                          className="font-medium text-black"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          12
                        </motion.span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Total Storage</span>
                        <motion.span 
                          className="font-medium text-black"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                          2.4 GB
                        </motion.span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Network Status</span>
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-black"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-sm text-black">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* User Profile */}
              <div className="p-4 mt-auto">
                <motion.div
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/90 border border-gray-300
                           hover:bg-gray-100 transition-all cursor-pointer  group relative overflow-hidden shadow shadow-gray-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDisconnect}
                >
                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />

                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-white
                                  flex items-center justify-center shadow shadow-gray-300">
                      <FiUser className="w-5 h-5 text-black" />
                    </div>
                  </div>

                  <div className="flex-1 relative z-10">
                    <div className="text-sm font-medium text-black">
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                    </div>
                    <div className="text-xs text-gray-700">Click to disconnect</div>
                  </div>

                  <motion.div
                    className="relative z-10"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiLogOut className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-colors" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.main
        className={`min-h-screen ${isSidebarOpen ? 'lg:pl-[280px]' : ''} relative z-10 bg-white`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 p-8">
          <div className="relative z-10">
            {location.pathname === '/dashboard/credentials' ? (
              <AgoricCredentialSystem />
            ) : (
              children
            )}
          </div>
        </div>
      </motion.main>

      {/* Disconnect Modal */}
      <AnimatePresence>
        {showDisconnectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setShowDisconnectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full
                       border border-gray-300 shadow shadow-gray-400"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-cyber font-bold mb-4 text-black">Disconnect Wallet</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to disconnect your wallet? You will need to reconnect to access your dashboard.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDisconnectModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-black
                           hover:bg-gray-300 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDisconnect}
                  className="flex-1 px-4 py-2 rounded-lg bg-white border border-red-500
                           text-red-500 hover:bg-gray-200 transition-all shadow"
                >
                  Disconnect
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
