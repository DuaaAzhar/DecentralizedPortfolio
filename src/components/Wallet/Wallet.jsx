import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLink, FiCheck, FiAlertCircle, FiExternalLink, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import ABI from "./ABI.json";

const Wallet = ({ saveState }) => {
  const [walletState, setWalletState] = useState({
    connected: false,
    connecting: false,
    account: null,
    networkId: null,
    networkName: '',
    isCorrectNetwork: false
  });
  

  const [isCollapsed, setIsCollapsed] = useState(false); // Add collapsible state
  
  // Rate limiting to prevent circuit breaker issues
  const [lastConnectionAttempt, setLastConnectionAttempt] = useState(0);
  const CONNECTION_COOLDOWN = 3000; // 3 seconds between attempts
  
  // Debounce chain changes to prevent rapid-fire network switches
  const [chainChangeTimeout, setChainChangeTimeout] = useState(null);

  // Supported networks with their details
  const supportedNetworks = {
    1: {
      name: "Ethereum Mainnet",
      currency: "ETH",
      rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
      contractAddress: "0x0000000000000000000000000000000000000000", // Add your mainnet contract
      blockExplorer: "https://etherscan.io"
    },
    11155111: {
      name: "Sepolia Testnet",
      currency: "SepoliaETH", 
      rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      contractAddress: "0x2d2dCd6f411c5b9e048aa8D1a0144d084010db11",
      blockExplorer: "https://sepolia.etherscan.io"
    },
    137: {
      name: "Polygon Mainnet",
      currency: "MATIC",
      rpcUrl: "https://polygon-rpc.com",
      contractAddress: "0x0000000000000000000000000000000000000000", // Add your polygon contract
      blockExplorer: "https://polygonscan.com"
    },
    80001: {
      name: "Mumbai Testnet",
      currency: "MATIC",
      rpcUrl: "https://rpc-mumbai.maticvigil.com",
      contractAddress: "0x00e8B97dc085F826DE00509c3B98D4c03241C55b",
      blockExplorer: "https://mumbai.polygonscan.com"
    },
    56: {
      name: "BSC Mainnet",
      currency: "BNB",
      rpcUrl: "https://bsc-dataseed.binance.org",
      contractAddress: "0x0000000000000000000000000000000000000000", // Add your BSC contract
      blockExplorer: "https://bscscan.com"
    },
    97: {
      name: "BSC Testnet",
      currency: "BNB",
      rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
      contractAddress: "0x0000000000000000000000000000000000000000", // Add your BSC testnet contract
      blockExplorer: "https://testnet.bscscan.com"
    },
    2040: {
      name: "Vanar Mainnet",
      currency: "VANRY",
      rpcUrl: "https://rpc.vanarchain.com",
      contractAddress: "0x0000000000000000000000000000000000000000", // Add your Vanar contract
      blockExplorer: "https://explorer.vanarchain.com"
    },
    78600: {
      name: "Vanguard Testnet",
      currency: "VG",
      rpcUrl: "https://rpc-vanguard.vanarchain.com",
      contractAddress: "0x0000000000000000000000000000000000000000", // Add your Vanguard contract
      blockExplorer: "https://explorer-vanguard.vanarchain.com"
    },
    43114: {
      name: "Avalanche C-Chain",
      currency: "AVAX",
      rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
      contractAddress: "0x0000000000000000000000000000000000000000", // Add your Avalanche contract
      blockExplorer: "https://snowtrace.io"
    },
    250: {
      name: "Fantom Opera",
      currency: "FTM",
      rpcUrl: "https://rpc.ftm.tools",
      contractAddress: "0x0000000000000000000000000000000000000000", // Add your Fantom contract
      blockExplorer: "https://ftmscan.com"
    },
    42161: {
      name: "Arbitrum One",
      currency: "ETH",
      rpcUrl: "https://arb1.arbitrum.io/rpc",
      contractAddress: "0x0000000000000000000000000000000000000000", // Add your Arbitrum contract
      blockExplorer: "https://arbiscan.io"
    },
    10: {
      name: "Optimism",
      currency: "ETH",
      rpcUrl: "https://mainnet.optimism.io",
      contractAddress: "0x0000000000000000000000000000000000000000", // Add your Optimism contract
      blockExplorer: "https://optimistic.etherscan.io"
    },
    31337: {
      name: "Hardhat Network",
      currency: "ETH",
      rpcUrl: "http://localhost:8545",
      contractAddress: "0x0165878A594ca255338adfa4d48449f69242Eb8F", // Updated with new social links
      blockExplorer: "http://localhost:8545"
    }
  };

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  };

  // Detect current network using MetaMask's direct API
  const getCurrentNetwork = async (web3) => {
    try {
      // Use MetaMask's direct API for real-time network detection
      const chainIdHex = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });
      
      const networkId = parseInt(chainIdHex, 16);
      const network = supportedNetworks[networkId];
      
      console.log(`🔍 Network Detection:`, {
        chainIdHex,
        networkId,
        networkName: network?.name || 'Unknown',
        supported: !!network
      });
      
      return { networkId, network };
    } catch (error) {
      console.error('❌ Error getting network:', error);
      return { networkId: null, network: null };
    }
  };

  // Get user accounts
  const getAccounts = async (provider) => {
    try {
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      return account || null;
    } catch (error) {
      console.error('Error getting accounts:', error);
      return null;
    }
  };

  // Add/Switch network in MetaMask
  const addOrSwitchNetwork = async (chainId) => {
    const network = supportedNetworks[chainId];
    if (!network) return;

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${chainId.toString(16)}`,
              chainName: network.name,
              nativeCurrency: {
                name: network.currency,
                symbol: network.currency,
                decimals: 18,
              },
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.blockExplorer],
            }],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          throw new Error(`Failed to add ${network.name} to MetaMask`);
        }
      } else {
        throw switchError;
      }
    }
  };

  // Initialize Web3 connection with retry logic
  const initializeWeb3 = async (retryCount = 0) => {
    const maxRetries = 3;
    const now = Date.now();
    
    // Rate limiting check (skip for retries)
    if (retryCount === 0) {
      const timeSinceLastAttempt = now - lastConnectionAttempt;
      if (timeSinceLastAttempt < CONNECTION_COOLDOWN) {
        const remainingTime = Math.ceil((CONNECTION_COOLDOWN - timeSinceLastAttempt) / 1000);
        toast.warning(`Please wait ${remainingTime} seconds before reconnecting`);
        setWalletState(prev => ({ ...prev, connecting: false }));
        return;
      }
      setLastConnectionAttempt(now);
    }
    
    console.log(`🔄 Initializing Web3 connection... (Attempt ${retryCount + 1}/${maxRetries + 1})`);
    setWalletState(prev => ({ ...prev, connecting: true }));

    try {
      // Check MetaMask installation
      if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask not detected. Please install MetaMask extension.');
      }

      console.log('✅ MetaMask detected, requesting accounts...');

      // Add delay to prevent circuit breaker issues
      if (retryCount > 0) {
        const delayMs = Math.min(1000 * Math.pow(2, retryCount), 5000); // Exponential backoff, max 5s
        console.log(`⏳ Waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

      // Request account access with timeout
      const accountsPromise = window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const accounts = await Promise.race([
        accountsPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Account request timeout')), 10000)
        )
      ]);

      // Initialize Ethers provider - but reduce the number of simultaneous calls
      const provider = new ethers.BrowserProvider(window.ethereum);

      // SIMPLIFIED NETWORK DETECTION - reduce API calls
      console.log('🔍 Getting current network (simplified approach)...');
      
      // Add small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Single network detection call
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const finalNetworkId = parseInt(chainIdHex, 16);
      const finalNetwork = supportedNetworks[finalNetworkId];
      
      console.log('🌐 NETWORK DETECTED:', {
        chainIdHex,
        finalNetworkId,
        networkName: finalNetwork?.name || 'Unknown',
        supported: !!finalNetwork,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Final network: ${finalNetwork?.name || 'Unknown'} (ID: ${finalNetworkId})`);
      
      const account = await getAccounts(provider);
      console.log(`👤 Connected account: ${account}`);

      if (!account) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }

      // Check if network is supported using the corrected network data
      const isCorrectNetwork = !!finalNetwork;
      let contract = null;
      
      console.log(`📋 Network supported: ${isCorrectNetwork ? 'Yes' : 'No'}`);

      if (isCorrectNetwork && finalNetwork.contractAddress !== "0x0000000000000000000000000000000000000000") {
        try {
          const signer = await provider.getSigner();
          contract = new ethers.Contract(finalNetwork.contractAddress, ABI, signer);
          console.log(`📝 Smart contract initialized: ${finalNetwork.contractAddress}`);
        } catch (contractError) {
          console.warn('❌ Contract not available on this network:', contractError);
        }
      } else {
        console.log('⚠️ No contract deployed on this network');
      }

      // Update state with corrected network data
      const newState = {
        connected: true,
        connecting: false,
        account,
        networkId: finalNetworkId,
        networkName: finalNetwork?.name || `Unknown Network ${finalNetworkId}`,
        isCorrectNetwork
      };

      setWalletState(newState);

      // Save to parent component with corrected network data
      saveState({
        web3,
        contract,
        account,
        networkId: finalNetworkId,
        isConnected: true,
        isCorrectNetwork
      });

      console.log('🎉 Web3 connection successful!', {
        network: finalNetwork?.name,
        account: account.slice(0, 6) + '...' + account.slice(-4),
        networkId: finalNetworkId,
        chainIdHex,
        contractAvailable: !!contract,
        sepoliaDetected: finalNetworkId === 11155111
      });

      // toast.success() removed - connection status is clearly visible in UI

      if (!isCorrectNetwork) {
        // toast.warning() removed - network warning is shown in UI panel
      }

    } catch (error) {
      console.error('Connection error:', error);
      setWalletState(prev => ({ ...prev, connecting: false }));
      
      // Handle circuit breaker and rate limiting errors with retry
      if ((error.message.includes('circuit breaker') || 
           error.message.includes('rate limit') ||
           error.message.includes('Too Many Requests') ||
           error.message.includes('timeout')) && 
          retryCount < maxRetries) {
        
        console.log(`🔄 Circuit breaker detected, retrying in a moment... (${retryCount + 1}/${maxRetries})`);
        toast.loading(`Connection failed, retrying... (${retryCount + 2}/${maxRetries + 1})`, { 
          id: 'connection-retry' 
        });
        
        // Retry with exponential backoff
        setTimeout(() => {
          initializeWeb3(retryCount + 1);
        }, 1000 * (retryCount + 1));
        return;
      }
      
      // Handle other errors
      let errorMessage = 'Failed to connect wallet';
      if (error.message.includes('User rejected')) {
        errorMessage = 'Connection rejected by user';
      } else if (error.message.includes('MetaMask not detected')) {
        errorMessage = 'MetaMask not installed. Please install MetaMask extension.';
      } else if (error.message.includes('circuit breaker')) {
        errorMessage = 'MetaMask is busy. Please wait a moment and try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Connection timed out. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: 'connection-retry' });
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    console.log('🔌 Disconnecting wallet...');
    setWalletState({
      connected: false,
      connecting: false,
      account: null,
      networkId: null,
      networkName: '',
      isCorrectNetwork: false
    });

    saveState({
      web3: null,
      contract: null,
      account: null,
      networkId: null,
      isConnected: false,
      isCorrectNetwork: false
    });

    // toast.success('Wallet disconnected'); // Removed - user knows they clicked disconnect
  };

  // Force reconnect with complete state reset and proper delays
  const forceReconnect = async () => {
    console.log('🔄 FORCE RECONNECT: Complete state reset...');
    
    // Show loading state
    toast.loading('Reconnecting wallet...', { id: 'force-reconnect' });
    
    // Disconnect first
    disconnect();
    
    // Wait longer to prevent circuit breaker issues
    console.log('⏳ Waiting for MetaMask to reset...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Increased to 2 seconds
    
    try {
      // Force fresh connection
      await initializeWeb3();
      toast.success('Wallet reconnected successfully!', { id: 'force-reconnect' });
    } catch (error) {
      console.error('Force reconnect failed:', error);
      toast.error('Failed to reconnect. Please try manually.', { id: 'force-reconnect' });
    }
  };

  // Force network sync with circuit breaker handling
  const forceNetworkSync = async () => {
    console.log('🔥 FORCE NETWORK SYNC: Syncing with MetaMask...');
    
    try {
      // Add small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const chainIdHex = await Promise.race([
        window.ethereum.request({ method: 'eth_chainId' }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Network sync timeout')), 5000)
        )
      ]);
      
      const networkId = parseInt(chainIdHex, 16);
      const network = supportedNetworks[networkId];
      
      console.log('🌐 Current MetaMask Network:', {
        chainIdHex,
        networkId,
        networkName: network?.name || 'Unknown',
        currentAppState: walletState.networkId
      });
      
      // Force immediate state update
      const newState = {
        ...walletState,
        networkId,
        networkName: network?.name || `Unknown Network ${networkId}`,
        isCorrectNetwork: !!network
      };
      
      console.log('🔥 FORCING NETWORK STATE UPDATE:', newState);
      setWalletState(newState);
      
      // Update parent state if connected (with minimal additional calls)
      if (walletState.connected) {
        // Reuse existing Ethers instance if possible
        const provider = new ethers.BrowserProvider(window.ethereum);
        let contract = null;

        if (network && network.contractAddress !== "0x0000000000000000000000000000000000000000") {
          try {
            const signer = await provider.getSigner();
            contract = new ethers.Contract(network.contractAddress, ABI, signer);
          } catch (contractError) {
            console.warn('Contract not available on this network:', contractError);
          }
        }

        // Don't make additional account calls to prevent rate limiting
        saveState({
          web3,
          contract,
          account: walletState.account, // Reuse existing account
          networkId,
          isConnected: true,
          isCorrectNetwork: !!network
        });
      }
      
      // Don't call toast here - let the calling function handle it to avoid double toasts
      
    } catch (error) {
      console.error('❌ Force network sync failed:', error);
      throw error; // Re-throw to let calling function handle toast
    }
  };

  // Listen for account/network changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = async (accounts) => {
      console.log('🔄 Accounts changed:', accounts);
      
      if (accounts.length === 0) {
        // User disconnected
        disconnect();
        // toast.info('Wallet disconnected'); // Removed - user initiated this action
      } else {
        // Get current wallet state to avoid stale closure
        setWalletState(currentState => {
          if (currentState.connected && accounts[0] !== currentState.account) {
            // Account switched - re-initialize
            // toast.info('Account switched, updating connection...'); // Removed - automatic operation
            // Use setTimeout to avoid state update during render
            setTimeout(() => initializeWeb3(), 100);
          }
          return currentState;
        });
      }
    };

    const handleChainChanged = async (chainId) => {
      console.log('🔄 Chain changed to:', chainId, 'from MetaMask');
      
      // Clear any existing timeout
      if (chainChangeTimeout) {
        clearTimeout(chainChangeTimeout);
      }
      
      // Debounce rapid chain changes
      const timeoutId = setTimeout(async () => {
        console.log('⚡ Processing debounced chain change...');
        await processChainChange(chainId);
      }, 300); // 300ms debounce
      
      setChainChangeTimeout(timeoutId);
    };
    
    const processChainChange = async (chainId) => {
      // Force refresh network detection regardless of connection state
      const networkId = parseInt(chainId, 16);
      const network = supportedNetworks[networkId];
      
      console.log(`🌐 Network Change Detected:`, {
        chainId,
        networkId,
        networkName: network?.name || 'Unknown',
        supported: !!network,
        currentWalletState: walletState.networkId
      });
      
      // IMMEDIATE state update - don't wait for async operations
      const newState = {
        connected: walletState.connected,
        connecting: false,
        account: walletState.account,
        networkId,
        networkName: network?.name || `Unknown Network ${networkId}`,
        isCorrectNetwork: !!network
      };
      
      console.log('🔥 FORCING STATE UPDATE:', newState);
      setWalletState(newState);
      
      // Network change info is visible in UI - no toast needed

      // If connected, update Ethers and contract in background
      if (walletState.connected) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const account = await getAccounts(provider);
          let contract = null;

          if (network && network.contractAddress !== "0x0000000000000000000000000000000000000000") {
            try {
              const signer = await provider.getSigner();
              contract = new ethers.Contract(network.contractAddress, ABI, signer);
              console.log(`📝 Contract loaded for ${network.name}: ${network.contractAddress}`);
            } catch (contractError) {
              console.warn('⚠️ Contract not available on this network:', contractError);
            }
          } else {
            console.log('⚠️ No contract deployed on this network');
          }

          // Update parent state
          saveState({
            web3,
            contract,
            account,
            networkId,
            isConnected: true,
            isCorrectNetwork: !!network
          });

          console.log('✅ Network change complete - Web3 and contract updated');

        } catch (error) {
          console.error('❌ Error handling network change:', error);
          // Don't show toast for network change errors - they're usually harmless
          // and the UI shows the current network status anyway
        }
      }
    };

    // Add event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      // Clean up event listeners
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
      
      // Clean up any pending chain change timeout
      if (chainChangeTimeout) {
        clearTimeout(chainChangeTimeout);
      }
    };
  }, []); // Empty dependency array is fine now since we use setWalletState callbacks

  // Auto-connect on page load if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        // Check if user has previously connected
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });

        if (accounts.length > 0) {
          console.log('Auto-connecting to previously connected wallet...');
          await initializeWeb3();
        }
      } catch (error) {
        console.log('Auto-connect failed:', error);
      }
    };

    autoConnect();
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (chainChangeTimeout) {
        clearTimeout(chainChangeTimeout);
      }
    };
  }, [chainChangeTimeout]);

  // Check if user is on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="sticky top-0 z-50 bg-dark-50/95 backdrop-blur-lg border-b border-gray-800">
      <div className="container-modern py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 center-flex">
              <FiLink className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gradient-primary">DPortfolio</h1>
              <p className="text-xs text-gray-500">Decentralized Portfolio</p>

            </div>
          </motion.div>

          {/* Connection Status & Controls */}
          <div className="flex items-center gap-4">
            {/* Network Status Display */}
            <AnimatePresence>
              {walletState.connected && (
                <motion.div 
                  key={`network-status-${walletState.networkId}-${walletState.account}`} // More unique key
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  className="glass-container px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    walletState.isCorrectNetwork ? 'bg-green-400 shadow-green-400/50' : 'bg-orange-400 shadow-orange-400/50'
                  } animate-pulse shadow-lg`}></div>
                  
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-white">
                      {walletState.networkName}
                    </div>
                    <div className="text-xs text-gray-400">
                      Chain ID: {walletState.networkId}
                    </div>
                  </div>
                  
                  <div className="sm:hidden text-sm text-gray-300">
                    {walletState.networkName?.split(' ')[0]} {/* Show first word on mobile */}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile MetaMask Link */}
            {isMobile && !isMetaMaskInstalled() && (
                          <motion.a
              href="https://metamask.app.link/dapp/duaaazhar.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiExternalLink className="w-4 h-4" />
              Open in MetaMask
            </motion.a>
            )}

            {/* Connection Buttons */}
            <div className="flex items-center gap-2">
              {/* Connected State - Show Address */}
              {walletState.connected && !walletState.connecting && (
                <motion.div
                  key={`connected-address-${walletState.account}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-container px-3 py-2 rounded-xl flex items-center gap-2"
                >
                  <FiCheck className="w-4 h-4 text-green-400" />
                  <span className="hidden sm:inline text-sm text-white">
                    {walletState.account.slice(0, 6)}...{walletState.account.slice(-4)}
                  </span>
                  <span className="sm:hidden text-sm text-white">Connected</span>
                </motion.div>
              )}

              {/* Main Action Button */}
              <motion.button
                onClick={walletState.connected ? disconnect : initializeWeb3}
                disabled={walletState.connecting}
                className={`${
                  walletState.connected ? 'btn-secondary' : 'btn-primary'
                } flex items-center gap-2 ${
                  walletState.connecting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: walletState.connecting ? 1 : 1.05 }}
                whileTap={{ scale: walletState.connecting ? 1 : 0.95 }}
                title={walletState.connected ? 'Click to disconnect wallet' : 'Click to connect wallet'}
              >
                {walletState.connecting ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : walletState.connected ? (
                  <>
                    <FiLink className="w-4 h-4" />
                    <span>Disconnect</span>
                  </>
                ) : (
                  <>
                    <FiLink className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </motion.button>

              {/* Force Reconnect Button (when connected) */}
              {walletState.connected && (
                <motion.button
                  onClick={async () => {
                    console.log('🔄 Force reconnect requested');
                    toast.loading('Force reconnecting...', { id: 'force-reconnect' });
                    try {
                      await forceReconnect();
                      toast.success('Force reconnect completed!', { id: 'force-reconnect' });
                    } catch (error) {
                      toast.error('Force reconnect failed', { id: 'force-reconnect' });
                    }
                  }}
                  disabled={walletState.connecting}
                  className="btn-ghost p-2 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Force reconnect and refresh network"
                >
                  <FiRefreshCw className="w-4 h-4" />
                </motion.button>
              )}

              {/* Force Network Sync Button (always visible) */}
              <motion.button
                onClick={async () => {
                  console.log('🔥 Manual force network sync requested');
                  toast.loading('Syncing network...', { id: 'network-sync' });
                  try {
                    await forceNetworkSync();
                    const networkId = await window.ethereum.request({ method: 'eth_chainId' });
                    const network = supportedNetworks[parseInt(networkId, 16)];
                    toast.success(`Network synced: ${network?.name || 'Unknown'}!`, { id: 'network-sync' });
                  } catch (error) {
                    console.error('Network sync error:', error);
                    if (error.message.includes('circuit breaker') || error.message.includes('timeout')) {
                      toast.error('MetaMask is busy. Please wait a moment and try again.', { id: 'network-sync' });
                    } else {
                      toast.error('Failed to sync network. Please try again.', { id: 'network-sync' });
                    }
                  }
                }}
                className="btn-primary p-2 rounded-xl text-xs font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Force sync with MetaMask network"
              >
                🔥
              </motion.button>

              {/* Network Check Button (always visible) */}
              <motion.button
                onClick={async () => {
                  console.log('🔍 IMMEDIATE NETWORK CHECK:');
                  try {
                    if (!window.ethereum) {
                      toast.error('MetaMask not found!', {
          duration: 2500,
          id: 'metamask-not-found'
        });
                      return;
                    }
                    
                    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
                    const networkId = parseInt(chainIdHex, 16);
                    const network = supportedNetworks[networkId];
                    
                    console.log('Current Network Check:', {
                      chainIdHex,
                      networkId,
                      networkName: network?.name || 'Unknown',
                      currentWalletStateNetwork: walletState.networkName,
                      currentWalletStateId: walletState.networkId,
                      mismatch: networkId !== walletState.networkId
                    });
                    
                    toast.success(`${network?.name || `Chain ${networkId}`}`);
                    
                    if (networkId !== walletState.networkId) {
                                              toast.warning(`Network mismatch detected`);
                    }
                  } catch (error) {
                    console.error('Failed to check network:', error);
                    toast.error('Failed to check network', {
                      duration: 2000,
                      id: 'network-check-failed'
                    });
                  }
                }}
                className="btn-secondary p-2 rounded-xl text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Check current network"
              >
                🔍
              </motion.button>

              {/* Collapse/Expand Button - Controls ALL panels */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCollapsed(!isCollapsed);
                }}
                className="btn-ghost p-2 rounded-xl text-xs cursor-pointer hover:bg-gray-700 border border-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isCollapsed ? "Show wallet details & debug info" : "Hide wallet details to save space"}
              >
                {isCollapsed ? '▼' : '▲'}
              </motion.button>
            </div>
          </div>
        </div>



        {/* Collapsible Content */}
        <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            key="wallet-expanded-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
        {/* Network Warning */}
        <AnimatePresence>
          {walletState.connected && !walletState.isCorrectNetwork && (
            <motion.div
              key={`network-warning-${walletState.networkId}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 glass-container p-4 rounded-2xl border-orange-500/30"
            >
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-orange-300 mb-1">Limited Functionality</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    You're connected to {walletState.networkName}, but some portfolio features may not work. 
                    Switch to a supported network for full functionality.
                  </p>
                  
                  {/* Network Switch Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 137, name: 'Polygon', color: 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300' },
                      { id: 1, name: 'Ethereum', color: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300' },
                      { id: 11155111, name: 'Sepolia', color: 'bg-primary-500/20 hover:bg-primary-500/30 text-primary-300' },
                      { id: 80001, name: 'Mumbai', color: 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300' },
                      { id: 31337, name: 'Hardhat', color: 'bg-green-500/20 hover:bg-green-500/30 text-green-300' }
                    ].map((net) => (
                      <motion.button
                        key={`network-switch-${net.id}`}
                        onClick={() => addOrSwitchNetwork(net.id)}
                        className={`text-xs px-3 py-1 ${net.color} rounded-full transition-all duration-300 hover:scale-105 ${
                          walletState.networkId === net.id ? 'ring-2 ring-white/50' : ''
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={`Switch to ${net.name} (${net.id})`}
                      >
                        {net.name} {walletState.networkId === net.id && '✓'}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Installation Warning */}
        <AnimatePresence>
          {!isMobile && !isMetaMaskInstalled() && (
            <motion.div
              key="installation-warning-metamask"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 glass-container p-4 rounded-2xl border-red-500/30"
            >
              <div className="flex items-center gap-3">
                <FiAlertCircle className="w-5 h-5 text-red-400" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-300 mb-1">MetaMask Required</h4>
                  <p className="text-sm text-gray-400">
                    Please install MetaMask browser extension to connect your wallet and access blockchain features.
                  </p>
                </div>
                <motion.a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiExternalLink className="w-4 h-4" />
                  Install MetaMask
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>



        {/* Debug Panel (auto-show when wallet connected & expanded) */}
        <AnimatePresence>
        {!isCollapsed && walletState.connected && (
          <motion.div
            key="debug-panel-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 glass-container p-4 rounded-2xl border-blue-500/30 bg-blue-900/20"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-blue-300">🔧 Connection Debug Info</h4>
              <span className="text-xs text-gray-500">Use ▲ button above to hide</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-gray-400">Connection Status:</div>
                <div className={walletState.connected ? 'text-green-400' : 'text-red-400'}>
                  {walletState.connected ? '✅ Connected' : '❌ Disconnected'}
                </div>
              </div>
              
              <div>
                <div className="text-gray-400">MetaMask Detected:</div>
                <div className={isMetaMaskInstalled() ? 'text-green-400' : 'text-red-400'}>
                  {isMetaMaskInstalled() ? '✅ Yes' : '❌ No'}
                </div>
              </div>
              
              {walletState.connected && (
                <>
                  <div>
                    <div className="text-gray-400">Network:</div>
                    <div className="text-white font-mono">{walletState.networkName}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-400">Chain ID:</div>
                    <div className="text-white font-mono">{walletState.networkId}</div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-gray-400">Account:</div>
                    <div className="text-white font-mono text-xs break-all">{walletState.account}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-400">Contract Available:</div>
                    <div className={walletState.isCorrectNetwork ? 'text-green-400' : 'text-orange-400'}>
                      {walletState.isCorrectNetwork ? '✅ Yes' : '⚠️ Limited'}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-gray-400">Supported Networks:</div>
                    <div className="text-xs text-gray-500">
                      1: Ethereum, 11155111: Sepolia, 80001: Mumbai, 31337: Hardhat
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-gray-400">Contract Address:</div>
                    <div className="text-xs text-blue-400 break-all">
                      {supportedNetworks[walletState.networkId]?.contractAddress || 'Not deployed on this network'}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-gray-400">Debug Check:</div>
                    <button
                      onClick={async () => {
                        try {
                          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                          const networkId = parseInt(chainId, 16);
                          console.log('🔍 Live MetaMask check:', { chainId, networkId, expected: walletState.networkId });
                          alert(`MetaMask Chain ID: ${chainId} (${networkId})\nApp State: ${walletState.networkId}\nMatch: ${networkId === walletState.networkId}`);
                        } catch (error) {
                          console.error('Debug check failed:', error);
                        }
                      }}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    >
                      Check MetaMask Now
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="text-xs text-gray-500 space-y-1">
                <div>💡 This panel shows real-time Web3 connection status.</div>
                <div>🔥 Use the fire button to force network sync if stuck.</div>
                <div>🔍 Use the magnifying glass to check current MetaMask network.</div>
                <div>▲ Use the collapse button above to hide all wallet details and save screen space.</div>
                <div>⚠️ If you get "circuit breaker" errors, wait 3+ seconds before reconnecting.</div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wallet;
