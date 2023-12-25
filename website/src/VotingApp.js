// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import Web3 from 'web3';

// Smart contract ABI
const contractABI = [...];

// Smart contract address
const contractAddress = '0x123...';

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
        _options.push(option);
      }
      setOptions(_options);
    };

    if (web3) {
      loadContract();
    }
  }, [web3]);

  const handleVote = async () => {
    // Cast vote for the selected option
    await contract.methods.vote(selectedOption).send({ from: accounts[0] });
    // Update votedOption and hasVoted state
    const _votedOption = await contract.methods.getVotedOption(accounts[0]).call();
    setVotedOption(_votedOption);
    setHasVoted(true);
  };

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
          </Form>
          {hasVoted && (
            <p>You have voted for option: {votedOption}</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default VotingApp;
