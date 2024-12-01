import React from 'react';
import { Shield, Link, Lock, Globe, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Shield,
    title: 'Decentralized and Secure',
    description: 'Your identity, fully owned and protected by you.',
  },
  {
    icon: Link,
    title: 'Cross-Chain Compatibility',
    description: 'Seamlessly interact with multiple blockchain ecosystems.',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Zero-Knowledge Proofs ensure data privacy.',
  },
  {
    icon: Globe,
    title: 'Global Standards',
    description: 'Built on W3C DID and Verifiable Credentials.',
  },
  {
    icon: Wallet,
    title: 'Ease of Use',
    description: 'User-friendly wallet for managing your credentials effortlessly.',
  },
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <motion.section 
      className="py-24 bg-black/30"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why Choose XDigi?
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-8 rounded-xl backdrop-blur-sm relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              style={{
                background: "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
              }}
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                initial={false}
                style={{
                  background: "linear-gradient(45deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5))",
                  filter: "blur(20px)",
                  zIndex: -1,
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <feature.icon className="w-12 h-12 mb-6 text-blue-400 group-hover:text-purple-400 transition-colors duration-300" />
              </motion.div>
              
              <motion.h3 
                className="text-xl font-semibold mb-4"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                {feature.title}
              </motion.h3>
              
              <motion.p 
                className="text-gray-400"
                initial={{ opacity: 0.6 }}
                whileHover={{ opacity: 1 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}