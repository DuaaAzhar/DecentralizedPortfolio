import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const textVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.6
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.8, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 bg-dark-50 center-flex z-50"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-animated-gradient opacity-10"></div>
      
      {/* Loading Content */}
      <div className="text-center relative z-10">
        {/* Animated Logo/Icon */}
        <motion.div 
          variants={logoVariants}
          className="relative mb-8"
        >
          {/* Outer Pulse Ring */}
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="absolute inset-0 rounded-full border-4 border-primary-500"
            style={{ width: '120px', height: '120px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          />
          
          {/* Main Logo Container */}
          <div className="glass-container w-24 h-24 rounded-full center-flex mx-auto relative">
            <svg 
              className="w-12 h-12 text-primary-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          </div>
        </motion.div>
        
        {/* Loading Text */}
        <motion.div variants={textVariants}>
          <h2 className="text-3xl font-bold text-gradient-primary mb-2">
            Decentralized Portfolio
          </h2>
          <p className="text-gray-400 mb-6">
            Connecting to the blockchain...
          </p>
        </motion.div>
        
        {/* Loading Animation */}
        <motion.div className="flex justify-center items-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary-500 rounded-full"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
        
        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="glass-container h-2 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
              animate={{
                x: ['-100%', '100%', '100%', '-100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

        {/* Web3 Connection Status */}
        <motion.div 
          className="mt-6 text-sm text-gray-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Initializing Web3 connection...
        </motion.div>
      </div>
      
      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-30"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: `${60 + (i % 2) * 20}%`,
          }}
        />
      ))}
    </motion.div>
  );
};

export default LoadingScreen; 