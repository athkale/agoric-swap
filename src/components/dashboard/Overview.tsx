import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiShield, 
  FiClock, 
  FiKey, 
  FiLock, 
  FiUnlock,
  FiTrendingUp,
  FiActivity,
  FiDatabase
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

export default function Overview() {
  const navigate = useNavigate();
  const { address } = useAccount();

  const stats = [
    {
      icon: FiKey,
      label: 'Active Credentials',
      value: '12',
      gradient: 'from-blue-400 to-indigo-500',
    },
    {
      icon: FiClock,
      label: 'Time Capsules',
      value: '8',
      gradient: 'from-purple-400 to-pink-500',
    },
    {
      icon: FiLock,
      label: 'Locked',
      value: '5',
      gradient: 'from-pink-400 to-yellow-500',
    },
    {
      icon: FiUnlock,
      label: 'Unlocked',
      value: '3',
      gradient: 'from-yellow-400 to-green-500',
    },
  ];

  const activities = [
    {
      type: 'credential',
      title: 'New Credential Issued',
      description: 'Academic Degree verification from University XYZ',
      time: '2 hours ago',
      icon: FiShield,
      gradient: 'from-blue-400 to-indigo-500',
    },
    {
      type: 'capsule',
      title: 'Time Capsule Created',
      description: 'Digital memories locked until 2025',
      time: '5 hours ago',
      icon: FiClock,
      gradient: 'from-purple-400 to-pink-500',
    },
    {
      type: 'unlock',
      title: 'Capsule Unlocked',
      description: 'Message from past self now available',
      time: '1 day ago',
      icon: FiUnlock,
      gradient: 'from-pink-400 to-yellow-500',
    },
  ];

  return (
    <div className="p-8 bg-white text-black min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-700 mt-2">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect your wallet to continue'}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-300 rounded-xl p-6 border border-gray-400 relative overflow-hidden group shadow-md"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gray-200 opacity-10" />
            
            <div className="relative z-10">
              <motion.div 
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center mb-4`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>
              
              <motion.h3 
                className="text-3xl font-bold mb-2"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {stat.value}
              </motion.h3>
              <p className="text-gray-700">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity and Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-gray-300 rounded-xl p-6 border border-gray-400 relative overflow-hidden shadow-md"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                onClick={() => navigate('/activity')}
              >
                View All
              </motion.button>
            </div>

            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors group relative overflow-hidden"
                >
                  <motion.div 
                    className={`p-2 rounded-lg bg-gradient-to-r ${activity.gradient}`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <activity.icon className="w-5 h-5 text-white" />
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="font-medium text-black group-hover:text-blue-500 transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-700">{activity.description}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Network Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-300 rounded-xl p-6 border border-gray-400 relative overflow-hidden shadow-md"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="p-2 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <FiActivity className="w-5 h-5 text-white" />
              </motion.div>
              <h2 className="text-xl font-bold">Network Stats</h2>
            </div>

            <div className="space-y-6">
              {/* Storage Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Storage Usage</span>
                  <span className="text-blue-500">2.4 GB / 5 GB</span>
                </div>
                <div className="h-2 bg-gray-400 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: '48%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Network Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Network Status</span>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-green-500">Connected</span>
                </div>
              </div>

              {/* Data Transfer */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Data Transfer</span>
                  <motion.span 
                    className="text-purple-500"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    1.2 MB/s
                  </motion.span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="w-4 h-4 text-purple-500" />
                  <motion.div
                    className="flex-1 h-1 bg-gray-400 rounded-full overflow-hidden"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Database Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Database Status</span>
                <div className="flex items-center gap-2">
                  <FiDatabase className="w-4 h-4 text-blue-500" />
                  <motion.span 
                    className="text-blue-500"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    Synced
                  </motion.span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
