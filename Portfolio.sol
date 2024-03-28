
// File: @openzeppelin/contracts/utils/Context.sol


// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

// File: @openzeppelin/contracts/access/Ownable.sol


// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// File: contracts/decentralizedPortfolio.sol


pragma solidity ^0.8.20;


contract Portfolio is Ownable(msg.sender){
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

  string public imageLink="QmR9VyCCgdHoJdN6jsBw7QsNFCYwNsrxRbpcSAaGEGPSnD/DuaaPicture.JPG";
  string public description="Over 2+ years of practical experience with a good knowledge in blockchain development.I help Blockchain community by contributing in the Smart Contracts.";
  string public resumeLink="QmR9VyCCgdHoJdN6jsBw7QsNFCYwNsrxRbpcSAaGEGPSnD/Duaa%27s%20Resume.pdf";
  uint projectCount;
  uint public educationCount;
  uint experienceCount;

 


  
  //Project
  function insertProject(string calldata _name,string calldata _description,string calldata _image,string calldata _githubLink) external onlyOwner{
      require(projectCount<3,"Only 3 projects allowed");
      projects[projectCount] = Project(projectCount,_name,_description,_image,_githubLink, true);
      projectCount++;
  }

  function changeProject(uint _id, string calldata _name,string calldata _description,string calldata _image,string calldata _githubLink) external onlyOwner{
      require(projects[_id].isInitialized, "id does'nt exist");
      projects[_id] = Project(_id,_name,_description,_image,_githubLink, true);
  }
    function allProjects() external view returns(Project[3] memory){
        return projects;
    }

//Education
   function insertEducation(string calldata _date,string calldata _degree,string calldata _knowledgeAcquired,string calldata _instutionName) external onlyOwner {
     require(educationCount<3,"Only 3 education details allowed");
     educations[educationCount]=Education(educationCount ,_date,_degree,_knowledgeAcquired,_instutionName, true);
     educationCount++;
    }

  function changeEducation(uint _id, string calldata _date,string calldata _degree,string calldata _knowledgeAcquired,string calldata _instutionName) external onlyOwner{
      require(educations[_id].isInitialized, "id does'nt exist");
      educations[_id]=Education(_id,_date,_degree,_knowledgeAcquired,_instutionName, true);
  }
  
  function allEducation() external view returns(Education[3] memory){
      return educations;
  }
  
  //Experience
    function insertExperience(string calldata _dateRange,string calldata _designation,string calldata _experienceAcquired,string calldata _companyName) external  onlyOwner{
     require(experienceCount<3,"Only 3 education details allowed");
     experiences[experienceCount]=Experience(experienceCount,_dateRange,_designation,_experienceAcquired,_companyName, true);
     experienceCount++;
    }

    function changeExperience(uint _id, string calldata _dateRange,string calldata _designation,string calldata _experienceAcquired,string calldata _companyName) external  onlyOwner{
      require(experiences[_id].isInitialized, "id does'nt exist");
     experiences[_id]=Experience(_id,_dateRange,_designation,_experienceAcquired,_companyName, true);
    }
    
    function allExperience() external view returns(Experience[3] memory){
      return experiences;
    }
  function changeDescription(string calldata _description) external onlyOwner{ 
      description=_description;
  }

    function changeResumeLink(string calldata _resumeLink) external onlyOwner{
      resumeLink=_resumeLink;
  }
     function changeImageLink(string calldata _imageLink) external onlyOwner{
      imageLink=_imageLink;
  }

  function donateEth() public payable{
      payable(owner()).transfer(msg.value);
  }

}