// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Enhanced Decentralized Portfolio
 * @dev A comprehensive portfolio smart contract with dynamic content and social features
 */
contract Portfolio is Ownable, ReentrancyGuard {
    
    // Counters for unique IDs
    uint256 private _projectIds;
    uint256 private _educationIds;
    uint256 private _experienceIds;
    uint256 private _skillIds;
    uint256 private _achievementIds;
    
    // Enhanced structs with more fields
    struct Project {
        uint256 id;
        string name;
        string description;
        string image;
        string githubLink;
        string liveLink;
        string[] technologies;
        uint256 likes;
        uint256 views;
        uint256 createdAt;
        bool isActive;
    }

    struct Education {
        uint256 id;
        string startDate;
        string endDate;
        string degree;
        string knowledgeAcquired;
        string institutionName;
        string institutionLogo;
        string grade;
        uint256 createdAt;
        bool isActive;
    }

    struct Experience {
        uint256 id;
        string startDate;
        string endDate;
        string designation;
        string experienceAcquired;
        string companyName;
        string companyLogo;
        string[] skills;
        uint256 createdAt;
        bool isActive;
    }
    
    struct Skill {
        uint256 id;
        string name;
        string category; // Frontend, Backend, Blockchain, etc.
        string icon;
        uint256 proficiencyLevel; // 1-100
        uint256 createdAt;
        bool isActive;
    }
    
    struct Achievement {
        uint256 id;
        string title;
        string description;
        string image;
        string verificationLink;
        uint256 date;
        string category;
        bool isActive;
    }
    
    struct PersonalInfo {
        string name;
        string bio;
        string profileImage;
        string resumeLink;
        string location;
        string[] socialLinks;
        string email;
        uint256 totalDonations;
        uint256 profileViews;
        uint256 lastUpdated;
    }
    
    // Storage mappings
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Education) public educations;
    mapping(uint256 => Experience) public experiences;
    mapping(uint256 => Skill) public skills;
    mapping(uint256 => Achievement) public achievements;
    mapping(address => bool) public hasLikedProject;
    mapping(uint256 => mapping(address => bool)) public projectLikes;
    
    // Arrays to track all IDs
    uint256[] public projectIds;
    uint256[] public educationIds;
    uint256[] public experienceIds;
    uint256[] public skillIds;
    uint256[] public achievementIds;
    
    PersonalInfo public personalInfo;
    
    // Events
    event ProjectAdded(uint256 indexed id, string name);
    event ProjectUpdated(uint256 indexed id);
    event ProjectLiked(uint256 indexed id, address indexed liker);
    event ProjectViewed(uint256 indexed id);
    event EducationAdded(uint256 indexed id, string degree);
    event ExperienceAdded(uint256 indexed id, string designation);
    event SkillAdded(uint256 indexed id, string name);
    event AchievementAdded(uint256 indexed id, string title);
    event DonationReceived(address indexed donor, uint256 amount);
    event ProfileUpdated();
    
    constructor(
        address initialOwner,
        string memory _name,
        string memory _bio,
        string memory _profileImage,
        string memory _resumeLink,
        string memory _location,
        string memory _email,
        string[] memory _socialLinks
    ) Ownable(initialOwner) {
        // Initialize with provided personal info
        personalInfo = PersonalInfo({
            name: _name,
            bio: _bio,
            profileImage: _profileImage,
            resumeLink: _resumeLink,
            location: _location,
            socialLinks: _socialLinks,
            email: _email,
            totalDonations: 0,
            profileViews: 0,
            lastUpdated: block.timestamp
        });
    }
    
    // Project Management Functions
    function addProject(
        string memory _name,
        string memory _description,
        string memory _image,
        string memory _githubLink,
        string memory _liveLink,
        string[] memory _technologies
    ) external onlyOwner {
        ++_projectIds;
        uint256 newProjectId = _projectIds;
        
        projects[newProjectId] = Project({
            id: newProjectId,
            name: _name,
            description: _description,
            image: _image,
            githubLink: _githubLink,
            liveLink: _liveLink,
            technologies: _technologies,
            likes: 0,
            views: 0,
            createdAt: block.timestamp,
            isActive: true
        });
        
        projectIds.push(newProjectId);
        emit ProjectAdded(newProjectId, _name);
    }
    
    function updateProject(
        uint256 _id,
        string memory _name,
        string memory _description,
        string memory _image,
        string memory _githubLink,
        string memory _liveLink,
        string[] memory _technologies
    ) external onlyOwner {
        require(projects[_id].isActive, "Project does not exist or is inactive");
        
        Project storage project = projects[_id];
        project.name = _name;
        project.description = _description;
        project.image = _image;
        project.githubLink = _githubLink;
        project.liveLink = _liveLink;
        project.technologies = _technologies;
        
        emit ProjectUpdated(_id);
    }
    
    function likeProject(uint256 _projectId) external {
        require(projects[_projectId].isActive, "Project does not exist");
        require(!projectLikes[_projectId][msg.sender], "Already liked this project");
        
        projectLikes[_projectId][msg.sender] = true;
        projects[_projectId].likes++;
        
        emit ProjectLiked(_projectId, msg.sender);
    }
    
    function viewProject(uint256 _projectId) external {
        require(projects[_projectId].isActive, "Project does not exist");
        projects[_projectId].views++;
        emit ProjectViewed(_projectId);
    }
    
    // Education Management Functions
    function addEducation(
        string memory _startDate,
        string memory _endDate,
        string memory _degree,
        string memory _knowledgeAcquired,
        string memory _institutionName,
        string memory _institutionLogo,
        string memory _grade
    ) external onlyOwner {
        ++_educationIds;
        uint256 newEducationId = _educationIds;
        
        educations[newEducationId] = Education({
            id: newEducationId,
            startDate: _startDate,
            endDate: _endDate,
            degree: _degree,
            knowledgeAcquired: _knowledgeAcquired,
            institutionName: _institutionName,
            institutionLogo: _institutionLogo,
            grade: _grade,
            createdAt: block.timestamp,
            isActive: true
        });
        
        educationIds.push(newEducationId);
        emit EducationAdded(newEducationId, _degree);
    }
    
    // Experience Management Functions
    function addExperience(
        string memory _startDate,
        string memory _endDate,
        string memory _designation,
        string memory _experienceAcquired,
        string memory _companyName,
        string memory _companyLogo,
        string[] memory _skills
    ) external onlyOwner {
        ++_experienceIds;
        uint256 newExperienceId = _experienceIds;
        
        experiences[newExperienceId] = Experience({
            id: newExperienceId,
            startDate: _startDate,
            endDate: _endDate,
            designation: _designation,
            experienceAcquired: _experienceAcquired,
            companyName: _companyName,
            companyLogo: _companyLogo,
            skills: _skills,
            createdAt: block.timestamp,
            isActive: true
        });
        
        experienceIds.push(newExperienceId);
        emit ExperienceAdded(newExperienceId, _designation);
    }
    
    // Skills Management Functions
    function addSkill(
        string memory _name,
        string memory _category,
        string memory _icon,
        uint256 _proficiencyLevel
    ) external onlyOwner {
        require(_proficiencyLevel <= 100, "Proficiency level must be between 0-100");
        
        ++_skillIds;
        uint256 newSkillId = _skillIds;
        
        skills[newSkillId] = Skill({
            id: newSkillId,
            name: _name,
            category: _category,
            icon: _icon,
            proficiencyLevel: _proficiencyLevel,
            createdAt: block.timestamp,
            isActive: true
        });
        
        skillIds.push(newSkillId);
        emit SkillAdded(newSkillId, _name);
    }
    
    // Achievement Management Functions
    function addAchievement(
        string memory _title,
        string memory _description,
        string memory _image,
        string memory _verificationLink,
        uint256 _date,
        string memory _category
    ) external onlyOwner {
        ++_achievementIds;
        uint256 newAchievementId = _achievementIds;
        
        achievements[newAchievementId] = Achievement({
            id: newAchievementId,
            title: _title,
            description: _description,
            image: _image,
            verificationLink: _verificationLink,
            date: _date,
            category: _category,
            isActive: true
        });
        
        achievementIds.push(newAchievementId);
        emit AchievementAdded(newAchievementId, _title);
    }
    
    // Personal Info Management
    function updatePersonalInfo(
        string memory _name,
        string memory _bio,
        string memory _profileImage,
        string memory _resumeLink,
        string memory _location,
        string[] memory _socialLinks,
        string memory _email
    ) external onlyOwner {
        personalInfo.name = _name;
        personalInfo.bio = _bio;
        personalInfo.profileImage = _profileImage;
        personalInfo.resumeLink = _resumeLink;
        personalInfo.location = _location;
        personalInfo.socialLinks = _socialLinks;
        personalInfo.email = _email;
        personalInfo.lastUpdated = block.timestamp;
        
        emit ProfileUpdated();
    }
    
    // View Functions
    function getAllProjects() external view returns (Project[] memory) {
        Project[] memory allProjects = new Project[](projectIds.length);
        for (uint256 i = 0; i < projectIds.length; i++) {
            allProjects[i] = projects[projectIds[i]];
        }
        return allProjects;
    }
    
    function getAllEducations() external view returns (Education[] memory) {
        Education[] memory allEducations = new Education[](educationIds.length);
        for (uint256 i = 0; i < educationIds.length; i++) {
            allEducations[i] = educations[educationIds[i]];
        }
        return allEducations;
    }
    
    function getAllExperiences() external view returns (Experience[] memory) {
        Experience[] memory allExperiences = new Experience[](experienceIds.length);
        for (uint256 i = 0; i < experienceIds.length; i++) {
            allExperiences[i] = experiences[experienceIds[i]];
        }
        return allExperiences;
    }
    
    function getAllSkills() external view returns (Skill[] memory) {
        Skill[] memory allSkills = new Skill[](skillIds.length);
        for (uint256 i = 0; i < skillIds.length; i++) {
            allSkills[i] = skills[skillIds[i]];
        }
        return allSkills;
    }
    
    function getAllAchievements() external view returns (Achievement[] memory) {
        Achievement[] memory allAchievements = new Achievement[](achievementIds.length);
        for (uint256 i = 0; i < achievementIds.length; i++) {
            allAchievements[i] = achievements[achievementIds[i]];
        }
        return allAchievements;
    }
    
    function getSkillsByCategory(string memory _category) external view returns (Skill[] memory) {
        uint256 count = 0;
        
        // First count matching skills
        for (uint256 i = 0; i < skillIds.length; i++) {
            if (keccak256(bytes(skills[skillIds[i]].category)) == keccak256(bytes(_category)) && skills[skillIds[i]].isActive) {
                count++;
            }
        }
        
        // Create array with correct size
        Skill[] memory categorySkills = new Skill[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < skillIds.length; i++) {
            if (keccak256(bytes(skills[skillIds[i]].category)) == keccak256(bytes(_category)) && skills[skillIds[i]].isActive) {
                categorySkills[index] = skills[skillIds[i]];
                index++;
            }
        }
        
        return categorySkills;
    }
    
    // Analytics Functions
    function incrementProfileViews() external {
        personalInfo.profileViews++;
    }
    
    function getPortfolioStats() external view returns (
        uint256 totalProjects,
        uint256 totalEducations,
        uint256 totalExperiences,
        uint256 totalSkills,
        uint256 totalAchievements,
        uint256 totalLikes,
        uint256 totalViews,
        uint256 profileViews,
        uint256 totalDonations
    ) {
        uint256 likes = 0;
        uint256 views = 0;
        
        for (uint256 i = 0; i < projectIds.length; i++) {
            likes += projects[projectIds[i]].likes;
            views += projects[projectIds[i]].views;
        }
        
        return (
            projectIds.length,
            educationIds.length,
            experienceIds.length,
            skillIds.length,
            achievementIds.length,
            likes,
            views,
            personalInfo.profileViews,
            personalInfo.totalDonations
        );
    }
    
    // Donation Function with enhanced tracking
    function donateEth() external payable nonReentrant {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        personalInfo.totalDonations += msg.value;
        
        // Transfer to owner
        (bool success, ) = payable(owner()).call{value: msg.value}("");
        require(success, "Donation transfer failed");
        
        emit DonationReceived(msg.sender, msg.value);
    }
    
    // Emergency functions
    function toggleProjectStatus(uint256 _projectId) external onlyOwner {
        require(projects[_projectId].id != 0, "Project does not exist");
        projects[_projectId].isActive = !projects[_projectId].isActive;
    }
    
    function toggleEducationStatus(uint256 _educationId) external onlyOwner {
        require(educations[_educationId].id != 0, "Education does not exist");
        educations[_educationId].isActive = !educations[_educationId].isActive;
    }
    
    function toggleExperienceStatus(uint256 _experienceId) external onlyOwner {
        require(experiences[_experienceId].id != 0, "Experience does not exist");
        experiences[_experienceId].isActive = !experiences[_experienceId].isActive;
    }
    
    function toggleSkillStatus(uint256 _skillId) external onlyOwner {
        require(skills[_skillId].id != 0, "Skill does not exist");
        skills[_skillId].isActive = !skills[_skillId].isActive;
    }
    
    function toggleAchievementStatus(uint256 _achievementId) external onlyOwner {
        require(achievements[_achievementId].id != 0, "Achievement does not exist");
        achievements[_achievementId].isActive = !achievements[_achievementId].isActive;
    }
}