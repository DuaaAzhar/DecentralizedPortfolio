# Decentralized Portfolio

> **Your professional identity, permanently etched on the blockchain.**

A next-generation portfolio platform that transforms how developers showcase their work. Built on Ethereum, your achievements, projects, and skills live immutably on-chain — owned by you, accessible anywhere, and verifiable by anyone.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-duaaazhar.netlify.app-00d4aa?style=for-the-badge&logo=netlify&logoColor=white)](https://duaaazhar.netlify.app/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Multi--Chain-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)](https://ethereum.org/)

---

## The Vision

Traditional portfolios are fragile — hosted on servers that go down, platforms that shut down, or domains that expire. **Decentralized Portfolio** changes this paradigm entirely.

Every project you've built, every skill you've mastered, and every achievement you've earned is stored directly on the blockchain. No middleman. No single point of failure. Your professional story, preserved forever.

---

## Features

### Blockchain-Powered

- **Immutable Storage** — Portfolio data lives on-chain, not on servers that can disappear
- **Multi-Chain Deployment** — Deploy to Sepolia, Polygon, Arbitrum, Optimism, BSC, and more
- **On-Chain Analytics** — Likes, views, and engagement tracked transparently on the blockchain
- **ETH Donations** — Accept cryptocurrency support directly through smart contracts
- **Verifiable Credentials** — Anyone can verify your achievements on the public ledger

### Modern Web Experience

- **MetaMask Integration** — Seamless wallet connection with auto network switching
- **Glassmorphism UI** — Stunning visual design with frosted glass effects
- **Dark/Light Themes** — Eye-friendly modes that persist across sessions
- **Fluid Animations** — Framer Motion powered transitions and micro-interactions
- **Fully Responsive** — Beautiful on desktop, tablet, and mobile

### Developer-Centric

- **OpenZeppelin Security** — Battle-tested smart contract patterns
- **Reentrancy Protection** — Secure donation handling
- **Comprehensive Testing** — 21+ test cases covering all functionality
- **Hot Module Replacement** — Lightning-fast development with Vite

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Smart Contracts** | Solidity 0.8.20, OpenZeppelin v5, Hardhat |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Framer Motion |
| **Web3** | ethers.js v6, web3.js v4, MetaMask |
| **Testing** | Hardhat Test, Solidity Coverage |

---

## Quick Start

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/DuaaAzhar/DecentralizedPortfolio.git
cd DecentralizedPortfolio

# Install dependencies
npm install

# Interactive environment setup
npm run setup
```

### Development

```bash
# Start local blockchain
npm run node

# In a new terminal, deploy contracts
npm run deploy:localhost

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and connect MetaMask to `localhost:8545`.

### Deployment

```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Polygon Mumbai
npm run deploy:mumbai
```

---

## Smart Contract Architecture

The `Portfolio.sol` contract manages your entire professional identity:

```
┌─────────────────────────────────────────────────────────┐
│                    Portfolio Contract                    │
├─────────────────────────────────────────────────────────┤
│  Personal Info    │  Projects    │  Skills              │
│  ─────────────    │  ─────────   │  ─────────           │
│  • Name           │  • Details   │  • Categories        │
│  • Bio            │  • Links     │  • Proficiency       │
│  • Socials        │  • Likes     │  • Icons             │
│  • Resume         │  • Views     │                      │
├─────────────────────────────────────────────────────────┤
│  Education        │  Experience  │  Achievements        │
│  ─────────────    │  ─────────   │  ─────────────       │
│  • Degree         │  • Company   │  • Title             │
│  • Institution    │  • Position  │  • Verification      │
│  • Duration       │  • Skills    │  • Category          │
├─────────────────────────────────────────────────────────┤
│  Analytics & Donations                                  │
│  • Profile views  • Total likes  • ETH donations        │
└─────────────────────────────────────────────────────────┘
```

### Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `addProject()` | Owner | Add a new project to showcase |
| `likeProject()` | Public | Like a project (once per wallet) |
| `viewProject()` | Public | Increment project view counter |
| `donateEth()` | Public | Send ETH donation to portfolio owner |
| `getPortfolioStats()` | Public | Fetch aggregate engagement metrics |

---

## Supported Networks

| Network | Chain ID | Type |
|---------|----------|------|
| Ethereum Sepolia | 11155111 | Testnet |
| Polygon Mumbai | 80001 | Testnet |
| Polygon Mainnet | 137 | Mainnet |
| Arbitrum One | 42161 | Mainnet |
| Optimism | 10 | Mainnet |
| BSC | 56 | Mainnet |
| Avalanche | 43114 | Mainnet |
| Fantom | 250 | Mainnet |

---

## Project Structure

```
DecentralizedPortfolio/
├── contracts/
│   └── Portfolio.sol          # Core smart contract
├── scripts/
│   ├── deploy.cjs             # Deployment automation
│   └── interact.cjs           # Contract interaction helpers
├── src/
│   ├── components/
│   │   ├── Wallet/            # MetaMask integration
│   │   ├── hero/              # Landing section
│   │   ├── projects/          # Project showcase
│   │   ├── skills/            # Skills display
│   │   └── experience/        # Work history
│   └── App.jsx                # Global state & routing
├── test/
│   └── Portfolio.test.cjs     # Contract test suite
└── hardhat.config.cjs         # Network configuration
```

---

## Configuration

Create a `.env` file in the project root:

```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://rpc.sepolia.org
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
ETHERSCAN_API_KEY=your_etherscan_api_key
```

---

## Testing

```bash
# Run the full test suite
npm run test

# Generate coverage report
npx hardhat coverage
```

---

## Security

- **Ownable Pattern** — Only the portfolio owner can modify content
- **ReentrancyGuard** — Protection against reentrancy attacks on donations
- **Input Validation** — All user inputs are validated on-chain
- **Duplicate Prevention** — Users can only like each project once

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Hardhat](https://hardhat.org/) for the amazing development environment
- [Framer Motion](https://www.framer.com/motion/) for beautiful animations

---

<p align="center">
  <strong>Built with blockchain technology</strong><br>
  <sub>Your achievements deserve to be permanent.</sub>
</p>
