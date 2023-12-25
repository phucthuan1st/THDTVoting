import React from 'react';
import ReactDOM from 'react-dom/client';
import VotingApp from './VotingApp';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <VotingApp />
  </React.StrictMode>
);