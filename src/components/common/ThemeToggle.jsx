import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  const toggleVariants = {
    light: { x: 0 },
    dark: { x: 24 }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-50 no-print"
    >
      {/* Toggle Container */}
      <motion.button
        onClick={onToggle}
        className="glass-container p-3 rounded-2xl hover:shadow-xl transition-all duration-300 group relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        {/* Background Track */}
        <div className="relative w-12 h-6 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 dark:from-indigo-600 dark:to-purple-600 transition-all duration-300">
          {/* Sliding Toggle */}
          <motion.div
            variants={toggleVariants}
            animate={isDark ? 'dark' : 'light'}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-dark-100 rounded-full shadow-lg center-flex"
          >
            {/* Icon inside toggle */}
            <motion.div
              key={theme}
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              {isDark ? (
                <FiMoon className="w-3 h-3 text-indigo-600" />
              ) : (
                <FiSun className="w-3 h-3 text-orange-500" />
              )}
            </motion.div>
          </motion.div>

          {/* Background Icons */}
          <div className="absolute inset-0 flex items-center justify-between px-1">
            <FiSun className={`w-3 h-3 transition-opacity ${isDark ? 'opacity-50' : 'opacity-20'} text-yellow-300`} />
            <FiMoon className={`w-3 h-3 transition-opacity ${isDark ? 'opacity-20' : 'opacity-50'} text-indigo-300`} />
          </div>
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 glass-container px-3 py-1 rounded-lg text-sm whitespace-nowrap pointer-events-none"
        >
          Switch to {isDark ? 'light' : 'dark'} theme
        </motion.div>

        {/* Glow Effect */}
        <div 
          className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
            isDark 
              ? 'bg-purple-500 shadow-neon-purple' 
              : 'bg-orange-400 shadow-lg'
          } opacity-0 group-hover:opacity-20`}
        />
      </motion.button>

      {/* Floating Particles on Toggle */}
      <motion.div
        animate={isDark ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-purple-400' : 'bg-yellow-400'
            }`}
            animate={{
              y: [-5, -15, -5],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 1,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 2
            }}
            style={{
              left: `${30 + i * 20}%`,
              top: '10%'
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ThemeToggle; 