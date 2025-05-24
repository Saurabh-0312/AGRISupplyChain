import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './ConsumerDashboard.css';

const ConsumerDashboard = ({ contract, account, crops, onCropPurchased }) => {
  const [loading, setLoading] = useState(false);
  const [buyingId, setBuyingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const handleBuyCrop = async (crop) => {
    if (!contract) return;

    setBuyingId(crop.id);
    setLoading(true);
    
    try {
      const totalPrice = BigInt(crop.details.price) * BigInt(crop.details.quantity);
      
      const tx = await contract.buyCrop(crop.id, {
        value: totalPrice
      });
      
      await tx.wait();
      
      alert('Crop purchased successfully!');
      onCropPurchased();
    } catch (error) {
      console.error('Error purchasing crop:', error);
      alert('Error purchasing crop. Please try again.');
    } finally {
      setLoading(false);
      setBuyingId(null);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const filteredCrops = crops.filter(crop => {
    if (filter === 'all') return true;
    return crop.details.cropType.toLowerCase().includes(filter.toLowerCase());
  });

  const sortedCrops = [...filteredCrops].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return Number(a.details.price) - Number(b.details.price);
      case 'quantity':
        return Number(a.details.quantity) - Number(b.details.quantity);
      case 'grade':
        return a.details.qualityGrade.localeCompare(b.details.qualityGrade);
      case 'name':
      default:
        return a.details.name.localeCompare(b.details.name);
    }
  });

  const cropTypes = [...new Set(crops.map(crop => crop.details.cropType))];

  return (
    <div className="consumer-dashboard">
      <div className="dashboard-header">
        <h2>🛒 Crop Marketplace</h2>
        <p>Browse and purchase high-quality, inspector-approved crops</p>
      </div>

      <div className="marketplace-controls">
        <div className="filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Crop Types</option>
            {cropTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="grade">Sort by Grade</option>
          </select>
        </div>
        
        <div className="marketplace-stats">
          <span className="stat">Total Crops: {sortedCrops.length}</span>
        </div>
      </div>

      <div className="marketplace-section">
        {sortedCrops.length === 0 ? (
          <div className="no-crops">
            <p>No approved crops available for purchase at the moment.</p>
          </div>
        ) : (
          <div className="crops-marketplace">
            {sortedCrops.map((crop) => (
              <div key={crop.id} className="crop-marketplace-card">
                <div className="crop-image-placeholder">
                  {crop.details.imageHash ? (
                    <img 
                      src={`https://ipfs.io/ipfs/${crop.details.imageHash}`}
                      alt={crop.details.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="image-fallback">
                    <span className="crop-icon">🌾</span>
                  </div>
                </div>
                
                <div className="crop-info">
                  <div className="crop-header">
                    <h4>{crop.details.name}</h4>
                    <span className={`grade-badge grade-${crop.details.qualityGrade.toLowerCase()}`}>
                      Grade {crop.details.qualityGrade}
                    </span>
                  </div>
                  
                  <p className="crop-type">{crop.details.cropType}</p>
                  
                  <div className="crop-details">
                    <div className="detail-row">
                      <span className="label">Quantity:</span>
                      <span className="value">{crop.details.quantity} kg</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Price per kg:</span>
                      <span className="value price">{ethers.formatEther(crop.details.price)} ETH</span>
                    </div>
                    
                    <div className="detail-row total-price">
                      <span className="label">Total Price:</span>
                      <span className="value total">{ethers.formatEther(BigInt(crop.details.price) * BigInt(crop.details.quantity))} ETH</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Harvest Date:</span>
                      <span className="value">{crop.details.harvestDate}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Farmer:</span>
                      <span className="value farmer">{formatAddress(crop.farmer)}</span>
                    </div>
                    
                    {crop.details.geoLocation && (
                      <div className="detail-row">
                        <span className="label">Location:</span>
                        <span className="value">{crop.details.geoLocation}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="crop-chemicals">
                    {crop.details.fertilizerUsed && (
                      <div className="chemical-info">
                        <span className="chemical-label">Fertilizer:</span>
                        <span className="chemical-value">{crop.details.fertilizerUsed}</span>
                      </div>
                    )}
                    
                    {crop.details.pesticideUsed && (
                      <div className="chemical-info">
                        <span className="chemical-label">Pesticide:</span>
                        <span className="chemical-value">{crop.details.pesticideUsed}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="crop-actions">
                  <button
                    className="buy-btn"
                    onClick={() => handleBuyCrop(crop)}
                    disabled={loading && buyingId === crop.id}
                  >
                    {loading && buyingId === crop.id ? (
                      <>
                        <span className="spinner"></span>
                        Purchasing...
                      </>
                    ) : (
                      <>
                        🛒 Buy Now
                      </>
                    )}
                  </button>
                  
                  <div className="crop-verification">
                    <span className="verified-badge">✓ Inspector Approved</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="marketplace-info">
        <div className="info-cards">
          <div className="info-card">
            <h4>🌟 Quality Assurance</h4>
            <p>All crops are thoroughly inspected and approved by certified inspectors before being listed on the marketplace.</p>
          </div>
          
          <div className="info-card">
            <h4>🔒 Secure Transactions</h4>
            <p>All transactions are secured by smart contracts on the blockchain, ensuring transparency and trust.</p>
          </div>
          
          <div className="info-card">
            <h4>🚚 Direct from Farm</h4>
            <p>Purchase directly from farmers, supporting local agriculture and ensuring freshness.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;