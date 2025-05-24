import React from 'react';
import './Header.css';

const Header = ({ account, connectWallet, isOwner, isInspector, activeTab, setActiveTab }) => {
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  console.log("the owner is  : ", isOwner);
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>🌾 AgriSupplyChain</h1>
        </div>
        
        <nav className="navigation">
          {account && (
            <>
              <button 
                className={`nav-btn ${activeTab === 'consumer' ? 'active' : ''}`}
                onClick={() => setActiveTab('consumer')}
              >
                🛒 Marketplace
              </button>
               {!isInspector && (
              <button 
                className={`nav-btn ${activeTab === 'farmer' ? 'active' : ''}`}
                onClick={() => setActiveTab('farmer')}
              >
                👨‍🌾 Farmer
              </button>
               )}
              {isInspector && (
                <button 
                  className={`nav-btn ${activeTab === 'inspector' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inspector')}
                >
                  🔍 Inspector
                </button>
              )}
            
              {isOwner && (
                <button 
                  className={`nav-btn ${activeTab === 'owner' ? 'active' : ''}`}
                  onClick={() => setActiveTab('owner')}
                >
                  ⚙️ Owner
                </button>
              )}
            </>
          )}
        </nav>
        
        <div className="wallet-section">
          {account ? (
            <div className="account-info">
              <div className="account-badges">
                {isOwner && <span className="badge owner">Owner</span>}
                {isInspector && <span className="badge inspector">Inspector</span>}
              </div>
              <span className="account-address">{formatAddress(account)}</span>
            </div>
          ) : (
            <button onClick={connectWallet} className="connect-wallet-btn">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

