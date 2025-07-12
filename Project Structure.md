NFT Marketplace Project Structure
nft-marketplace/
├── frontend/                         # React frontend
│   ├── public/                      # Static assets
│   │   ├── index.html               # Main HTML file
│   │   └── favicon.ico              # Favicon
│   ├── src/                         # Source code
│   │   ├── components/              # Reusable React components
│   │   │   ├── WalletConnect.js     # Component for wallet connection
│   │   │   ├── NFTCard.js           # Component for displaying NFT
│   │   │   ├── DepositForm.js       # Component for depositing funds
│   │   │   └── PhotoCreator.js      # Component for photo creation UI
│   │   ├── pages/                   # Page components
│   │   │   ├── Main.js              # Main page with project description
│   │   │   ├── Discover.js          # Page to discover NFTs
│   │   │   ├── BuyNFT.js           # Page to buy NFTs
│   │   │   ├── CreatePhoto.js       # Page for creating photos
│   │   │   ├── MintNFT.js           # Page for minting NFTs
│   │   │   └── Profile.js           # User profile with balance and NFTs
│   │   ├── utils/                   # Utility functions
│   │   │   ├── web3.js             # Web3.js/ethers.js configuration
│   │   │   └── api.js              # API calls to Fastify backend
│   │   ├── styles/                  # CSS/Tailwind styles
│   │   │   └── index.css           # Global styles
│   │   ├── App.js                   # Main App component with routing
│   │   ├── index.js                 # Entry point for React
│   │   └── config.js                # Configuration (e.g., contract addresses, API endpoints)
│   ├── Dockerfile                   # Dockerfile for frontend
│   ├── package.json                 # Frontend dependencies (React, Web3.js, axios, react-router-dom)
│   └── .env                         # Environment variables (e.g., REACT_APP_API_URL)
├── backend/                         # Fastify backend
│   ├── src/                         # Source code
│   │   ├── controllers/             # API controllers
│   │   │   ├── user.js             # User-related endpoints (e.g., check balance)
│   │   │   ├── nft.js              # NFT-related endpoints (e.g., metadata)
│   │   │   └── photo.js            # Photo creation endpoints
│   │   ├── routes/                  # API routes
│   │   │   ├── user.js             # Routes for user operations
│   │   │   ├── nft.js              # Routes for NFT operations
│   │   │   └── photo.js            # Routes for photo creation
│   │   ├── services/                # Business logic and blockchain interaction
│   │   │   ├── blockchain.js       # Web3.js/ethers.js for contract interactions
│   │   │   └── photoService.js     # Custom photo creation logic
│   │   ├── prisma/                  # Prisma configuration and schema
│   │   │   ├── schema.prisma       # Prisma schema for User and Photo
│   │   │   └── client.js           # Prisma client initialization
│   │   ├── utils/                   # Utilities
│   │   │   └── ipfs.js            # IPFS integration for photo/NFT metadata
│   │   ├── index.js                 # Entry point for Fastify server
│   │   └── config.js                # Configuration (e.g., contract addresses, MongoDB URI)
│   ├── Dockerfile                   # Dockerfile for backend
│   ├── package.json                 # Backend dependencies (fastify, @prisma/client, ethers)
│   ├── .env                         # Environment variables (e.g., PRIVATE_KEY, MONGODB_URI)
│   └── tests/                       # Backend tests
│       ├── user.test.js            # Tests for user endpoints
│       ├── nft.test.js            # Tests for NFT endpoints
│       └── photo.test.js           # Tests for photo endpoints
├── blockchain/                      # Solidity smart contracts
│   ├── contracts/                   # Smart contracts
│   │   ├── BalanceManager.sol      # Contract for managing user balances
│   │   └── NFTMarket.sol           # Contract for NFT minting and trading
│   ├── scripts/                     # Deployment and interaction scripts
│   │   ├── deploy.js               # Deployment script
│   │   └── interact.js             # Script for testing contract interactions
│   ├── test/                        # Contract tests
│   │   ├── BalanceManager.test.js  # Tests for BalanceManager
│   │   └── NFTMarket.test.js       # Tests for NFTMarket
│   ├── migrations/                  # Migration scripts for deployment
│   │   └── 1_deploy_contracts.js   # Migration for deploying contracts
│   ├── Dockerfile                   # Dockerfile for Hardhat (optional, for testing)
│   ├── hardhat.config.js           # Hardhat configuration
│   ├── package.json                 # Blockchain dependencies (hardhat, openzeppelin)
│   └── .env                         # Environment variables (e.g., PRIVATE_KEY, ALCHEMY_URL)
├── docs/                            # Documentation
│   ├── api.md                      # API documentation for Fastify endpoints
│   └── contracts.md                # Smart contract documentation
├── docker-compose.yml              # Docker Compose configuration
├── README.md                       # Project overview and setup instructions
└── .gitignore                      # Git ignore file (node_modules, .env, build/, etc.)
