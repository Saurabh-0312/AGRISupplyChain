# 🌾 AgriSupplyChain

## Revolutionizing Agriculture with Blockchain Technology

AgriSupplyChain is a comprehensive decentralized application (DApp) that transforms the traditional agricultural supply chain by leveraging Ethereum blockchain technology. Our platform provides a complete ecosystem with dedicated dashboards for Farmers, Inspectors, and a Marketplace for Consumers, ensuring transparency, traceability, and trust in every step from farm to fork.

![Blockchain Agriculture](https://img.shields.io/badge/Blockchain-Agriculture-green)
![Ethereum](https://img.shields.io/badge/Ethereum-Smart%20Contracts-blue)
![Web3](https://img.shields.io/badge/Web3-DApp-orange)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-blue)

## 🚀 What Makes Us Different?

Traditional agricultural supply chains lack transparency and trust. AGRISupplyChain solves this by creating an immutable, decentralized record of every transaction and approval in the supply chain.

## 🎯 Key Features

### 🧑‍🌾 Farmer Dashboard
- **Comprehensive Crop Upload**: Register crops with detailed information including:
  - Crop name, type, and quantity (kg)
  - Pricing in ETH per kg
  - Harvest date and location (geo-coordinates)
  - Fertilizer and pesticide usage details
  - Quality grade assessment
  - IPFS image hash for crop photos
- **My Crops Management**: View and track all uploaded crops with status monitoring
- **Direct ETH Payments**: Receive payments instantly when crops are sold
- **Real-time Status Updates**: Track crop approval and sale status

### 🔍 Inspector Dashboard
- **Pending Approval Queue**: Review crops awaiting quality verification
- **Detailed Crop Analysis**: Access complete crop information including:
  - Farmer wallet address verification
  - Harvest date validation
  - Chemical usage assessment
  - Quality grade verification
- **Smart Inspection Checklist**: Built-in verification steps for consistent quality control
- **One-Click Approval/Rejection**: Streamlined decision-making process
- **Blockchain-Recorded Decisions**: All approvals permanently stored on Ethereum

### 🛒 Crop Marketplace
- **Quality-Assured Products**: Browse only inspector-approved crops
- **Comprehensive Crop Details**: View all crop information before purchase
- **Grade-Based Filtering**: Choose crops by quality grades (A, B, C)
- **Transparent Pricing**: Clear pricing in ETH with total cost calculation
- **Secure MetaMask Payments**: Safe, decentralized transactions
- **Real-time Availability**: Live crop count and availability status

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Farmer        │    │   Inspector     │    │   Consumer      │
│   Dashboard     │    │   Dashboard     │    │   Marketplace   │
│                 │    │                 │    │                 │
│ • Upload Crop   │───▶│ • Review Crops  │───▶│ • Browse Crops  │
│ • Set Details   │    │ • Quality Check │    │ • Purchase      │
│ • Track Status  │    │ • Approve/Reject│    │ • ETH Payment   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                  ┌───────────────────────────┐
                  │    Ethereum Network       │
                  │                           │
                  │  AgriSupplyChain.sol     │
                  │  • Crop Management       │
                  │  • Inspector Controls    │
                  │  • Payment Processing    │
                  │  • Status Tracking       │
                  └───────────────────────────┘
```

## 🛠️ Technology Stack

- **Blockchain**: Ethereum Network
- **Smart Contracts**: Solidity ^0.8.20
- **Frontend**: React.js with modern UI components
- **Web3 Integration**: MetaMask wallet connection
- **Storage**: IPFS for crop images
- **Styling**: CSS with gradient backgrounds and modern design
- **Development Tools**: Truffle/Hardhat framework

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AGRISupplyChain.git
   cd AGRISupplyChain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MetaMask**
   - Install MetaMask extension
   - Create/Import wallet
   - Connect to Ethereum testnet (Goerli/Sepolia)

4. **Deploy Smart Contract**
   ```bash
   npm run deploy
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the DApp**
   Open `http://localhost:3000` in your browser

## 📖 How It Works

### Step 1: Farmer Crop Upload
1. Farmer connects MetaMask wallet to the platform
2. Access Farmer Dashboard with green-themed interface
3. Click "+ Upload New Crop" button
4. Fill comprehensive crop details form:
   - Crop name and type
   - Quantity in kilograms
   - Price per kg in ETH
   - Harvest date
   - Fertilizer and pesticide used
   - Quality grade (A/B/C)
   - Geo-location coordinates
   - Upload crop image to IPFS
5. Submit crop for inspector approval

### Step 2: Inspector Quality Control
1. Inspector logs into blue-themed Inspector Dashboard
2. Review "Pending Approval" queue showing all submitted crops
3. Examine detailed crop information including:
   - Farmer's wallet address
   - Complete crop specifications
   - Harvest date validation
   - Chemical usage assessment
4. Use built-in inspection checklist for quality verification
5. Click "✓ Approve Crop" or "✗ Disapprove Crop"
6. Decision is permanently recorded on blockchain

### Step 3: Consumer Marketplace Purchase
1. Consumer visits purple-themed Crop Marketplace
2. Browse inspector-approved crops with quality grades
3. View comprehensive crop details and pricing
4. Select desired crop and review total cost
5. Connect MetaMask wallet for secure payment
6. Complete purchase with ETH transaction
7. Payment automatically transferred to farmer's wallet

## 🔒 Smart Contract Features

Our AgriSupplyChain.sol contract implements comprehensive functionality:

```solidity
// Core Data Structures
struct CropDetails {
    string name;           // Crop name
    string cropType;       // Type of crop
    uint256 quantity;      // Weight in kg
    uint256 price;         // Price per kg in wei
    string harvestDate;    // Harvest date
    string fertilizerUsed; // Fertilizer details
    string pesticideUsed;  // Pesticide information
    string qualityGrade;   // Quality grade (A/B/C)
    string imageHash;      // IPFS image hash
    string geoLocation;    // Geographic coordinates
}

// Key Functions
- uploadCrop()         // Farmers upload comprehensive crop data
- approveCrop()        // Inspectors approve quality-verified crops
- buyCrop()            // Consumers purchase with automatic payment
- addInspector()       // Owner adds authorized inspectors
- getCropDetails()     // Retrieve complete crop information
```

### Security Features
- **Owner-only inspector management**: Only contract owner can add inspectors
- **Status-based access control**: Crops must be approved before purchase
- **Automatic payment processing**: Secure ETH transfers to farmers
- **Immutable crop records**: All data permanently stored on blockchain

## 📊 Application Screenshots

### Crop Marketplace
- Clean, modern interface with purple gradient background
- Inspector-approved crops with quality grade badges (Grade A/B)
- Detailed crop cards showing quantity, pricing, and harvest dates
- Real-time crop count display

### Inspector Dashboard  
- Professional blue-themed interface for quality control
- Pending approval queue with comprehensive crop details
- Built-in inspection checklist for consistent quality verification
- One-click approve/disapprove functionality

### Farmer Dashboard
- Farmer-friendly green interface design  
- "My Crops" section showing all uploaded crops with status
- Easy crop upload with comprehensive detail capture
- Real-time status tracking for uploaded crops

## 🌟 Benefits & Impact

### For the Agriculture Industry
- **Complete Transparency**: Every crop's journey from farm to consumer is traceable
- **Quality Assurance**: Multi-point inspection system ensures only verified crops reach market
- **Reduced Fraud**: Blockchain immutability prevents tampering with crop records
- **Efficient Supply Chain**: Direct farmer-to-consumer connection eliminates intermediaries

### For Farmers
- **Fair Pricing**: Direct market access with transparent ETH-based pricing
- **Instant Payments**: Automatic payment processing upon crop sale
- **Crop Documentation**: Comprehensive record-keeping with IPFS image storage
- **Global Market Access**: Ethereum-based platform enables worldwide reach

### For Inspectors  
- **Streamlined Workflow**: Dedicated dashboard with built-in inspection checklist
- **Permanent Record**: All inspection decisions permanently recorded on blockchain
- **Quality Standards**: Consistent grading system (A/B/C) for uniform quality control
- **Professional Interface**: Clean, efficient UI designed for inspection workflow

### For Consumers
- **Verified Quality**: Purchase only inspector-approved, grade-certified crops
- **Complete Traceability**: Access to harvest date, location, and farming practices
- **Secure Transactions**: MetaMask integration ensures safe, decentralized payments
- **Informed Choices**: Comprehensive crop information for better purchasing decisions

## 📊 Future Enhancements

- [ ] **Mobile Application**: React Native app for farmers and inspectors
- [ ] **IoT Integration**: Real-time crop monitoring with sensor data
- [ ] **AI Quality Assessment**: Machine learning for automated quality grading
- [ ] **Multi-Chain Support**: Expand to Polygon, BSC for lower transaction costs
- [ ] **NFT Certificates**: Premium crop certification as unique tokens
- [ ] **Weather Integration**: Climate data correlation with crop quality
- [ ] **Supply Chain Analytics**: Dashboard with farming trends and insights
- [ ] **Multi-Language Support**: Localization for global farmer adoption
- [ ] **Batch Processing**: Bulk crop upload for large-scale farmers
- [ ] **Insurance Integration**: Crop insurance based on blockchain verified data

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer**: [Your Name]
- **Blockchain Developer**: [Team Member]
- **Frontend Developer**: [Team Member]

## 📞 Contact

- **Project Link**: [https://github.com/yourusername/AGRISupplyChain](https://github.com/yourusername/AGRISupplyChain)
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile]

## 🙏 Acknowledgments

- Ethereum Foundation for blockchain infrastructure
- OpenZeppelin for secure smart contract libraries
- MetaMask for wallet integration
- The amazing open-source community

---

**Made with ❤️ for sustainable agriculture and blockchain innovation**

*Building the future of food supply chain, one block at a time.*
