import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

// Components
import Hero from "./components/hero/Hero";
import Wallet from "./components/Wallet/Wallet";
import Handles from "./components/handles/Handles";
import Projects from "./components/projects/Projects";
import Skills from "./components/skills/Skills";
import Experience from "./components/experience/Experience";
import Contact from "./components/contact/Contact";
import LoadingScreen from "./components/common/LoadingScreen";
import ThemeToggle from "./components/common/ThemeToggle";
import ScrollToTop from "./components/common/ScrollToTop";
import Navigation from "./components/navigation/Navigation";
import Footer from "./components/footer/Footer";
import ErrorBoundary from "./components/common/ErrorBoundary";


// Context for global state management
const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

const App = () => {
  // Enhanced state management
  const [state, setState] = useState({
    web3: null,
    contract: null,
    account: null,
    networkId: null,
    isConnected: false,
    isCorrectNetwork: false,
  });

  const [appState, setAppState] = useState({
    loading: false,
    theme: "dark",
    error: null,
    isOnline: navigator.onLine,
  });

  const [portfolioData, setPortfolioData] = useState({
    personalInfo: null,
    projects: [],
    educations: [],
    experiences: [],
    skills: [],
    achievements: [],
    stats: null,
  });


  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });

    // Always show main content after initial load
    const timer = setTimeout(() => {
      setAppState((prev) => ({ ...prev, loading: false }));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Make toasts dismissible by clicking on them
  useEffect(() => {
    const handleToastClick = (e) => {
      // Find the toast element using multiple selectors to catch all react-hot-toast variations
      const toastElement = e.target.closest(
        '[role="status"], [role="alert"], [data-hot-toast], .toast-container > div'
      );

      if (toastElement) {
        e.preventDefault();
        e.stopPropagation();

        // Get toast text for logging
        const toastText =
          toastElement.textContent || toastElement.innerText || "";
        console.log(
          "🎯 Toast clicked, dismissing:",
          toastText.substring(0, 50) + "..."
        );

        // Multiple dismissal approaches for maximum compatibility

        // Method 1: Try to get the specific toast ID
        const toastId =
          toastElement.getAttribute("data-hot-toast") ||
          toastElement.getAttribute("data-testid") ||
          toastElement.id;

        if (toastId) {
          toast.dismiss(toastId);
          console.log("✅ Toast dismissed by ID:", toastId);
          return;
        }

        // Method 2: Find and dismiss by content matching
        // This works with react-hot-toast's internal structure
        const toastList = document.querySelectorAll(
          '[role="status"], [role="alert"], [data-hot-toast]'
        );
        let dismissed = false;

        toastList.forEach((t) => {
          if (!dismissed && (t === toastElement || t.contains(e.target))) {
            // Try to find a parent with data attribute that might be the real toast
            let targetToast = t;
            while (targetToast && targetToast.parentElement) {
              if (targetToast.getAttribute("data-hot-toast")) {
                break;
              }
              targetToast = targetToast.parentElement;
            }

            const specificId = targetToast?.getAttribute("data-hot-toast");
            if (specificId) {
              toast.dismiss(specificId);
              dismissed = true;
              console.log("✅ Toast dismissed by specific ID:", specificId);
              return;
            }
          }
        });

        // Method 3: Fallback - dismiss all toasts (last resort)
        if (!dismissed) {
          console.log("⚡ Fallback: dismissing all toasts");
          toast.dismiss();
        }
      }
    };

    // Add global click listener for toasts with capture phase
    document.addEventListener("click", handleToastClick, true);

    return () => {
      document.removeEventListener("click", handleToastClick, true);
    };
  }, []);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
    setAppState((prev) => ({ ...prev, theme: savedTheme }));
    document.documentElement.setAttribute("data-theme", savedTheme);

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setAppState((prev) => ({ ...prev, isOnline: true }));
      toast.success("Connection restored!", { id: "connection" });
    };

    const handleOffline = () => {
      setAppState((prev) => ({ ...prev, isOnline: false }));
      toast.error("You are offline", { id: "connection" });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Enhanced state management functions
  const saveWeb3State = (newState) => {
    const wasConnected = state.isConnected;

    setState((prevState) => ({
      ...prevState,
      ...newState,
      isConnected: !!(newState.web3 && newState.contract && newState.account),
      isCorrectNetwork:
        newState.networkId === 11155111 || newState.networkId === 80001, // Sepolia or Mumbai
    }));

    console.log("Web3 State Updated:", newState);

    // Only load portfolio data on INITIAL connection, not on network switches
    if (newState.web3 && newState.contract && !wasConnected) {
      console.log("🎯 Initial wallet connection - loading portfolio data...");
      loadPortfolioData(newState.contract);
    } else if (newState.isConnected && !newState.contract) {
      console.log(
        "⚠️ Network switch detected - contract not available on this network"
      );
      // Clear existing portfolio data since contract isn't available
      setPortfolioData({
        personalInfo: null,
        projects: [],
        educations: [],
        experiences: [],
        skills: [],
        achievements: [],
        stats: null,
      });
    }
  };

  const loadPortfolioData = async (contract) => {
    if (!contract) return;

    try {
      // Don't show loading screen when fetching data, just update portfolio data

      // Load portfolio data individually to better handle any ABI issues
      let personalInfo,
        projects,
        educations,
        experiences,
        skills,
        achievements,
        stats;

      try {
        personalInfo = await contract.personalInfo();
        console.log("✅ Personal info loaded");
      } catch (error) {
        console.error("❌ Failed to load personal info:", error);
        personalInfo = {};
      }

      try {
        projects = await contract.getAllProjects();
        console.log("✅ Projects loaded:", projects.length);
      } catch (error) {
        console.error("❌ Failed to load projects:", error);
        projects = [];
      }

      try {
        educations = await contract.getAllEducations();
        console.log("✅ Educations loaded:", educations.length);
      } catch (error) {
        console.error("❌ Failed to load educations:", error);
        educations = [];
      }

      try {
        experiences = await contract.getAllExperiences();
        console.log("✅ Experiences loaded:", experiences.length);
      } catch (error) {
        console.error("❌ Failed to load experiences:", error);
        experiences = [];
      }

      try {
        skills = await contract.getAllSkills();
        console.log("✅ Skills loaded:", skills.length);
      } catch (error) {
        console.error("❌ Failed to load skills:", error);
        skills = [];
      }

      try {
        achievements = await contract.getAllAchievements();
        console.log("✅ Achievements loaded:", achievements.length);
      } catch (error) {
        console.error("❌ Failed to load achievements:", error);
        achievements = [];
      }

      try {
        stats = await contract.getPortfolioStats();
        console.log("✅ Stats loaded:", stats);
      } catch (error) {
        console.error("❌ Failed to load stats:", error);
        // Provide default stats structure
        stats = {
          totalProjects: projects.length || 0,
          totalEducations: educations.length || 0,
          totalExperiences: experiences.length || 0,
          totalSkills: skills.length || 0,
          totalAchievements: achievements.length || 0,
          totalLikes: 0,
          totalViews: 0,
          profileViews: 0,
          totalDonations: 0,
        };
      }

      setPortfolioData({
        personalInfo,
        projects: projects.filter((p) => p.isActive),
        educations: educations.filter((e) => e.isActive),
        experiences: experiences.filter((e) => e.isActive),
        skills: skills.filter((s) => s.isActive),
        achievements: achievements.filter((a) => a.isActive),
        stats,
      });

      // Increment profile views
      try {
        await contract.incrementProfileViews();
      } catch (error) {
        console.log("Could not increment profile views:", error);
      }

      // Portfolio data loaded successfully - no toast needed, user can see the data
    } catch (error) {
      console.error("Error loading portfolio data:", error);

      // Handle specific contract errors more gracefully
      if (error.message?.includes("execution reverted")) {
        console.log(
          "Contract call reverted - likely contract not deployed on this network"
        );
        toast.error("Smart contract not available on this network", {
          duration: 2500,
          id: "contract-unavailable",
        });
      } else if (error.message?.includes("network")) {
        toast.error("Network connection issue", {
          duration: 2000,
          id: "network-issue",
        });
      } else {
        toast.error("Failed to load portfolio data", {
          duration: 2000,
          id: "load-portfolio-error",
        });
      }

      // Don't set app error state for contract issues - they're recoverable
      // setAppState(prev => ({ ...prev, error: error.message }));
    }
  };

  const toggleTheme = () => {
    const newTheme = appState.theme === "dark" ? "light" : "dark";
    setAppState((prev) => ({ ...prev, theme: newTheme }));
    document.documentElement.setAttribute("data-theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("portfolio-theme", newTheme);
    toast.success(`Switched to ${newTheme} theme`);
  };

  const clearError = () => {
    setAppState((prev) => ({ ...prev, error: null }));
  };

  // Context value
  const contextValue = {
    ...state,
    ...appState,
    portfolioData,
    saveWeb3State,
    toggleTheme,
    clearError,
    loadPortfolioData,
  };

  // Loading screen - only show during initial app load
  if (appState.loading) {
    return <LoadingScreen />;
  }

  // Page variants for animations
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <ErrorBoundary>
      <AppContext.Provider value={contextValue}>
        <div className="min-h-screen bg-dark-50 bg-pattern-dots overflow-x-hidden">
          {/* Animated background gradient */}
          <div className="fixed inset-0 bg-animated-gradient opacity-10 pointer-events-none" />

          {/* Toast notifications - Quick & Dismissible */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2000, // Reduced from 4000ms to 2000ms
              // Custom toast renderer to ensure single close button
              dismissible: true,
              style: {
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                cursor: "pointer", // Show it's clickable
                fontSize: "14px",
                padding: "12px 16px",
                borderRadius: "12px",
                maxWidth: "400px",
              },
              success: {
                duration: 1500, // Even faster for success messages
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 3000, // Slightly longer for errors so user can read them
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
              loading: {
                duration: Infinity, // Loading toasts should stay until manually dismissed
                style: {
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                },
              },
            }}
            
          />

          {/* Wallet Connection - Now includes navigation */}
          <Wallet saveState={saveWeb3State} />

          {/* Main Content */}
          <motion.main
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {/* Hero Section */}
            <Hero
              state={state}
              personalInfo={portfolioData.personalInfo}
              stats={portfolioData.stats}
            />

            {/* Social Handles */}
            <Handles personalInfo={portfolioData.personalInfo} />

            {/* Projects Section */}
            <Projects
              state={state}
              projects={portfolioData.projects}
              loading={appState.loading}
            />

            {/* Skills Section */}
            <Skills skills={portfolioData.skills} loading={appState.loading} />

            {/* Experience & Education */}
            <Experience
              state={state}
              experiences={portfolioData.experiences}
              educations={portfolioData.educations}
              loading={appState.loading}
            />

            {/* Contact Section */}
            <Contact
              state={state}
              personalInfo={portfolioData.personalInfo}
              loading={appState.loading}
            />
          </motion.main>

          {/* Footer */}
          <Footer personalInfo={portfolioData.personalInfo} />

          {/* Floating UI Elements */}
          <ThemeToggle theme={appState.theme} onToggle={toggleTheme} />
          <ScrollToTop />

          {/* Offline indicator */}
          {!appState.isOnline && (
            <motion.div
              key="offline-indicator"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="fixed bottom-4 left-4 glass-container p-3 rounded-lg z-50"
            >
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>You're offline</span>
              </div>
            </motion.div>
          )}

          {/* Error Display */}
          {appState.error && (
            <motion.div
              key={`error-display-${appState.error}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass-container p-6 rounded-2xl z-50 max-w-md"
            >
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-red-400">
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-300 mb-4">{appState.error}</p>
                <button onClick={clearError} className="btn-primary">
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Data loading happens in background - no overlay needed */}
        </div>
     
        
      </AppContext.Provider>
  
       
    </ErrorBoundary>
  );
};

export default App;
