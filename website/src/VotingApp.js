// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import Web3 from 'web3';

// Smart contract ABI
const contractABI = [
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
const contractAddress = '0xa4B3f8973f23Fc2973C238541c6Bc55a0c8cc39e';

const VotingApp = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOption, setVotedOption] = useState(null);

  useEffect(() => {
    // Initialize Web3
    const initWeb3 = async () => {
      if (window.ethereum) {
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccounts(accounts);
          } catch (error) {
            if (error.code === 4001) {
              console.error('User denied account access');
            }
          }
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
        _options.push(option.toString());
      }
      setOptions(_options);
    };

    if (web3) {
      loadContract();
    }
  }, [web3]);

  const handleVote = async () => {
    // Ensure that there is at least one account available
    if (accounts.length === 0) {
      console.error('No Ethereum accounts available.');
      return;
    }

    // Prompt the user to choose an account
    const selectedAccount = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    // Ensure that the user selected an account
    if (!selectedAccount || selectedAccount.length === 0) {
      console.error('User did not choose an Ethereum account.');
      return;
    }

    // Cast vote for the selected option
    await contract.methods.vote(selectedOption).send({ from: selectedAccount[0] });

    // Update votedOption and hasVoted state
    const _votedOption = await contract.methods.getVotedOption(selectedAccount[0]).call();
    setVotedOption(_votedOption);
    setHasVoted(true);
  };

  return (
    <Container fluid className="my-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Voting Options</h2>
          <ListGroup>
            {options.map((option, index) => (
              <ListGroup.Item key={index}>{option}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={6}>
          <h2 className="text-center mb-4">Vote</h2>
          <Form>
            <Form.Group>
              <Form.Label>Select Option:</Form.Label>
              <Form.Control as="select" onChange={(e) => setSelectedOption(e.target.value)}>
                <option value="" disabled>Select an option</option>
                {options.map((option, index) => (
                  <option key={index} value={index}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={() => handleVote()} disabled={hasVoted || !selectedOption}>Vote</Button>
          </Form>
          {hasVoted && (
            <p className="mt-3 text-center">You have voted for option: {votedOption}</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default VotingApp;
