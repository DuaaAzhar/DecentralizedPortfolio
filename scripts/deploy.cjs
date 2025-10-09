const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting Portfolio contract deployment...\n");

  // Get network info
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log(`📍 Network: ${network.name} (${network.chainId})`);
  console.log(`👤 Deploying from: ${deployer.address}`);
  console.log(`💰 Balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH\n`);

  // Portfolio owner configuration
  const portfolioConfig = {
    owner: deployer.address, // The deployer will be the owner
    name: process.env.PORTFOLIO_OWNER_NAME || "Your Name",
    bio: process.env.PORTFOLIO_OWNER_BIO || "Full-Stack Blockchain Developer passionate about Web3 and DeFi",
    profileImage: process.env.PORTFOLIO_OWNER_PROFILE_IMAGE || "https://via.placeholder.com/400x400",
    resumeLink: process.env.PORTFOLIO_OWNER_RESUME_LINK || "https://via.placeholder.com/resume.pdf",
    location: process.env.PORTFOLIO_OWNER_LOCATION || "Global",
    email: process.env.PORTFOLIO_OWNER_EMAIL || "contact@example.com",
    socialLinks: [
      "https://github.com/DuaaAzhar",
      "https://www.linkedin.com/in/duaa-azhar-445579209/",
      "https://x.com/i/flow/login?lang=en"
    ]
  };

  console.log("📋 Portfolio Configuration:");
  console.log(`   Name: ${portfolioConfig.name}`);
  console.log(`   Location: ${portfolioConfig.location}`);
  console.log(`   Email: ${portfolioConfig.email}`);
  console.log(`   Owner: ${portfolioConfig.owner}\n`);

  // Deploy the contract
  console.log("🔄 Deploying Portfolio contract...");
  
  const Portfolio = await ethers.getContractFactory("Portfolio");
  const portfolio = await Portfolio.deploy(
    portfolioConfig.owner,
    portfolioConfig.name,
    portfolioConfig.bio,
    portfolioConfig.profileImage,
    portfolioConfig.resumeLink,
    portfolioConfig.location,
    portfolioConfig.email,
    portfolioConfig.socialLinks
  );

  await portfolio.waitForDeployment();
  const contractAddress = await portfolio.getAddress();

  console.log(`✅ Portfolio deployed to: ${contractAddress}`);
  console.log(`🔗 Transaction hash: ${portfolio.deploymentTransaction().hash}\n`);

  // Wait for a few confirmations on live networks
  if (network.chainId !== 31337n) {
    console.log("⏳ Waiting for confirmations...");
    await portfolio.deploymentTransaction().wait(2);
    console.log("✅ Confirmed!\n");
  }

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    transactionHash: portfolio.deploymentTransaction().hash,
    portfolioConfig: portfolioConfig,
    gasUsed: portfolio.deploymentTransaction().gasLimit?.toString() || "N/A",
    gasPrice: portfolio.deploymentTransaction().gasPrice?.toString() || "N/A"
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `${network.name}-${network.chainId}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`💾 Deployment info saved to: ${deploymentFile}`);

  // Update the frontend ABI file
  const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'Portfolio.sol', 'Portfolio.json');
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const frontendABIPath = path.join(__dirname, '..', 'src', 'components', 'Wallet', 'ABI.json');
    
    // Update ABI in frontend
    fs.writeFileSync(frontendABIPath, JSON.stringify(artifact.abi, null, 2));
    console.log(`📱 Frontend ABI updated at: ${frontendABIPath}`);
  }

  // Display next steps
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next Steps:");
  console.log(`1. Update your frontend with the new contract address: ${contractAddress}`);
  console.log(`2. Add the contract address to your Wallet.jsx supportedNetworks configuration`);
  console.log(`3. Run 'npm run interact' to test contract interaction`);
  
  if (network.chainId !== 31337n) {
    console.log(`4. Verify contract on block explorer with: npm run verify:${network.name} ${contractAddress}`);
  }

  return {
    contractAddress,
    deploymentInfo
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 