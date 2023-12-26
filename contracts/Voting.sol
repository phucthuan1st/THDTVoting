// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Structure to represent a voter
    struct Voter {
        bool hasVoted;
        uint256 votedOption; // Change data type to uint256
    }

    mapping(uint256 => uint256) public voteCount;
    mapping(address => Voter) public voters;
    uint256[] public options;

    event Voted(address indexed voter, uint256 indexed option);
    event OptionAdded(uint256 indexed option);
    event OptionRemoved(uint256 indexed option);

    modifier hasNotVoted() {
        require(!voters[msg.sender].hasVoted, "You have already voted");
        _;
    }

    modifier isValidOption(uint256 _option) {
        require(optionExists(_option), "Invalid option");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner(), "Only the owner can call this function");
        _;
    }

    function removeOption(uint256 _option) external onlyOwner {
        require(optionExists(_option), "Option does not exist");

        for (uint256 i = 0; i < options.length; i++) {
            if (options[i] == _option) {
                options[i] = options[options.length - 1];
                options.pop();
                break;
            }
        }

        emit OptionRemoved(_option);
    }

    function addOption(uint256 _option) external onlyOwner {
        require(!optionExists(_option), "Option already exists");
        options.push(_option);
        emit OptionAdded(_option);
    }

    function listOptions() external view returns (uint256[] memory) {
        return options;
    }

    function getNumberOfOptions() external view returns (uint256) {
        return options.length;
    }

    function vote(uint256 _option) external hasNotVoted isValidOption(_option) {
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedOption = _option;
        voteCount[_option]++;
        emit Voted(msg.sender, _option);
    }

    function optionExists(uint256 _option) public view returns (bool) {
        for (uint256 i = 0; i < options.length; i++) {
            if (options[i] == _option) {
                return true;
            }
        }
        return false;
    }

    function getVoteCount(uint256 _option) external view isValidOption(_option) returns (uint256) {
        return voteCount[_option];
    }

    function getVotedOption(address _voter) external view returns (uint256) {
        return voters[_voter].votedOption;
    }

    function owner() public view returns (address) {
        return msg.sender;
    }
}