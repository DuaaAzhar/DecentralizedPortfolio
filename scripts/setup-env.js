const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log("🔧 Portfolio Contract Environment Setup\n");
  console.log("This script will help you create a .env file with your configuration.\n");

  const config = {};

  // Portfolio owner information
  console.log("👤 Portfolio Owner Information:");
  config.name = await askQuestion("Enter your name: ") || "Your Name";
  config.bio = await askQuestion("Enter your bio: ") || "Full-Stack Blockchain Developer";
  config.location = await askQuestion("Enter your location: ") || "Global";
  config.email = await askQuestion("Enter your email: ") || "your@email.com";
  
  console.log("\n🔐 Blockchain Configuration:");
  config.privateKey = await askQuestion("Enter your wallet private key (without 0x): ");
  
  console.log("\n🌐 RPC URLs (optional, press Enter to use defaults):");
  config.sepoliaRPC = await askQuestion("Sepolia RPC URL: ") || "https://rpc.sepolia.org";
  config.mumbaiRPC = await askQuestion("Mumbai RPC URL: ") || "https://rpc-mumbai.maticvigil.com";
  
  console.log("\n🔍 API Keys for verification (optional):");
  config.etherscanAPI = await askQuestion("Etherscan API key: ") || "";
  config.polygonscanAPI = await askQuestion("Polygonscan API key: ") || "";

  // Generate .env content
  const envContent = `# Private key for deployment (without 0x prefix)
PRIVATE_KEY=${config.privateKey}

# RPC URLs
SEPOLIA_RPC_URL=${config.sepoliaRPC}
MUMBAI_RPC_URL=${config.mumbaiRPC}
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# API Keys for verification
ETHERSCAN_API_KEY=${config.etherscanAPI}
POLYGONSCAN_API_KEY=${config.polygonscanAPI}
BSCSCAN_API_KEY=

# Gas reporting
REPORT_GAS=true

# Deployment configuration
PORTFOLIO_OWNER_NAME="${config.name}"
PORTFOLIO_OWNER_BIO="${config.bio}"
PORTFOLIO_OWNER_PROFILE_IMAGE="https://via.placeholder.com/400x400"
PORTFOLIO_OWNER_RESUME_LINK="https://via.placeholder.com/resume.pdf"
PORTFOLIO_OWNER_LOCATION="${config.location}"
PORTFOLIO_OWNER_EMAIL="${config.email}"
`;

  // Write .env file
  const envPath = path.join(__dirname, '..', '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log(`\n✅ Environment file created at: ${envPath}`);
  console.log("\n📋 Next steps:");
  console.log("1. Review and update the .env file with your actual values");
  console.log("2. Install dependencies: npm install");
  console.log("3. Compile contracts: npm run compile");
  console.log("4. Deploy to testnet: npm run deploy:sepolia");
  console.log("5. Interact with contract: npm run interact");
  
  rl.close();
}

main().catch((error) => {
  console.error("❌ Error setting up environment:", error);
  process.exit(1);
}); 