// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract Portfolio{
 
  struct Project{
      uint id;
      string name;
      string description;
      string image;
      string githubLink;
      bool isInitialized;
  }

  struct Education{
      uint id;
      string date;
      string degree;
      string knowledgeAcquired;
      string instutionName;
      bool isInitialized;
  }
  //check expreinece code with your solution
  struct Experience{
      uint id;
      string dateRange;
      string designation;
      string experienceAcquired;
      string companyName;
      bool isInitialized;
  }
  Project[3] public projects;
  Education[3] public educations;
  Experience[3] public experiences;

  string public imageLink="Qmda8pEA7ZF3Z14X2KThnu9BxKzxuFzPpW4EcVL9U2KAid";
  string public description="Over 2+ years of practical experience with a good knowledge in blockchain development.I help Blockchain community by contributing in the Smart Contracts.";
  string public resumeLink="QmPNha1xwAPxfj2s4wFi4Bj6uKp1Lc8g8QXY8nbPQgp8EY";
  uint projectCount;
  uint public educationCount;
  uint experienceCount;
  address public manager;

  constructor(){
      manager=msg.sender;
  }

  modifier onlyManager(){
      require(manager==msg.sender,"You are not the manager");
      _;
  }
  
  //Project
  function insertProject(string calldata _name,string calldata _description,string calldata _image,string calldata _githubLink) external{
      require(projectCount<3,"Only 3 projects allowed");
      projects[projectCount] = Project(projectCount,_name,_description,_image,_githubLink, true);
      projectCount++;
  }

  function changeProject(uint _id, string calldata _name,string calldata _description,string calldata _image,string calldata _githubLink) external{
      require(projects[_id].isInitialized, "id does'nt exist");
      projects[_id] = Project(_id,_name,_description,_image,_githubLink, true);
  }
    function allProjects() external view returns(Project[3] memory){
        return projects;
    }

//Education
   function insertEducation(string calldata _date,string calldata _degree,string calldata _knowledgeAcquired,string calldata _instutionName) external  onlyManager{
     require(educationCount<3,"Only 3 education details allowed");
     educations[educationCount]=Education(educationCount ,_date,_degree,_knowledgeAcquired,_instutionName, true);
     educationCount++;
    }

  function changeEducation(uint _id, string calldata _date,string calldata _degree,string calldata _knowledgeAcquired,string calldata _instutionName) external onlyManager{
      require(educations[_id].isInitialized, "id does'nt exist");
      educations[_id]=Education(_id,_date,_degree,_knowledgeAcquired,_instutionName, true);
  }
  
  function allEducation() external view returns(Education[3] memory){
      return educations;
  }
  
  //Experience
    function insertExperience(string calldata _dateRange,string calldata _designation,string calldata _experienceAcquired,string calldata _companyName) external  onlyManager{
     require(experienceCount<3,"Only 3 education details allowed");
     experiences[experienceCount]=Experience(experienceCount,_dateRange,_designation,_experienceAcquired,_companyName, true);
     experienceCount++;
    }

    function changeExperience(uint _id, string calldata _dateRange,string calldata _designation,string calldata _experienceAcquired,string calldata _companyName) external  onlyManager{
      require(experiences[_id].isInitialized, "id does'nt exist");
     experiences[_id]=Experience(_id,_dateRange,_designation,_experienceAcquired,_companyName, true);
    }
    
    function allExperience() external view returns(Experience[3] memory){
      return experiences;
    }
  function changeDescription(string calldata _description) external{
      description=_description;
  }

    function changeResumeLink(string calldata _resumeLink) external onlyManager{
      resumeLink=_resumeLink;
  }
     function changeImageLink(string calldata _imageLink) external onlyManager{
      imageLink=_imageLink;
  }

  function donateEth() public payable{
      payable(manager).transfer(msg.value);
  }

}