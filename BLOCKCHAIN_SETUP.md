# 🚀 Decentralized Portfolio - Blockchain Setup

This document explains how to set up, deploy, and interact with your generic Portfolio smart contract using Hardhat.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask wallet
- Testnet ETH for deployment

## 🔧 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Run the interactive setup script:
```bash
npm run setup
```

This will guide you through creating a `.env` file with your configuration.

### 3. Compile Contracts
```bash
npm run compile
```

### 4. Run Tests
```bash
npm test
```

## 🌐 Deployment

### Local Development
Start a local Hardhat network:
```bash
npm run node
```

Deploy to local network:
```bash
npm run deploy:localhost
```

### Testnet Deployment
Deploy to Sepolia testnet:
```bash
npm run deploy:sepolia
```

Deploy to Mumbai testnet:
```bash
npm run deploy:mumbai
```

## 🔗 Contract Interaction

After deployment, interact with your contract:
```bash
npm run interact
```

Add sample data to your portfolio:
```bash
npm run interact -- --add-sample-data
```

## 📁 Project Structure

```
├── contracts/
│   └── Portfolio.sol           # Generic portfolio smart contract
├── scripts/
│   ├── deploy.js              # Deployment script
│   ├── interact.js            # Contract interaction script
│   └── setup-env.js           # Environment setup helper
├── test/
│   └── Portfolio.test.js      # Contract tests
├── deployments/               # Deployment records
├── hardhat.config.js          # Hardhat configuration
└── .env                       # Environment variables
```

## 🎛️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile smart contracts |
| `npm test` | Run contract tests |
| `npm run deploy:localhost` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run deploy:mumbai` | Deploy to Mumbai testnet |
| `npm run node` | Start local Hardhat network |
| `npm run interact` | Interact with deployed contract |
| `npm run setup` | Interactive environment setup |
| `npm run verify:sepolia` | Verify contract on Etherscan |

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Required
PRIVATE_KEY=your_wallet_private_key_without_0x

# Optional RPC URLs (defaults provided)
SEPOLIA_RPC_URL=https://rpc.sepolia.org
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com

# Optional API keys for verification
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Portfolio Configuration
PORTFOLIO_OWNER_NAME="Duaa Azhar"
PORTFOLIO_OWNER_BIO="Building the future with decentralized technologies. Passionate about creating innovative blockchain solutions that bridge traditional finance with DeFi protocols."
PORTFOLIO_OWNER_LOCATION="Lahore, Pakistan"
PORTFOLIO_OWNER_EMAIL="duaaazhar04@gmail.com"
```

## 🏗️ Smart Contract Features

### Generic Portfolio Contract
- **Configurable Owner**: Set owner details during deployment
- **Projects Management**: Add, update, like, and view projects
- **Skills Tracking**: Categorized skills with proficiency levels
- **Education Records**: Academic background and achievements
- **Work Experience**: Professional experience tracking
- **Achievements**: Certifications and accomplishments
- **Social Features**: Likes, views, and engagement metrics
- **Donation System**: Accept ETH donations
- **Access Control**: Owner-only administrative functions

### Constructor Parameters
```solidity
constructor(
    address initialOwner,
    string memory _name,
    string memory _bio,
    string memory _profileImage,
    string memory _resumeLink,
    string memory _location,
    string memory _email,
    string[] memory _socialLinks
)
```

## 📊 Contract Deployment Process

1. **Compilation**: Contracts are compiled with Solidity 0.8.20
2. **Deployment**: Contract is deployed with your configuration
3. **Verification**: Optionally verify on block explorers
4. **ABI Update**: Frontend ABI is automatically updated
5. **Record Keeping**: Deployment info saved in `deployments/` folder

## 🔍 Testing

Comprehensive test suite covering:
- Contract deployment and initialization
- Project management (CRUD operations)
- Skills and education management
- User interactions (likes, views)
- Access control and security
- Donation functionality
- Portfolio statistics

Run tests with:
```bash
npm test
```

## 🌐 Supported Networks

| Network | Chain ID | Type | Status |
|---------|----------|------|--------|
| Hardhat | 31337 | Local | ✅ Ready |
| Sepolia | 11155111 | Testnet | ✅ Ready |
| Mumbai | 80001 | Testnet | ✅ Ready |
| Polygon | 137 | Mainnet | ✅ Ready |
| BSC Testnet | 97 | Testnet | ✅ Ready |
| Vanar | 2040 | Mainnet | ✅ Ready |
| Vanguard | 78600 | Testnet | ✅ Ready |

## 📝 Usage Example

1. **Deploy Contract**:
```bash
npm run deploy:sepolia
```

2. **Add Your Portfolio Data**:
```bash
npm run interact -- --add-sample-data
```

3. **Update Frontend**: 
- Copy the contract address from deployment output
- Update `src/components/Wallet/Wallet.jsx` with the new address

## 🔒 Security Considerations

- Keep your private key secure and never commit it to version control
- Use testnet networks for testing
- Verify contracts on block explorers before mainnet deployment
- Test all functionality thoroughly before going live
- Consider multi-signature wallets for mainnet contracts

## 🐛 Troubleshooting

### Common Issues:

1. **"Contract not deployed"**
   - Run `npm run deploy:localhost` or deploy to your target network

2. **"Insufficient funds"**
   - Get testnet tokens from faucets
   - Check your wallet balance

3. **"Network mismatch"**
   - Ensure MetaMask is connected to the same network
   - Check your Hardhat network configuration

4. **"Compilation failed"**
   - Check Solidity version compatibility
   - Ensure all dependencies are installed

### Getting Help:
- Check the contract tests for usage examples
- Review deployment logs in the `deployments/` folder
- Use `npm run interact` to test contract functionality

## 🎯 Next Steps

After successful deployment:
1. Update your frontend with the contract address
2. Test all contract functions
3. Add your real portfolio data
4. Consider contract verification on block explorers
5. Deploy to mainnet when ready

## 📄 License

MIT License - see LICENSE file for details. 