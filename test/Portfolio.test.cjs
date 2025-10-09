const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Portfolio Contract", function () {
  let Portfolio;
  let portfolio;
  let owner;
  let addr1;
  let addr2;

  // Portfolio configuration
  const portfolioConfig = {
    name: "Test User",
    bio: "Full-Stack Blockchain Developer",
    profileImage: "https://test.com/image.jpg",
    resumeLink: "https://test.com/resume.pdf",
    location: "Global",
    email: "test@example.com",
    socialLinks: [
      "https://github.com/testuser",
      "https://linkedin.com/in/testuser"
    ]
  };

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    Portfolio = await ethers.getContractFactory("Portfolio");
    portfolio = await Portfolio.deploy(
      owner.address,
      portfolioConfig.name,
      portfolioConfig.bio,
      portfolioConfig.profileImage,
      portfolioConfig.resumeLink,
      portfolioConfig.location,
      portfolioConfig.email,
      portfolioConfig.socialLinks
    );

    await portfolio.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await portfolio.owner()).to.equal(owner.address);
    });

    it("Should initialize personal info correctly", async function () {
      const personalInfo = await portfolio.personalInfo();
      expect(personalInfo.name).to.equal(portfolioConfig.name);
      expect(personalInfo.bio).to.equal(portfolioConfig.bio);
      expect(personalInfo.email).to.equal(portfolioConfig.email);
      expect(personalInfo.location).to.equal(portfolioConfig.location);
      expect(personalInfo.totalDonations).to.equal(0);
      expect(personalInfo.profileViews).to.equal(0);
    });

    it("Should initialize with empty portfolio data", async function () {
      const stats = await portfolio.getPortfolioStats();
      expect(stats[0]).to.equal(0); // projects
      expect(stats[1]).to.equal(0); // education
      expect(stats[2]).to.equal(0); // experience
      expect(stats[3]).to.equal(0); // skills
      expect(stats[4]).to.equal(0); // achievements
    });
  });

  describe("Project Management", function () {
    it("Should add a project", async function () {
      await portfolio.addProject(
        "Test Project",
        "A test project description",
        "https://test.com/image.jpg",
        "https://github.com/test/project",
        "https://test-project.com",
        ["React", "Solidity"]
      );

      const projects = await portfolio.getAllProjects();
      expect(projects.length).to.equal(1);
      expect(projects[0].name).to.equal("Test Project");
      expect(projects[0].technologies.length).to.equal(2);
    });

    it("Should update a project", async function () {
      // Add project first
      await portfolio.addProject(
        "Test Project",
        "A test project description",
        "https://test.com/image.jpg",
        "https://github.com/test/project",
        "https://test-project.com",
        ["React", "Solidity"]
      );

      // Update the project
      await portfolio.updateProject(
        1,
        "Updated Test Project",
        "Updated description",
        "https://updated.com/image.jpg",
        "https://github.com/updated/project",
        "https://updated-project.com",
        ["React", "Solidity", "Web3"]
      );

      const project = await portfolio.projects(1);
      expect(project.name).to.equal("Updated Test Project");
      expect(project.description).to.equal("Updated description");
      expect(project.technologies.length).to.equal(3);
    });

    it("Should allow users to like projects", async function () {
      // Add project first
      await portfolio.addProject(
        "Test Project",
        "A test project description",
        "https://test.com/image.jpg",
        "https://github.com/test/project",
        "https://test-project.com",
        ["React", "Solidity"]
      );

      // Like the project from different address
      await portfolio.connect(addr1).likeProject(1);
      
      const project = await portfolio.projects(1);
      expect(project.likes).to.equal(1);
      
      // Check that user has liked
      expect(await portfolio.projectLikes(1, addr1.address)).to.equal(true);
    });

    it("Should not allow double liking", async function () {
      // Add project first
      await portfolio.addProject(
        "Test Project",
        "A test project description",
        "https://test.com/image.jpg",
        "https://github.com/test/project",
        "https://test-project.com",
        ["React", "Solidity"]
      );

      // Like the project
      await portfolio.connect(addr1).likeProject(1);
      
      // Try to like again - should fail
      await expect(
        portfolio.connect(addr1).likeProject(1)
      ).to.be.revertedWith("Already liked this project");
    });

    it("Should increment project views", async function () {
      // Add project first
      await portfolio.addProject(
        "Test Project",
        "A test project description",
        "https://test.com/image.jpg",
        "https://github.com/test/project",
        "https://test-project.com",
        ["React", "Solidity"]
      );

      // View the project
      await portfolio.connect(addr1).viewProject(1);
      
      const project = await portfolio.projects(1);
      expect(project.views).to.equal(1);
    });

    it("Should only allow owner to add projects", async function () {
      await expect(
        portfolio.connect(addr1).addProject(
          "Test Project",
          "A test project description",
          "https://test.com/image.jpg",
          "https://github.com/test/project",
          "https://test-project.com",
          ["React", "Solidity"]
        )
      ).to.be.revertedWithCustomError(portfolio, "OwnableUnauthorizedAccount");
    });
  });

  describe("Skills Management", function () {
    it("Should add a skill", async function () {
      await portfolio.addSkill(
        "Solidity",
        "Blockchain",
        "https://test.com/solidity.png",
        85
      );

      const skills = await portfolio.getAllSkills();
      expect(skills.length).to.equal(1);
      expect(skills[0].name).to.equal("Solidity");
      expect(skills[0].proficiencyLevel).to.equal(85);
    });

    it("Should not allow proficiency level above 100", async function () {
      await expect(
        portfolio.addSkill(
          "Solidity",
          "Blockchain",
          "https://test.com/solidity.png",
          150
        )
      ).to.be.revertedWith("Proficiency level must be between 0-100");
    });

    it("Should get skills by category", async function () {
      // Add multiple skills with different categories
      await portfolio.addSkill("Solidity", "Blockchain", "test.png", 85);
      await portfolio.addSkill("React", "Frontend", "test.png", 90);
      await portfolio.addSkill("Web3.js", "Blockchain", "test.png", 80);

      const blockchainSkills = await portfolio.getSkillsByCategory("Blockchain");
      expect(blockchainSkills.length).to.equal(2);
      
      const frontendSkills = await portfolio.getSkillsByCategory("Frontend");
      expect(frontendSkills.length).to.equal(1);
    });
  });

  describe("Education Management", function () {
    it("Should add education", async function () {
      await portfolio.addEducation(
        "2020-01-01",
        "2024-01-01",
        "Bachelor of Computer Science",
        "Software Engineering, Algorithms",
        "Test University",
        "https://test.com/logo.png",
        "A+"
      );

      const education = await portfolio.getAllEducations();
      expect(education.length).to.equal(1);
      expect(education[0].degree).to.equal("Bachelor of Computer Science");
      expect(education[0].grade).to.equal("A+");
    });
  });

  describe("Experience Management", function () {
    it("Should add experience", async function () {
      await portfolio.addExperience(
        "2023-01-01",
        "2024-01-01",
        "Blockchain Developer",
        "Developed DeFi applications",
        "Web3 Company",
        "https://test.com/company.png",
        ["Solidity", "React", "Web3"]
      );

      const experiences = await portfolio.getAllExperiences();
      expect(experiences.length).to.equal(1);
      expect(experiences[0].designation).to.equal("Blockchain Developer");
      expect(experiences[0].skills.length).to.equal(3);
    });
  });

  describe("Achievements Management", function () {
    it("Should add achievement", async function () {
      const achievementDate = Math.floor(Date.now() / 1000);
      
      await portfolio.addAchievement(
        "Best DeFi Project",
        "Won hackathon",
        "https://test.com/achievement.png",
        "https://verify.com/123",
        achievementDate,
        "Competition"
      );

      const achievements = await portfolio.getAllAchievements();
      expect(achievements.length).to.equal(1);
      expect(achievements[0].title).to.equal("Best DeFi Project");
      expect(achievements[0].category).to.equal("Competition");
    });
  });

  describe("Personal Info Management", function () {
    it("Should update personal info", async function () {
      const newSocialLinks = ["https://github.com/newuser"];
      
      await portfolio.updatePersonalInfo(
        "Updated Name",
        "Updated Bio",
        "https://new-image.com",
        "https://new-resume.com",
        "New Location",
        newSocialLinks,
        "new@email.com"
      );

      const personalInfo = await portfolio.personalInfo();
      expect(personalInfo.name).to.equal("Updated Name");
      expect(personalInfo.bio).to.equal("Updated Bio");
      expect(personalInfo.email).to.equal("new@email.com");
    });

    it("Should increment profile views", async function () {
      await portfolio.incrementProfileViews();
      await portfolio.incrementProfileViews();

      const personalInfo = await portfolio.personalInfo();
      expect(personalInfo.profileViews).to.equal(2);
    });
  });

  describe("Donations", function () {
    it("Should accept donations", async function () {
      const donationAmount = ethers.parseEther("1.0");
      
      await portfolio.connect(addr1).donateEth({ value: donationAmount });
      
      const personalInfo = await portfolio.personalInfo();
      expect(personalInfo.totalDonations).to.equal(donationAmount);
    });

    it("Should not accept zero donations", async function () {
      await expect(
        portfolio.connect(addr1).donateEth({ value: 0 })
      ).to.be.revertedWith("Donation amount must be greater than 0");
    });

    it("Should transfer donations to owner", async function () {
      const donationAmount = ethers.parseEther("1.0");
      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      await portfolio.connect(addr1).donateEth({ value: donationAmount });
      
      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      expect(finalOwnerBalance).to.be.gt(initialOwnerBalance);
    });
  });

  describe("Portfolio Stats", function () {
    it("Should return correct portfolio statistics", async function () {
      // Add some data
      await portfolio.addProject("Test Project", "Description", "image", "github", "live", ["React"]);
      await portfolio.addSkill("Solidity", "Blockchain", "icon", 85);
      await portfolio.addEducation("2020", "2024", "Degree", "Knowledge", "University", "logo", "A+");
      
      // Like and view the project
      await portfolio.connect(addr1).likeProject(1);
      await portfolio.connect(addr1).viewProject(1);
      
      const stats = await portfolio.getPortfolioStats();
      expect(stats[0]).to.equal(1); // projects
      expect(stats[3]).to.equal(1); // skills
      expect(stats[1]).to.equal(1); // education
      expect(stats[5]).to.equal(1); // total likes
      expect(stats[6]).to.equal(1); // total views
    });
  });

  describe("Toggle Status Functions", function () {
    it("Should toggle project status", async function () {
      await portfolio.addProject("Test Project", "Description", "image", "github", "live", ["React"]);
      
      // Toggle to inactive
      await portfolio.toggleProjectStatus(1);
      const project = await portfolio.projects(1);
      expect(project.isActive).to.equal(false);
      
      // Toggle back to active
      await portfolio.toggleProjectStatus(1);
      const updatedProject = await portfolio.projects(1);
      expect(updatedProject.isActive).to.equal(true);
    });
  });
}); 