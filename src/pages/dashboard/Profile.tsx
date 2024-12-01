import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { FiEdit2, FiSave, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface UserProfile {
  name: string;
  bio: string;
  email: string;
  occupation: string;
}

const occupationOptions = [
  { value: 'student', label: 'Student' },
  { value: 'employee', label: 'Employee' },
  { value: 'developer', label: 'Developer' },
  { value: 'business', label: 'Business Owner' },
  { value: 'other', label: 'Other' },
];

export const Profile: React.FC = () => {
  const { address } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    bio: '',
    email: '',
    occupation: '',
  });

  // Load profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem(`profile-${address}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, [address]);

  const handleSave = () => {
    localStorage.setItem(`profile-${address}`, JSON.stringify(profile));
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 bg-white"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#D06A48]">
          Profile
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="px-4 py-2 bg-black rounded-none text-white
                   flex items-center gap-2 hover:bg-gray-800 hover:text-white
                   transition-colors shadow-lg "
        >
          {isEditing ? (
            <>
              <FiSave className="w-5 h-5" />
              Save Changes
            </>
          ) : (
            <>
              <FiEdit2 className="w-5 h-5" />
              Edit Profile
            </>
          )}
        </motion.button>
      </div>

      <div className="space-y-6">
        {/* Profile Picture and Address */}
        <div className="flex items-center space-x-4 p-6 rounded-lg bg-white">
          <div className="w-20 h-20 rounded-full bg-gray-200
                        flex items-center justify-center">
            <FiUser className="w-10 h-10 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-black">{profile.name || 'Unnamed User'}</h2>
            <p className="text-sm text-black">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
            </p>
            <p className="text-sm text-black mt-1">
              {profile.occupation ? occupationOptions.find(opt => opt.value === profile.occupation)?.label : 'No occupation set'}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <motion.div
          layout
          className="space-y-4 p-6 rounded-lg bg-white"
        >
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-mb bg-white border border-gray-300
                       focus:border-gray-500 focus:ring-1 focus:ring-gray-600 outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Occupation
            </label>
            <select
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300
                       focus:border-gray-500 focus:ring-1 focus:ring-gray-600 outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select your occupation</option>
              {occupationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-mb bg-white border border-gray-300
                       focus:border-gray-500 focus:ring-1 focus:ring-gray-600 outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300
                       focus:border-gray-500 focus:ring-1 focus:ring-gray-600 outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Tell us about yourself"
            />
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg bg-slate-50 text-center"
          >
            <h3 className="text-2xl font-bold text-black">1</h3>
            <p className="text-sm text-black">Active Credentials</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg bg-slate-50 text-center"
          >
            <h3 className="text-2xl font-bold text-black">0</h3>
            <p className="text-sm text-black">Pending Requests</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-xl bg-slate-50 text-center"
          >
            <h3 className="text-2xl font-bold text-black">5</h3>
            <p className="text-sm text-black">Verifications</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
