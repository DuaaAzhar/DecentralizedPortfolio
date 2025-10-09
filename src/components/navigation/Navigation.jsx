import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLink } from 'react-icons/fi';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { name: 'Home', href: '#hero', icon: '🏠' },
    { name: 'Projects', href: '#projects', icon: '💼' },
    { name: 'Skills', href: '#skills', icon: '⚡' },
    { name: 'Experience', href: '#experience', icon: '🎯' },
    { name: 'Contact', href: '#contact', icon: '📬' },
  ];

  // Smooth scroll function
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      x: '100%',
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="container-modern">
          <div 
            className={`glass-container transition-all duration-300 ${
              isScrolled 
                ? 'bg-dark-50/95 backdrop-blur-lg shadow-2xl' 
                : 'bg-transparent backdrop-blur-sm'
            } rounded-2xl px-6 py-4`}
          >
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => scrollToSection('#hero')}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 center-flex">
                  <FiLink className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gradient-primary">
                    DPortfolio
                  </h1>
                  <p className="text-xs text-gray-500">Decentralized</p>
                </div>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="group relative px-4 py-2 rounded-xl transition-all duration-300 hover:bg-primary-500/10"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1 }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-purple-500 group-hover:w-full transition-all duration-300" />
                  </motion.button>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={() => scrollToSection('#contact')}
                className="hidden md:flex btn-primary items-center gap-2 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span>Get In Touch</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden glass-container p-3 rounded-xl"
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiX className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiMenu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] glass-container z-50 lg:hidden"
            >
              <div className="p-6 h-full flex flex-col">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 center-flex">
                      <FiLink className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gradient-primary">DPortfolio</h2>
                      <p className="text-xs text-gray-500">Navigation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex flex-col gap-2 flex-1">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary-500/10 transition-all duration-300 group"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: index * 0.1 }
                      }}
                      whileHover={{ x: 8 }}
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div className="text-left">
                        <div className="font-medium text-gray-300 group-hover:text-white transition-colors">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Go to {item.name.toLowerCase()}
                        </div>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Mobile CTA */}
                <motion.button
                  onClick={() => scrollToSection('#contact')}
                  className="btn-primary w-full mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get In Touch
                </motion.button>

                {/* Version Info */}
                <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                  <p className="text-xs text-gray-500">
                    Decentralized Portfolio v2.0
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Built with ❤️ on blockchain
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="h-20"></div>
    </>
  );
};

export default Navigation; 