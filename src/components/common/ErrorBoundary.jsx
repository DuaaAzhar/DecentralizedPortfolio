import React from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiAlertTriangle, FiHome } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary Caught An Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-50 center-flex p-4">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-container p-8 rounded-3xl max-w-2xl w-full text-center relative"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 center-flex">
                <FiAlertTriangle className="w-10 h-10 text-red-400" />
              </div>
            </motion.div>

            {/* Error Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gradient-primary mb-4"
            >
              Oops! Something went wrong
            </motion.h1>

            {/* Error Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 mb-8 leading-relaxed"
            >
              We encountered an unexpected error in our decentralized portfolio. 
              Don't worry, your data is safe on the blockchain!
            </motion.p>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.details
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6 text-left"
              >
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300 mb-2">
                  🔍 View Error Details (Development Mode)
                </summary>
                <div className="bg-dark-100 rounded-lg p-4 text-xs font-mono text-red-400 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error?.toString()}
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </motion.details>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {/* Retry Button */}
              <motion.button
                onClick={this.handleRetry}
                className="btn-primary flex items-center gap-2 justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiRefreshCw className="w-4 h-4" />
                Try Again
                {this.state.retryCount > 0 && (
                  <span className="text-xs opacity-70">({this.state.retryCount})</span>
                )}
              </motion.button>

              {/* Reload Page Button */}
              <motion.button
                onClick={this.handleReload}
                className="btn-secondary flex items-center gap-2 justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiHome className="w-4 h-4" />
                Reload Page
              </motion.button>
            </motion.div>

            {/* Retry Count Info */}
            {this.state.retryCount > 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl"
              >
                <p className="text-sm text-yellow-300">
                  💡 Multiple retries detected. If the problem persists, 
                  try refreshing the page or check your network connection.
                </p>
              </motion.div>
            )}

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 pt-6 border-t border-gray-700"
            >
              <p className="text-sm text-gray-500">
                Need help? This portfolio is built on blockchain technology. 
                Make sure you have a stable internet connection and MetaMask installed.
              </p>
            </motion.div>

            {/* Floating Error Animation */}
            <div className="absolute -top-4 -right-4 w-8 h-8 pointer-events-none">
              <motion.div
                animate={{
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-full h-full bg-red-500/20 rounded-full center-flex"
              >
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 