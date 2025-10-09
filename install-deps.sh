#!/bin/bash

echo "🚀 Installing Modern Decentralized Portfolio Dependencies..."
echo "=================================================="

# Install all new dependencies
npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "🎨 Setting up TailwindCSS..."
npx tailwindcss init -p

echo ""
echo "🔧 Setting up project structure..."

# Create missing directories if they don't exist
mkdir -p src/components/common
mkdir -p src/components/navigation
mkdir -p src/components/footer

echo ""
echo "✨ Modern Portfolio Setup Complete!"
echo "=================================================="
echo ""
echo "📖 Next Steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Connect your MetaMask wallet"
echo "3. Switch to Sepolia or Mumbai testnet"
echo "4. Enjoy your new modern decentralized portfolio! 🎉"
echo ""
echo "🔗 Features Added:"
echo "• Beautiful glassmorphism design"
echo "• Smooth animations with Framer Motion"
echo "• Dark/Light theme toggle"
echo "• Enhanced Web3 integration"
echo "• Mobile-responsive navigation"
echo "• Loading states and error boundaries"
echo "• Modern UI components"
echo "" 