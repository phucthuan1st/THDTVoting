# Decentralized Voting System

## Overview

This project implements a decentralized voting system using blockchain technology. The smart contract is built with Solidity, and the frontend is developed using ReactJs with Web3.js integration. The combination of Ganache and MetaMask is used for local development and testing.

## Features

- **Security:** Ensures secure and transparent voting.
- **Prevention of Double Voting:** Smart contract prevents double voting.
- **Integrity:** Ensures the integrity of the entire voting process.

## Project Structure

- **contracts:** Contains Solidity smart contract files.
- **website:** Houses the ReactJs frontend application.

## Getting Started

### Prerequisites

1. Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).
2. Install [Ganache](https://www.trufflesuite.com/ganache).
3. Install [MetaMask](https://metamask.io/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/decentralized-voting-system.git
   ```

2. Install dependencies:

   ```bash
   cd decentralized-voting-system/website
   npm install
   ```

### Usage

1. Start Ganache and create a new workspace.

2. Configure MetaMask to connect to your local Ganache network.

3. Compile and deploy the smart contract:

   ```bash
   truffle compile
   truffle migrate
   ```

4. Run the ReactJs frontend:

   ```bash
   cd website
   npm start
   ```

5. Access the application at `http://localhost:3000` in your web browser.

## Contributors

- Nguyen Phuc Thuan <phucthuan1st@gmail.com>
- Tran Nam Tuan <tntuan110322@gmail.com>
- Nguyen Ta Huy Hoang <nthh01082002@gmail.com>
- Nguyen Tien Dat <khachviptochau2256@gmail.com>

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to customize the README as per your project specifics. If you have any further questions or need assistance with specific code snippets, please let me know. Happy coding!
