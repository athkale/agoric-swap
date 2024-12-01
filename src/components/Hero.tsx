import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isConnected) {
      navigate('/dashboard');
    } else {
      open();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className=" relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced animated background */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>

      <motion.div 
        className="relative z-10 container mx-auto px-6 text-left flex flex-col-reverse lg:flex-row items-center justify-between"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="lg:w-1/2">
          <motion.h1
            className="text-4xl md:text-7xl font-bold pb-10 bg-gray-800 text-left pl-16"
            variants={itemVariants}
          >
            Empower Your Digital Identity
          </motion.h1>
          
          <motion.p 
            className="text-base md:text-lg text-[#373737] mb-12 max-w-3xl mx-auto text-transparent pl-16"
            variants={itemVariants}
          >
            Take control of your identity with a universal system designed for privacy, interoperability, and trust.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-start pl-16"
            variants={itemVariants}
          >
            <motion.button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-black hover:bg-[#D06A48] text-white  rounded-none font-medium 
                       transition-all duration-200 flex items-center justify-center group shadow-lg pl-16"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isConnected ? 'Go to Dashboard' : 'Get Started'}
              <motion.span
                className="ml-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.span>
            </motion.button>
            
            <motion.button 
              className="px-8 py-4 bg-transparent rounded-none font-medium transition-all duration-200 pl-16 hover:text-[#D06A48]"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>

        {/* Enhanced 3D Illustration */}
        <motion.div 
          className="mt-16 relative lg:mt-0 lg:w-1/2"
          variants={itemVariants}
        >
          <motion.img
            src="src/hero1.png"
            alt="Digital Identity Network"
            className=" mx-auto max-w-1xl w-full"
            initial={{ opacity: 0.8 }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute inset-0 "
            animate={{
              opacity: [0.7, 0.5, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}