// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// project
// CoinOfficial
// buy, sell, staking of coin 
// image
// https://github.com/DuaaAzhar/coinOfficial

contract Portfolio {
    struct Project{
        uint id;
        string name;
        string description;
        string image;
        string githubLink;
    }
    struct Education{
        uint id;
        string date;
        string degree;
        string knowledgeAcquired;
        string instituteName;
    }
    struct Experience{
        uint id;
        string timeRange;
        string designation;
        string experienceAcquired;
        string companyName;
    }
    Project[3] public projects;
    Education[3] public education;
    Experience[3] public experience;
    string public imageLink = "";
    string public description = "Over 2 years of practical experience with a good knowledge in ";
    string public resumeLink = "";
    uint projectCount;
    uint educationCount;
    uint experienceCount;
    address public manager;
    constructor() {
        manager = msg.sender;
    }
    modifier onlyManager(){
        require(manager == msg.sender, "Caller is not Manager");
        _;
    }
    function insertProject(string calldata _name, string calldata _description, string calldata _image, string calldata _githubLink) public onlyManager{
        require(projectCount <3, "Only 3 projects allowed");
        projects[projectCount]= Project(projectCount, _name, _description, _image, _githubLink);
        projectCount += 1;
    }
    function changeProject(uint _id,string calldata _name, string calldata _description, string calldata _image, string calldata _githubLink) public onlyManager{
        require(projects[_id].id != 0, "project doesnot exist");
        projects[_id]= Project(_id, _name, _description, _image, _githubLink);
    }
    function insertEducation(string calldata _date, string calldata _degree, string calldata _knowledgeAcquired, string calldata _instituteName) public onlyManager{
        require(educationCount <3, "Only 3 projects allowed");
        education[educationCount]= Education(educationCount, _date, _degree, _knowledgeAcquired, _instituteName);
        educationCount += 1;
    }
    function changeEducation(uint _id, string calldata _date, string calldata _degree, string calldata _knowledgeAcquired, string calldata _instituteName) public onlyManager{
        require(education[_id].id != 0, "education doesnot exist");
        education[_id]= Education(_id, _date, _degree, _knowledgeAcquired, _instituteName);
    }
    function insertExperience(string calldata _timeRange, string calldata _designation, string calldata _experienceAcquired, string calldata _companyName) public onlyManager{
        require(educationCount <3, "Only 3 projects allowed");
        experience[experienceCount]= Experience(experienceCount, _timeRange, _designation, _experienceAcquired, _companyName);
        experienceCount += 1;
    }
    function changeExperience(uint _id, string calldata _timeRange, string calldata _designation, string calldata _experienceAcquired, string calldata _companyName) public onlyManager{
        require(education[_id].id != 0, "education doesnot exist");
        experience[_id]= Experience(_id, _timeRange, _designation, _experienceAcquired, _companyName);
    }

    function allProjects() public view returns(Project[3] memory){
        return projects;
    }
    function allEducation() public view returns(Education[3] memory){
        return education;
    }
    function allExperiences() public view returns(Experience[3] memory){
        return experience;
    }
    function donateEth()public payable  {
        payable(manager).transfer(msg.value);
    }
    
}