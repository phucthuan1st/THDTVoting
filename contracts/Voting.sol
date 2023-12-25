// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Structure to represent a voter
    struct Voter {
        bool hasVoted;
        uint256 votedOption;
    }

    // Mapping to store the vote count for each option
    mapping(uint256 => uint256) public voteCount;

    // Mapping to store the information of each voter
    mapping(address => Voter) public voters;

    // Array to store the available voting options
    uint256[] public options;

    // Event emitted when a vote is cast
    event Voted(address indexed voter, uint256 indexed option);

    // Event emitted when a new voting option is added
    event OptionAdded(uint256 indexed option);

    // Modifier to check if the sender has not voted yet
    modifier hasNotVoted() {
        require(!voters[msg.sender].hasVoted, "You have already voted");
        _;
    }

    // Modifier to check if the option is valid
    modifier isValidOption(uint256 _option) {
        require(optionExists(_option), "Invalid option");
        _;
    }

    // Modifier to check if the sender is the owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner(), "Only the owner can call this function");
        _;
    }

    // Function to add a new voting option (only owner)
    function addOption(uint256 _option) external onlyOwner {
        require(!optionExists(_option), "Option already exists");
        options.push(_option);
        emit OptionAdded(_option);
    }

     // Function to list all voting options
    function listOptions() external view returns (uint256[] memory) {
        return options;
    }


    // Function to get the total number of voting options
    function getNumberOfOptions() external view returns (uint256) {
        return options.length;
    }

    // Function to allow a user to vote for an option
    function vote(uint256 _option) external hasNotVoted isValidOption(_option) {
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedOption = _option;
        voteCount[_option]++;
        emit Voted(msg.sender, _option);
    }

    // Function to check if a voting option exists
    function optionExists(uint256 _option) public view returns (bool) {
        for (uint256 i = 0; i < options.length; i++) {
            if (options[i] == _option) {
                return true;
            }
        }
        return false;
    }

    // Function to get the vote count for a specific option
    function getVoteCount(uint256 _option) external view isValidOption(_option) returns (uint256) {
        return voteCount[_option];
    }

    // Function to get the option voted by a specific user
    function getVotedOption(address _voter) external view returns (uint256) {
        return voters[_voter].votedOption;
    }

    // Function to get the address of the owner
    function owner() public view returns (address) {
        return msg.sender;
    }
}