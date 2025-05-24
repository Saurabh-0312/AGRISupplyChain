import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "./components/Header";
import FarmerDashboard from "./components/FarmerDashboard";
import InspectorDashboard from "./components/InspectorDashboard";
import ConsumerDashboard from "./components/ConsumerDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

// Contract ABI - make sure this exactly matches your contract's ABI!
const CONTRACT_ABI = [
  "function owner() view returns (address)",
  "function cropCount() view returns (uint256)",
  "function crops(uint256) view returns (uint256 id, address farmer, tuple(string name, string cropType, uint256 quantity, uint256 price, string harvestDate, string fertilizerUsed, string pesticideUsed, string qualityGrade, string imageHash, string geoLocation) details, uint8 status, address buyer)",
  "function inspectors(address) view returns (bool)",
  "function addInspector(address _inspector)",
  "function uploadCrop(string _name, string _cropType, uint256 _quantity, uint256 _price, string _harvestDate, string _fertilizerUsed, string _pesticideUsed, string _qualityGrade, string _imageHash, string _geoLocation)",
  "function approveCrop(uint256 _id)",
  "function buyCrop(uint256 _id) payable",
];

// Replace with your deployed contract address (check this carefully)
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(true);
  const [isInspector, setIsInspector] = useState(false);
  const [activeTab, setActiveTab] = useState("consumer");
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);

  // Connect wallet & contract

    useEffect(() => {
    loadCrops(contract);
  }, [contract]);
  
  useEffect(() => {
  console.log("Updated crops:", crops);
}, [crops]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setAccount(userAddress);
      setProvider(provider);
      setContract(contractInstance);

      // Check roles and load crops
      await checkUserRole(contractInstance, userAddress);
      await loadCrops(contractInstance);

      console.log("Connected to wallet:", userAddress);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  // Check if connected user is owner or inspector
  const checkUserRole = async (contractInstance, userAddress) => {
    try {
      if (!contractInstance || !userAddress) return;

      const owner = await contractInstance.owner();
      const inspector = await contractInstance.inspectors(userAddress);

      console.log("Owner is:", owner);
      setIsOwner(owner.toLowerCase() === userAddress.toLowerCase());
      setIsInspector(inspector);
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsOwner(false);
      setIsInspector(false);
    }
  };

  // Load crops from contract
  const loadCrops = async (contractInstance) => {
    if (!contractInstance) return;

    setLoading(true);
    try {
      const cropCountBN = await contractInstance.cropCount();
      console.log(" count of crops is  : ", cropCountBN);
      const cropCount = cropCountBN.toNumber ? cropCountBN.toNumber() : Number(cropCountBN);

      const cropsArray = [];
      for (let i = 0; i < cropCount; i++) {
        const crop = await contractInstance.crops(i);
        cropsArray.push({
          id: crop.id.toString(),
          farmer: crop.farmer,
          details: {
            name: crop.details.name,
            cropType: crop.details.cropType,
            quantity: crop.details.quantity.toString(),
            price: crop.details.price.toString(),
            harvestDate: crop.details.harvestDate,
            fertilizerUsed: crop.details.fertilizerUsed,
            pesticideUsed: crop.details.pesticideUsed,
            qualityGrade: crop.details.qualityGrade,
            imageHash: crop.details.imageHash,
            geoLocation: crop.details.geoLocation,
          },
          status: crop.status,
          buyer: crop.buyer,
        });
      }
      
      setCrops(cropsArray);
      console.log("crops are : ", crops);
    } catch (error) {
      console.error("Error loading crops:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto connect wallet if already connected
  useEffect(() => {
    const tryAutoConnect = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          await connectWallet();
        }
      }
    };
    tryAutoConnect();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handler = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (contract) {
            checkUserRole(contract, accounts[0]);
          }
        } else {
          setAccount("");
          setProvider(null);
          setContract(null);
          setIsOwner(false);
          setIsInspector(false);
          setCrops([]);
        }
      };
      window.ethereum.on("accountsChanged", handler);
      return () => window.ethereum.removeListener("accountsChanged", handler);
    }
  }, [contract]);

  return (
    <div className="App">
      <header
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 20px",
        }}
      >
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <Header
        account={account}
        connectWallet={connectWallet}
        isOwner={isOwner}
        isInspector={isInspector}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="main-content">
        {!account ? (
          <div className="connect-prompt">
            <h2>Welcome to AgriSupplyChain</h2>
            <p>Connect your wallet to get started</p>
            <button onClick={connectWallet} className="connect-btn">
              Connect MetaMask
            </button>
          </div>
        ) : (
          <>
            {loading && <div className="loading">Loading crops...</div>}

            {activeTab === "farmer" && (
              <FarmerDashboard
                contract={contract}
                account={account}
                crops={crops.filter(
                  (crop) => crop.farmer.toLowerCase() === account.toLowerCase()
                )}
                onCropUploaded={() => loadCrops(contract)}
              />
            )}

            {activeTab === "inspector" && isInspector && (
              <InspectorDashboard
                contract={contract}
                crops={crops.filter((crop) => crop.status === 0n)} // Only uploaded crops
                onCropApproved={() => loadCrops(contract)}
              />
            )}

            {activeTab === "consumer" && (
              <ConsumerDashboard
                contract={contract}
                account={account}
                crops={crops.filter((crop) => crop.status === 1n)} // Only approved crops
                onCropPurchased={() => loadCrops(contract)}
              />
            )}

            {activeTab === "owner" && isOwner && (
              <OwnerDashboard
                contract={contract}
                account={account}
                onInspectorAdded={() => {
                  console.log("Inspector added");
                  loadCrops(contract);
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
