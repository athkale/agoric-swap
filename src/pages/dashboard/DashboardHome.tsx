import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiClock, FiShield, FiImage } from 'react-icons/fi';
import { useCredentialStore } from '../../store/credentialStore';
import { useAccount } from 'wagmi';

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

export const DashboardHome: React.FC = () => {
  const { credentials, getRecentCredentials } = useCredentialStore();
  const { address } = useAccount();
  const recentCredentials = getRecentCredentials(6);

  const stats = [
    {
      icon: <FiAward className="w-6 h-6 text-blue-500" />,
      label: 'Active Credentials',
      value: credentials.length,
    },
    {
      icon: <FiClock className="w-6 h-6 text-purple-500" />,
      label: 'Recent Activities',
      value: credentials.length,
    },
    {
      icon: <FiShield className="w-6 h-6 text-green-500" />,
      label: 'Verifications',
      value: Math.max(0, credentials.length - 1),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 bg-white min-h-screen p-6"
    >
      {/* Welcome Section */}
      <div className="bg-slate-100 rounded-lg p-6 ">
        <h1 className="text-3xl font-bold text-[#D06A48]">
          Welcome Back
        </h1>
        <p className="text-black mt-2">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-lg bg-slate-100  hover:bg-gray-200 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-200 rounded-lg">{stat.icon}</div>  
              <div>
                <h3 className="text-2xl font-bold text-black">{stat.value}</h3>
                <p className="text-sm text-black">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">Recent Activity</h2>
        </div>
        
        {credentials.length === 0 ? (
          <div className="p-6 text-center rounded-lg bg-slate-100">
            <p className="text-slate-300">No recent activity to show.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCredentials.map((credential, index) => (
              <motion.div
                key={credential.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-gray-100 border border-gray-400 shadow hover:bg-gray-200 transition-all duration-300"
              >
                {/* Card Header with Image */}
                <div className="aspect-video relative overflow-hidden">
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
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-black group-hover:text-gray-800 transition-colors line-clamp-1">
                        {credential.name}
                      </h3>
                      <p className="text-sm text-black mt-1 capitalize">{credential.type}</p>
                    </div>
                  </div>

                  {/* Credential Details */}
                  <div className="mt-4 space-y-2">
                    {'institution' in credential && (
                      <p className="text-sm text-black">
                        🏫 {credential.institution}
                      </p>
                    )}
                    {'company' in credential && (
                      <p className="text-sm text-black">
                        🏢 {credential.company}
                      </p>
                    )}
                    {'skills' in credential && (
                      <p className="text-sm text-black">
                        💻 {credential.skills.slice(0, 2).join(', ')}
                        {credential.skills.length > 2 && '...'}
                      </p>
                    )}
                    {'companyName' in credential && (
                      <p className="text-sm text-black">
                        🏢 {credential.companyName}
                      </p>
                    )}
                  </div>

                  {/* Issue Date */}
                  <div className="mt-4 pt-4 border-t border-gray-400">
                    <p className="text-xs text-black">
                      Issued on {credential.issueDate}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
