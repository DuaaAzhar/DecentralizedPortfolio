import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  // Show/hide button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = (scrolled / maxHeight) * 100;
      
      setScrollPercent(percent);
      setIsVisible(scrolled > 400);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.3,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.3,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const progressVariants = {
    initial: { pathLength: 0 },
    animate: { 
      pathLength: scrollPercent / 100,
      transition: {
        duration: 0.1,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-6 left-6 z-50 no-print"
        >
          <motion.button
            onClick={scrollToTop}
            className="glass-container p-4 rounded-2xl hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            {/* Progress Ring */}
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 50 50"
            >
              {/* Background Circle */}
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                variants={progressVariants}
                initial="initial"
                animate="animate"
                style={{
                  pathLength: scrollPercent / 100
                }}
              />
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Arrow Icon */}
            <motion.div
              animate={{
                y: [0, -2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <FiArrowUp className="w-5 h-5 text-primary-400 group-hover:text-white transition-colors" />
            </motion.div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 glass-container px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none"
            >
              <div className="flex items-center gap-2">
                <span>Back to top</span>
                <div className="text-xs text-gray-400">
                  ({Math.round(scrollPercent)}%)
                </div>
              </div>
            </motion.div>

            {/* Floating Sparkles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary-400 rounded-full pointer-events-none"
                animate={{
                  x: [0, Math.cos(i * 2) * 15, 0],
                  y: [0, Math.sin(i * 2) * 15, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: "easeInOut"
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop; 