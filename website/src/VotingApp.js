// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import Web3 from 'web3';

// Smart contract ABI
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_option",
        "type": "uint256"
      }
    ],
    "name": "addOption",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "option",
        "type": "uint256"
      }
    ],
    "name": "OptionAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "option",
        "type": "uint256"
      }
    ],
    "name": "OptionRemoved",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_option",
        "type": "uint256"
      }
    ],
    "name": "removeOption",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_option",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "option",
        "type": "uint256"
      }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getNumberOfOptions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_option",
        "type": "uint256"
      }
    ],
    "name": "getVoteCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_voter",
        "type": "address"
      }
    ],
    "name": "getVotedOption",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "listOptions",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_option",
        "type": "uint256"
      }
    ],
    "name": "optionExists",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "options",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "voteCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "hasVoted",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "votedOption",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Smart contract address
const contractAddress = '0xc0EEED43772Cc5C60f477980D255025D188b57D9';

const VotingApp = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOption, setVotedOption] = useState(null);
  const [addOption, setAddOption] = useState("");
  const [selectedRmOption, setSelectedRmOption] = useState(null);
  const [voteCount, setVoteCount] = useState(null);




  useEffect(() => {
    // Initialize Web3
    const initWeb3 = async () => {
      if (window.ethereum) {
        const _web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(_web3);
          const _accounts = await _web3.eth.getAccounts();
          setAccounts(_accounts);
        } catch (error) {
          console.error('User denied account access');
        }
      } else if (window.web3) {
        const _web3 = new Web3(window.web3.currentProvider);
        setWeb3(_web3);
        const _accounts = await _web3.eth.getAccounts();
        setAccounts(_accounts);

      } else {
        console.error('No Ethereum provider detected');
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    // Load smart contract
    const loadContract = async () => {
      const _contract = new web3.eth.Contract(contractABI, contractAddress);
      setContract(_contract);

      // Get the list of voting options
      const numberOfOptions = await _contract.methods.getNumberOfOptions().call();
      const _options = [];
      for (let i = 0; i < numberOfOptions; i++) {
        const option = await _contract.methods.options(i).call();
        // them toString() o day la xong.
        _options.push(option.toString());
        console.log(option);
      }
      setOptions(_options);
    };

    if (web3) {
      loadContract();
    }
  }, [web3]);

  const handleVote = async () => {
    // Cast vote for the selected option
    await contract.methods.vote(selectedOption).send({ from: accounts[0], type: '0x0' });
    // Update votedOption and hasVoted state
    const _votedOption = await contract.methods.getVotedOption(accounts[0]).call();
    setVotedOption(_votedOption);
    setHasVoted(true);
  };

  const handleAdd = async () => {
    try {
      // Call the addOption function on your smart contract
      await contract.methods.addOption(addOption).send({ from: accounts[0], type: '0x0' });
      console.log('Option added successfully!');
      // Update the options state with the new option
      setOptions(prevOptions => [...prevOptions, addOption]);
      // Clear the addOption state
      setAddOption('');
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  // Function to remove the selected option
  const handleRemoveOption = async () => {
    try {
      // Ensure a valid contract instance and selected option
      if (contract && selectedRmOption !== '') {
        // Convert the selected option to a uint256 if needed
        const optionToRemove = parseInt(selectedRmOption, 10);

        // Call the removeOption function on your smart contract
        await contract.methods.removeOption(optionToRemove).send({ from: accounts[0] });

        console.log(`Option ${optionToRemove} removed successfully`);

        // Update the options state to reflect the removed option
        setOptions(prevOptions => prevOptions.filter(option => option !== selectedRmOption));
      } else {
        console.error('Invalid contract instance or selected option');
      }
    } catch (error) {
      console.error('Error while removing option:', error);
    }
  };

  // Hàm để trả về số lượng phiếu cho một lựa chọn cụ thể
  const getVoteCount = async (_option) => {
    try {
      // Ensure a valid contract instance
      if (contract) {
        // Convert the selected option to a uint256 if needed
        // Call the getVoteCount function on your smart contract
        const voteCount = await contract.methods.getVoteCount(_option).call();
        console.log(`Vote count for option ${_option}: ${voteCount}`);
      } else {
        console.error('Invalid contract instance');
      }
    } catch (error) {
      console.error('Error while getting vote count:', error);
    }
  };

  const getVotedOption = async (accounts) => {
    try {
      const result = await contract.methods.getVotedOption(accounts).call();
      setVotedOption(result);
      console.log('Voted Option:', result);
    } catch (error) {
      console.error('Error calling getVotedOption:', error);
    }
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2>Voting Options</h2>
          <ListGroup>
            {options.map((option, index) => (
              <ListGroup.Item key={index}>{option}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col>
          <h2>Vote</h2>
          <Form>
            <Form.Group>
              <Form.Label>Select Option:</Form.Label>
              <Form.Control as="select" onChange={(e) => setSelectedOption(e.target.value)}>
                {options.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
                <option value="" disabled>Select an option</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={() => handleVote()} disabled={hasVoted || !selectedOption}>Vote</Button>
            <Form.Group>
              <Form.Label>Add New Option:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new option"
                value={addOption}
                onChange={(e) => setAddOption(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={() => handleAdd()}
              disabled={hasVoted || addOption.trim() === ''}
            >
              Add Option
            </Button>
          </Form>
          <div>
            {hasVoted && (
              <p>You have voted for option: {votedOption.toString()}</p>
            )}
          </div>
          <div>
            <p>You are : {accounts}</p>
            <p>Connected Account: {accounts}</p>
            <p>Phai ngat ket noi het cac tai khoan hien tai, chi de lai tai khoan can xem tren metamask</p>
            <button onClick={() => getVotedOption(accounts.toString())}>Get Voted Option</button>
            {votedOption !== null && (
              <p>Voted Option: {votedOption.toString()}</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VotingApp;