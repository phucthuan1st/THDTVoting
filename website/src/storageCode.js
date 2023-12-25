// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import Web3 from 'web3';

// Smart contract ABI
const contractABI = [
    // Bao hieu da duoc add
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
const contractAddress = '0x13d1550952c64cE3326F0e05E13fB44d3D345964';

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

    const loadContract = async () => {
        const _contract = new web3.eth.Contract(contractABI, contractAddress);
        setContract(_contract);

        // Get the list of voting options
        const numberOfOptions = await _contract.methods.getNumberOfOptions().call();
        const _options = [];
        for (let i = 0; i < numberOfOptions; i++) {
            const option = await _contract.methods.options(i).call();
            _options.push(option);
        }
        setOptions(_options);
    };

    useEffect(() => {
        if (web3) {
            loadContract();
        }
    }, [web3]);




    const [newOption, setNewOption] = useState('');
    const [owner, setOwner] = useState('');

    const handleVote = async () => {
        // Cast vote for the selected option
        await contract.methods.vote(selectedOption).send({ from: accounts[0] });
        // Update votedOption and hasVoted state
        const _votedOption = await contract.methods.getVotedOption(accounts[0]).call();
        setVotedOption(_votedOption);
        setHasVoted(true);
    };

    const handleAddOption = async () => {
        try {
            await contract.methods.addOption(newOption).send({ from: accounts[0] });
            loadContract();
        } catch (error) {
            console.error('Error fetching owner address:', error);

        }

    }

    const loadOwner = async () => {
        try {
            const ownerAddress = await contract.methods.owner().call();
            setOwner(ownerAddress);
        } catch (error) {
            console.error('Error add oprion:', error);
        }
    };

    useEffect(() => {
        if (contract) {
            loadOwner();
        }
    }, [contract]);

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
                                <option value="" disabled>Select an option</option>
                                {options.map((option, index) => (
                                    <option key={index} value={index}>{option}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" onClick={() => handleVote()} disabled={hasVoted || !selectedOption}>Vote</Button>
                        <Form.Group>
                            <Form.Label>Add New Option:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter new option"
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            onClick={() => handleAddOption()}
                            disabled={hasVoted || newOption.trim() === ''}
                        >
                            Add Option
                        </Button>
                    </Form>
                    {hasVoted && (
                        <p>You have voted for option: {votedOption}</p>
                    )}

                    {owner && (
                        <p>Contract owner: {owner}</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default VotingApp;
