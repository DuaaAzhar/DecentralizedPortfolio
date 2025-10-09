import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiExternalLink, FiHeart, FiEye, FiX, FiGift } from "react-icons/fi";
import { toast } from "react-hot-toast";

const Projects = ({ state, projects = [], loading = false }) => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  
  // Use projects passed from App.jsx - they're already loaded from the contract
  const portfolioProjects = projects || [];

  const handleProjectView = async (projectId) => {
    if (!state?.contract || !state?.account) return;
    
    try {
      await state.contract.methods.viewProject(projectId).send({ 
        from: state.account,
        gas: 100000
      });
      toast.success('Project view recorded on blockchain!');
    } catch (error) {
      console.log('Could not record project view:', error);
    }
  };

  const handleProjectLike = async (projectId) => {
    if (!state?.contract || !state?.account) return;
    
    try {
      await state.contract.methods.likeProject(projectId).send({ 
        from: state.account,
        gas: 150000
      });
      toast.success('Project liked! ❤️');
      // Reload projects to update like count
      loadProjectsFromContract();
    } catch (error) {
      if (error.message?.includes('Already liked')) {
        toast.error('You already liked this project!', { 
          duration: 1500,
          id: 'already-liked'
        });
      } else {
        toast.error('Failed to like project', {
          duration: 2000,
          id: 'like-project-error'
        });
      }
    }
  };

  const handleDonation = async (event) => {
    event.preventDefault();
    
    if (!state?.contract || !state?.web3 || !state?.account) {
      toast.error('Please connect your wallet first', {
        duration: 2000,
        id: 'wallet-required'
      });
      return;
    }

    const ethAmount = document.querySelector("#eth-amount").value;
    
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      toast.error('Please enter a valid amount', {
        duration: 2000,
        id: 'invalid-amount'
      });
      return;
    }

    try {
      const wei = state.web3.utils.toWei(ethAmount, "ether");
      
      await state.contract.methods.donateEth().send({ 
        from: state.account, 
        value: wei, 
        gas: 200000 
      });

      toast.success(`Successfully donated ${ethAmount} ETH! Thank you! 🙏`);
      setShowDonateModal(false);
      document.querySelector("#eth-amount").value = '';
    } catch (error) {
      console.error('Donation error:', error);
              toast.error('Donation failed. Please try again.', {
          duration: 2000,
          id: 'donation-failed'
        });
    }
  };

  // Default projects for display when not connected
  const defaultProjects = [
    {
      id: 1,
      name: "DeFi Trading Platform",
      description: "A comprehensive DeFi platform for yield farming and liquidity provision with advanced analytics.",
      image: "mintBox.png",
      githubLink: "DeFi-Trading-Platform",
      liveLink: "https://example.com",
      technologies: ["React", "Solidity", "Web3.js", "Node.js"],
      likes: 42,
      views: 1250
    },
    {
      id: 2,
      name: "NFT Marketplace",
      description: "Full-featured NFT marketplace with minting, trading, and royalty distribution capabilities.",
      image: "prizeBond.jpg", 
      githubLink: "NFT-Marketplace",
      liveLink: "https://example.com",
      technologies: ["Next.js", "Solidity", "IPFS", "Polygon"],
      likes: 38,
      views: 980
    },
    {
      id: 3,
      name: "Staking Protocol",
      description: "Secure staking protocol with flexible reward mechanisms and governance features.",
      image: "stakeMania.jpeg",
      githubLink: "Staking-Protocol", 
      liveLink: "https://example.com",
      technologies: ["React", "Solidity", "Hardhat", "Ethers.js"],
      likes: 29,
      views: 750
    }
  ];

  const displayProjects = portfolioProjects.length > 0 ? portfolioProjects : defaultProjects;

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

  if (loading) {
    return (
      <section id="projects" className="section-padding bg-dark-50">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient-primary mb-4">Loading Projects...</h2>
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`w-3 h-3 bg-primary-500 rounded-full animate-pulse delay-${i * 100}`}></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-padding bg-dark-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-pattern-dots opacity-5"></div>
      
      <div className="container-modern relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gradient-primary mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore my blockchain projects stored permanently on-chain. Each project represents innovation in the Web3 space.
          </p>
          
          {state?.isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 glass-container inline-flex items-center gap-2 px-4 py-2 rounded-full"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Live data from blockchain</span>
            </motion.div>
          )}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id || index}
              variants={itemVariants}
              className="glass-card group cursor-pointer"
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleProjectView(project.id)}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img
                  src={
                    project.image?.startsWith('http') 
                      ? project.image
                      : `https://magenta-alleged-falcon-434.mypinata.cloud/ipfs/QmR9VyCCgdHoJdN6jsBw7QsNFCYwNsrxRbpcSAaGEGPSnD/${project.image}`
                  }
                  alt={project.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProjectLike(project.id);
                    }}
                    className="glass-container p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <FiHeart className="w-4 h-4 text-red-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://github.com/DuaaAzhar/${project.githubLink}`, '_blank');
                    }}
                    className="glass-container p-2 rounded-lg hover:bg-primary-500/20 transition-colors"
                  >
                    <FiGithub className="w-4 h-4 text-primary-400" />
                  </motion.button>
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1 text-xs text-white">
                    <FiHeart className="w-3 h-3" />
                    <span>{project.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white">
                    <FiEye className="w-3 h-3" />
                    <span>{project.views || 0}</span>
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white group-hover:text-gradient-primary transition-colors">
                  {project.name}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.a
                    href={`https://github.com/DuaaAzhar/${project.githubLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiGithub className="w-4 h-4" />
                    <span>Code</span>
                  </motion.a>
                  
                  {project.liveLink && (
                    <motion.a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiExternalLink className="w-4 h-4" />
                      <span>Live</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Donation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            onClick={() => setShowDonateModal(true)}
            className="glass-container px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-3">
              <FiGift className="w-5 h-5 text-accent-400 group-hover:animate-bounce" />
              <span className="text-lg font-medium">
                Enjoyed my work? Consider donating ETH
              </span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-accent-400"
              >
                ✨
              </motion.div>
            </div>
          </motion.button>
        </motion.div>

        {/* Donation Modal */}
        <AnimatePresence>
          {showDonateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm center-flex z-50 p-4"
              onClick={() => setShowDonateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="glass-container p-8 rounded-3xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gradient-primary">
                    Support My Work
                  </h3>
                  <button
                    onClick={() => setShowDonateModal(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-6">
                  <p className="text-gray-400 text-center">
                    Your donation helps me continue building innovative blockchain solutions!
                  </p>

                  <form onSubmit={handleDonation} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Amount (ETH)
                      </label>
                      <input
                        id="eth-amount"
                        type="number"
                        step="0.001"
                        min="0.001"
                        placeholder="0.01"
                        className="input-modern w-full"
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowDonateModal(false)}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                        disabled={!state?.isConnected}
                      >
                        <FiGift className="w-4 h-4" />
                        <span>Donate</span>
                      </button>
            </div>
          </form>

                  {!state?.isConnected && (
                    <p className="text-sm text-orange-400 text-center">
                      Please connect your wallet to donate
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
