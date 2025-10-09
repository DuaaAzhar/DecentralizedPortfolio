import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiExternalLink, FiEye, FiHeart, FiTrendingUp } from 'react-icons/fi';
import { useApp } from '../../App';

const Hero = ({ state, personalInfo, stats }) => {
  const { isConnected, isCorrectNetwork } = useApp();
  const [currentTypeText, setCurrentTypeText] = useState('');
  const [typeIndex, setTypeIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Typing animation texts
  const typeTexts = [
    'Full-Stack Blockchain Developer',
    'Smart Contract Engineer',
    'DeFi Protocol Builder',
    'Web3 Innovation Pioneer',
    'Decentralized App Creator'
  ];

  // Typing effect
  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const currentFullText = typeTexts[typeIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentTypeText === currentFullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else {
          setCurrentTypeText(currentFullText.substring(0, currentTypeText.length + 1));
        }
      } else {
        if (currentTypeText === '') {
          setIsDeleting(false);
          setTypeIndex((prev) => (prev + 1) % typeTexts.length);
        } else {
          setCurrentTypeText(currentTypeText.substring(0, currentTypeText.length - 1));
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentTypeText, isDeleting, typeIndex, typeTexts]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.5
      }
    }
  };

  // Stats data
  const portfolioStats = [
    {
      icon: FiTrendingUp,
      label: 'Profile Views',
      value: stats?.profileViews || personalInfo?.profileViews || '1.2K+',
      color: 'text-blue-400'
    },
    {
      icon: FiHeart,
      label: 'Total Likes',
      value: stats?.totalLikes || '500+',
      color: 'text-red-400'
    },
    {
      icon: FiEye,
      label: 'Project Views',
      value: stats?.totalViews || '10K+',
      color: 'text-green-400'
    }
  ];

  return (
    <section 
      id="hero" 
      className="relative full-screen center-flex overflow-hidden bg-dark-50 pt-20"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-pattern-grid opacity-5"></div>
      <div className="absolute inset-0 bg-animated-gradient opacity-10"></div>
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary-400 rounded-full"
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="container-modern section-padding relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Connection Status */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <div className={`glass-container px-4 py-2 rounded-full flex items-center gap-2 ${
                isConnected && isCorrectNetwork ? 'border-green-500/30' : 'border-orange-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected && isCorrectNetwork ? 'bg-green-400' : 'bg-orange-400'
                } animate-pulse`}></div>
                <span className="text-sm">
                  {isConnected && isCorrectNetwork ? 'Connected to Blockchain' : 'Connect Wallet to View Portfolio'}
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-white">Hi, I'm </span>
                <span className="text-gradient-primary block lg:inline">
                  {personalInfo?.name || 'Duaa Azhar'}
                </span>
              </h1>
              
              {/* Typing Animation */}
              <div className="h-16 flex items-center justify-center lg:justify-start">
                <h2 className="text-xl md:text-2xl font-medium text-gray-300">
                  {currentTypeText}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-primary-400 ml-1"
                  >
                    |
                  </motion.span>
                </h2>
              </div>
            </motion.div>

            {/* Bio Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              {personalInfo?.bio || 
                "Building the future with decentralized technologies. Passionate about creating innovative blockchain solutions that bridge traditional finance with DeFi protocols."
              }
            </motion.p>

            {/* Stats Grid */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0"
            >
              {portfolioStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass-container p-4 rounded-2xl text-center"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={() => {
                  const projectsSection = document.querySelector('#projects');
                  projectsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary flex items-center gap-2 justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View My Work</span>
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <FiExternalLink className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {personalInfo?.resumeLink && (
                <motion.a
                  href={personalInfo.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center gap-2 justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Download Resume</span>
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Right Content - Profile Image */}
          <motion.div 
            variants={imageVariants}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full opacity-20 blur-2xl"></div>
              
              {/* Main Image Container */}
              <motion.div 
                variants={floatingVariants}
                animate="animate"
                className="relative glass-container p-2 rounded-full"
              >
                {personalInfo?.profileImage ? (
                  <img
                    src={personalInfo.profileImage}
                    alt="Profile"
                    className="w-80 h-80 object-cover rounded-full border-4 border-primary-500/30"
                  />
                ) : (
                  <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 center-flex">
                    <div className="w-32 h-32 rounded-full bg-white/20 center-flex">
                      <span className="text-4xl font-bold text-white">
                        {personalInfo?.name?.[0] || 'D'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Floating Icons */}
                {['⚡', '🚀', '💡', '🔗'].map((emoji, index) => (
                  <motion.div
                    key={index}
                    className="absolute glass-container p-3 rounded-2xl text-2xl"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 3 + index,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                    style={{
                      top: `${15 + index * 20}%`,
                      right: index % 2 === 0 ? '-10%' : 'auto',
                      left: index % 2 === 1 ? '-10%' : 'auto',
                    }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </motion.div>

              {/* Blockchain Address Display */}
              {state.account && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6 glass-container p-4 rounded-2xl text-center"
                >
                  <p className="text-sm text-gray-400 mb-2">Connected Wallet</p>
                  <p className="text-sm font-mono text-primary-400">
                    {`${state.account.slice(0, 6)}...${state.account.slice(-4)}`}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => {
              const projectsSection = document.querySelector('#projects');
              projectsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-sm text-gray-500">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-gray-500 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Network Status Toast */}
        <AnimatePresence>
          {!isCorrectNetwork && state.web3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              className="fixed bottom-4 right-4 glass-container p-4 rounded-2xl border-orange-500/30 max-w-sm z-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-medium text-orange-300">Wrong Network</h4>
                  <p className="text-sm text-gray-400">Please switch to Sepolia or Mumbai</p>
                </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
    </section>
  );
};

export default Hero;
