import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link2 as FiLink, 
  Heart as FiHeart, 
  X as FiX, 
  Copy as FiCopy, 
  ExternalLink as FiExternalLink,
  Github as FiGithub,
  Linkedin as FiLinkedin,
  Twitter as FiTwitter,
  Mail as FiMail,
  Hexagon as FiHexagon 
} from 'lucide-react';
import './Footer.css';

// Custom Ethereum and Bitcoin icons (since we can't use react-icons/si)
const SiEthereum = ({ className }) => (
  <svg className={className} viewBox="0 0 320 512" fill="currentColor">
    <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
  </svg>
);

const SiBitcoin = ({ className }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor">
    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-141.651-35.33c4.937-32.999-20.191-50.739-54.55-62.573l11.146-44.702-27.213-6.781-10.851 43.524c-7.154-1.783-14.502-3.464-21.803-5.13l10.929-43.81-27.198-6.781-11.153 44.686c-5.922-1.349-11.735-2.682-17.377-4.084l.031-.14-37.53-9.37-7.239 29.062s20.191 4.627 19.765 4.913c11.022 2.751 13.014 10.044 12.68 15.825l-12.696 50.925c.76.191 1.740.462 2.829.855-.907-.225-1.876-.473-2.876-.713l-17.796 71.338c-1.349 3.348-4.767 8.37-12.471 6.464.271.395-19.78-4.937-19.78-4.937l-13.51 31.147 35.414 8.827c6.588 1.651 13.05 3.379 19.4 5.006l-11.262 45.213 27.182 6.781 11.153-44.733a1038.209 1038.209 0 0 0 21.687 5.627l-11.115 44.523 27.213 6.781 11.262-45.128c46.404 8.781 81.299 5.239 95.986-36.727 11.836-33.79-.589-53.281-25.004-65.991 17.78-4.098 31.174-15.792 34.747-39.949zm-62.177 87.179c-8.41 33.79-65.308 15.523-83.755 10.943l14.944-59.899c18.446 4.603 77.6 13.717 68.811 48.956zm8.417-87.667c-7.673 30.736-55.031 15.12-70.393 11.292l13.548-54.327c15.363 3.828 64.836 10.973 56.845 43.035z"/>
  </svg>
);

const Footer = () => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const currentYear = new Date().getFullYear();

  // Mock data - replace with your actual data
  const socialLinks = [
    {
      label: 'GitHub',
      href: 'https://github.com/duaaazhar',
      icon: FiGithub
    },
    {
      label: 'LinkedIn', 
      href: 'https://linkedin.com/in/duaa-azhar',
      icon: FiLinkedin
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com/duaaazhar', 
      icon: FiTwitter
    },
    {
      label: 'Email',
      href: 'mailto:duaa@example.com',
      icon: FiMail
    }
  ];

  const blockchainNetworks = [
    { name: 'Ethereum', icon: SiEthereum, color: 'text-blue-400' },
    { name: 'Polygon', icon: FiHexagon, color: 'text-purple-400' }, 
    { name: 'Bitcoin', icon: SiBitcoin, color: 'text-orange-400' }
  ];

  const footerSections = [
    {
      title: 'Navigation',
      links: [
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Contact', href: '#contact' }
      ]
    },
    {
      title: 'Blockchain',
      links: [
        { name: 'Smart Contracts', href: '#smart-contracts' },
        { name: 'DeFi Projects', href: '#defi' },
        { name: 'NFT Collections', href: '#nfts' },
        { name: 'Web3 Apps', href: '#web3' }
      ]
    },
    {
      title: 'Resources', 
      links: [
        { name: 'Blog', href: '#blog' },
        { name: 'Tutorials', href: '#tutorials' },
        { name: 'Open Source', href: '#opensource' },
        { name: 'Support', href: '#support' }
      ]
    }
  ];

  const personalInfo = {
    profileViews: 12543,
    totalDonations: 0.5e18
  };

  const donationAddresses = {
    ethereum: '0x742d35Cc6634C0532925a3b8D',
    polygon: '0x742d35Cc6634C0532925a3b8D', 
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
  };

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log(`Section ${href} not found`);
    }
  };

  const copyToClipboard = (address, network) => {
    navigator.clipboard.writeText(address).then(() => {
      console.log(`${network} address copied to clipboard`);
    });
  };

  const openBlockExplorer = (address, network) => {
    const explorers = {
      ethereum: `https://etherscan.io/address/${address}`,
      polygon: `https://polygonscan.com/address/${address}`,
      bitcoin: `https://blockchair.com/bitcoin/address/${address}`
    };
    window.open(explorers[network], '_blank');
  };

  return (
    <footer className="bg-dark-50 border-t border-gray-800 relative">
      {/* Main Footer Content */}
      <div className="container-modern section-padding relative" style={{ zIndex: 10000 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
            style={{ position: 'relative', zIndex: 10000 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 center-flex">
                <FiLink className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gradient-primary">DPortfolio</h3>
                <p className="text-sm text-gray-500">Decentralized</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              A modern decentralized portfolio built on blockchain technology, 
              showcasing projects and achievements stored permanently on-chain.
            </p>

            {/* Blockchain Networks - FIXED */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3 text-gray-300">Supported Networks</p>
              <div className="flex gap-4">
                {blockchainNetworks.map((network, index) => (
                  <motion.div
                    key={network.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-container p-3 rounded-xl ${network.color} hover:scale-110 transition-transform cursor-pointer`}
                    whileHover={{ y: -2 }}
                    title={network.name}
                    onClick={() => {
                      console.log(`${network.name} network clicked`);
                    }}
                    style={{ 
                      position: 'relative', 
                      zIndex: 10000,
                      pointerEvents: 'auto',
                      cursor: 'pointer'
                    }}
                  >
                    <network.icon className="w-5 h-5" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Links - FIXED */}
            <div className="flex gap-4" style={{ zIndex: 10000, position: 'relative' }}>
              {socialLinks.map((social, index) => {
                console.log(`Rendering button ${index}:`, social.label, social.href);
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-container p-3 rounded-xl transition-all duration-300 hover:text-blue-400 cursor-pointer"
                    onClick={(e) => {
                      console.log(`Clicked ${social.label}:`, social.href);
                    }}
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      zIndex: 10000,
                      pointerEvents: 'auto',
                      cursor: 'pointer'
                    }}
                  >
                    <social.icon className="w-5 h-5 text-white" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Sections - FIXED */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
              style={{ position: 'relative', zIndex: 10000 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scrollToSection(link.href);
                      }}
                      className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block cursor-pointer select-none w-full text-left"
                      style={{ 
                        position: 'relative', 
                        zIndex: 10000,
                        pointerEvents: 'auto',
                        cursor: 'pointer'
                      }}
                    >
                      {link.name}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

        {/* Bottom Section - FIXED */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ position: 'relative', zIndex: 10000 }}
        >
          {/* Copyright */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>© {currentYear} Duaa Azhar. Made with</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FiHeart className="w-4 h-4 text-red-400" />
            </motion.div>
            <span>and ⚡ on the blockchain</span>
          </div>

          {/* Stats */}
          {personalInfo?.profileViews && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 text-sm"
            >
              <div className="glass-container px-3 py-2 rounded-lg">
                <span className="text-gray-400">Profile Views: </span>
                <span className="text-primary-400 font-semibold">
                  {personalInfo.profileViews.toLocaleString()}
                </span>
              </div>
              
              {personalInfo?.totalDonations > 0 && (
                <div className="glass-container px-3 py-2 rounded-lg">
                  <span className="text-gray-400">Total Donations: </span>
                  <span className="text-green-400 font-semibold">
                    {(personalInfo.totalDonations / 1e18).toFixed(4)} ETH
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {/* Version & Tech Stack */}
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500">
              Decentralized Portfolio v2.0
            </p>
            <p className="text-xs text-gray-600 mt-1">
              React • Solidity • Ethers • IPFS
            </p>
          </div>
        </motion.div>

        {/* Floating Elements - MADE NON-BLOCKING */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-20 pointer-events-none"
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 30, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                left: `${10 + i * 20}%`,
                bottom: `${20 + (i % 2) * 10}%`,
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
          ))}
        </div>
      </div>

      {/* Donation Modal - FIXED */}
      <AnimatePresence>
        {showDonateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDonateModal(false)}
            style={{ zIndex: 20000 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-container max-w-md w-full p-6 rounded-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative', zIndex: 20001 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Support My Work</h3>
                <button
                  onClick={() => setShowDonateModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  style={{ position: 'relative', zIndex: 20002, cursor: 'pointer' }}
                >
                  <FiX className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Donation Options */}
              <div className="space-y-4">
                <p className="text-gray-300 text-sm mb-4">
                  If you find my work helpful, consider supporting me with a donation:
                </p>

                {/* Ethereum */}
                <div className="glass-container p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <SiEthereum className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-white">Ethereum (ETH)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-800 px-2 py-1 rounded flex-1 break-all text-gray-300">
                      {donationAddresses.ethereum}
                    </code>
                    <button
                      onClick={() => copyToClipboard(donationAddresses.ethereum, 'Ethereum')}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Copy address"
                      style={{ position: 'relative', zIndex: 20002, cursor: 'pointer' }}
                    >
                      <FiCopy className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => openBlockExplorer(donationAddresses.ethereum, 'ethereum')}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="View on Etherscan"
                      style={{ position: 'relative', zIndex: 20002, cursor: 'pointer' }}
                    >
                      <FiExternalLink className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                </div>

                {/* Polygon */}
                <div className="glass-container p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <FiHexagon className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-white">Polygon (MATIC)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-800 px-2 py-1 rounded flex-1 break-all text-gray-300">
                      {donationAddresses.polygon}
                    </code>
                    <button
                      onClick={() => copyToClipboard(donationAddresses.polygon, 'Polygon')}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Copy address"
                      style={{ position: 'relative', zIndex: 20002, cursor: 'pointer' }}
                    >
                      <FiCopy className="w-4 h-4 text-purple-400" />
                    </button>
                    <button
                      onClick={() => openBlockExplorer(donationAddresses.polygon, 'polygon')}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="View on PolygonScan"
                      style={{ position: 'relative', zIndex: 20002, cursor: 'pointer' }}
                    >
                      <FiExternalLink className="w-4 h-4 text-purple-400" />
                    </button>
                  </div>
                </div>

                {/* Bitcoin */}
                <div className="glass-container p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <SiBitcoin className="w-5 h-5 text-orange-400" />
                    <span className="font-semibold text-white">Bitcoin (BTC)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-800 px-2 py-1 rounded flex-1 break-all text-gray-300">
                      {donationAddresses.bitcoin}
                    </code>
                    <button
                      onClick={() => copyToClipboard(donationAddresses.bitcoin, 'Bitcoin')}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Copy address"
                      style={{ position: 'relative', zIndex: 20002, cursor: 'pointer' }}
                    >
                      <FiCopy className="w-4 h-4 text-orange-400" />
                    </button>
                    <button
                      onClick={() => openBlockExplorer(donationAddresses.bitcoin, 'bitcoin')}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="View on BlockChair"
                      style={{ position: 'relative', zIndex: 20002, cursor: 'pointer' }}
                    >
                      <FiExternalLink className="w-4 h-4 text-orange-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Thank You Message */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Thank you for supporting decentralized development! 💝
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;