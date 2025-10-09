const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🔗 Portfolio Contract Interaction Script\n");

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log(`📍 Network: ${network.name} (${network.chainId})`);
  console.log(`👤 Interacting as: ${deployer.address}\n`);

  // Load deployment info
  const deploymentFile = path.join(__dirname, '..', 'deployments', `${network.name}-${network.chainId}.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment file not found. Please deploy the contract first.");
    return;
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  const contractAddress = deploymentInfo.contractAddress;
  
  console.log(`📋 Contract Address: ${contractAddress}`);

  // Connect to the deployed contract
  const Portfolio = await ethers.getContractFactory("Portfolio");
  const portfolio = Portfolio.attach(contractAddress);

  try {
    console.log("\n🔍 Reading current portfolio info...");
    
    // Get personal info
    const personalInfo = await portfolio.personalInfo();
    console.log("👤 Personal Info:");
    console.log(`   Name: ${personalInfo.name}`);
    console.log(`   Bio: ${personalInfo.bio}`);
    console.log(`   Location: ${personalInfo.location}`);
    console.log(`   Email: ${personalInfo.email}`);
    console.log(`   Profile Views: ${personalInfo.profileViews}`);

    // Get portfolio stats
    const stats = await portfolio.getPortfolioStats();
    console.log("\n📊 Portfolio Stats:");
    console.log(`   Projects: ${stats[0]}`);
    console.log(`   Education: ${stats[1]}`);
    console.log(`   Experience: ${stats[2]}`);
    console.log(`   Skills: ${stats[3]}`);
    console.log(`   Achievements: ${stats[4]}`);
    console.log(`   Total Likes: ${stats[5]}`);
    console.log(`   Total Views: ${stats[6]}`);

    console.log("\n✅ Contract is working properly!");

    // Ask user if they want to add sample data
    const addSampleData = process.env.ADD_SAMPLE_DATA === 'true';
    
    if (addSampleData) {
      console.log("\n🏗️  Adding sample portfolio data...");
      await addSamplePortfolioData(portfolio);
    } else {
      console.log("\n💡 Tip: Run with 'ADD_SAMPLE_DATA=true' to populate with sample data:");
      console.log("   ADD_SAMPLE_DATA=true npm run interact");
    }

  } catch (error) {
    console.error("❌ Error interacting with contract:", error);
  }
}

async function addSamplePortfolioData(portfolio) {
  try {
    console.log("\n📝 Adding sample projects...");
    
    // Add sample project
    await portfolio.addProject(
      "Decentralized Portfolio",
      "A blockchain-based portfolio showcasing Web3 development skills and projects",
      "https://via.placeholder.com/600x400",
      "https://github.com/yourname/decentralized-portfolio",
      "https://your-portfolio.com",
      ["React", "Solidity", "Web3.js", "Tailwind CSS"]
    );
    console.log("✅ Added sample project");

    // Add sample skill
    await portfolio.addSkill(
      "Solidity",
      "Blockchain",
      "https://via.placeholder.com/50x50",
      85
    );
    console.log("✅ Added sample skill");

    // Add sample education
    await portfolio.addEducation(
      "2020-01-01",
      "2024-01-01",
      "Bachelor of Computer Science",
      "Software Engineering, Data Structures, Algorithms, Database Management",
      "University of Technology",
      "https://via.placeholder.com/100x100",
      "A+"
    );
    console.log("✅ Added sample education");

    // Add sample experience
    await portfolio.addExperience(
      "2023-01-01",
      "2024-01-01",
      "Full-Stack Blockchain Developer",
      "Developed DeFi applications, smart contracts, and Web3 integrations",
      "Web3 Startup",
      "https://via.placeholder.com/100x100",
      ["Solidity", "React", "Node.js", "Web3.js"]
    );
    console.log("✅ Added sample experience");

    // Add sample achievement
    await portfolio.addAchievement(
      "Best DeFi Project",
      "Won first place in blockchain hackathon for innovative DeFi solution",
      "https://via.placeholder.com/300x200",
      "https://hackathon.com/verify/123",
      Math.floor(Date.now() / 1000),
      "Competition"
    );
    console.log("✅ Added sample achievement");

    console.log("\n🎉 Sample data added successfully!");
    
    // Show updated stats
    const stats = await portfolio.getPortfolioStats();
    console.log("\n📊 Updated Portfolio Stats:");
    console.log(`   Projects: ${stats[0]}`);
    console.log(`   Education: ${stats[1]}`);
    console.log(`   Experience: ${stats[2]}`);
    console.log(`   Skills: ${stats[3]}`);
    console.log(`   Achievements: ${stats[4]}`);

  } catch (error) {
    console.error("❌ Error adding sample data:", error);
  }
}

// Additional utility functions
async function viewAllProjects(portfolio) {
  console.log("\n📁 All Projects:");
  const projects = await portfolio.getAllProjects();
  projects.forEach((project, index) => {
    if (project.isActive) {
      console.log(`   ${index + 1}. ${project.name}`);
      console.log(`      Description: ${project.description}`);
      console.log(`      Technologies: ${project.technologies.join(', ')}`);
      console.log(`      Likes: ${project.likes}, Views: ${project.views}`);
      console.log(`      GitHub: ${project.githubLink}`);
      console.log(`      Live: ${project.liveLink}\n`);
    }
  });
}

async function viewAllSkills(portfolio) {
  console.log("\n🛠️  All Skills:");
  const skills = await portfolio.getAllSkills();
  skills.forEach((skill, index) => {
    if (skill.isActive) {
      console.log(`   ${index + 1}. ${skill.name} (${skill.category})`);
      console.log(`      Proficiency: ${skill.proficiencyLevel}%\n`);
    }
  });
}

// Export functions for use in other scripts
module.exports = {
  main,
  addSamplePortfolioData,
  viewAllProjects,
  viewAllSkills
};

// Run if called directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Interaction failed:", error);
      process.exit(1);
    });
} 