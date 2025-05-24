import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './InspectorDashboard.css';

const InspectorDashboard = ({ contract, crops, onCropApproved }) => {
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  // Local copy of crops to manage state internally
  const [localCrops, setLocalCrops] = useState([]);

  // Keep track of disapproved crop IDs so they stay hidden even if crops prop updates
  const [disapprovedCropIds, setDisapprovedCropIds] = useState(new Set());

  // Sync localCrops whenever crops prop changes
  useEffect(() => {
    setLocalCrops(crops);
  }, [crops]);

  const handleApproveCrop = async (cropId) => {
    if (!contract) return;

    setLoading(true);
    setApprovingId(cropId);

    try {
      const tx = await contract.approveCrop(cropId);
      await tx.wait();

      alert('Crop approved successfully!');
      onCropApproved();

      // Remove approved crop from frontend:
      setLocalCrops(prev => prev.filter(crop => crop.id !== cropId));

      // Also remove from disapproved set just in case
      setDisapprovedCropIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(cropId);
        return newSet;
      });
    } catch (error) {
      console.error('Error approving crop:', error);
      alert('Error approving crop. Please try again.');
    } finally {
      setLoading(false);
      setApprovingId(null);
    }
  };

  const handleDisapproveCrop = (cropId) => {
    // Add crop ID to disapproved set to hide locally without backend interaction
    setDisapprovedCropIds(prev => new Set(prev).add(cropId));
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Filter out approved crops (status === 1n) and disapproved crops
  const filteredCrops = localCrops.filter(
    (crop) => crop.status === 0n && !disapprovedCropIds.has(crop.id)
  );

  return (
    <div className="inspector-dashboard">
      <div className="dashboard-header">
        <h2>🔍 Inspector Dashboard</h2>
        <p>Review and approve crops for marketplace listing</p>
      </div>

      <div className="pending-crops-section">
        <h3>Pending Approval ({filteredCrops.length})</h3>

        {filteredCrops.length === 0 ? (
          <div className="no-crops">
            <p>No crops pending approval at the moment.</p>
          </div>
        ) : (
          <div className="crops-list">
            {filteredCrops.map((crop) => (
              <div key={crop.id} className="crop-inspection-card">
                <div className="crop-main-info">
                  <div className="crop-basic">
                    <h4>{crop.details.name}</h4>
                    <p className="crop-type">{crop.details.cropType}</p>
                    <p className="farmer-info">
                      Farmer: <span className="farmer-address">{formatAddress(crop.farmer)}</span>
                    </p>
                  </div>

                  <div className="crop-metrics">
                    <div className="metric">
                      <label>Quantity</label>
                      <span>{crop.details.quantity} kg</span>
                    </div>
                    <div className="metric">
                      <label>Price per kg</label>
                      <span>{ethers.formatEther(crop.details.price)} ETH</span>
                    </div>
                    <div className="metric">
                      <label>Total Value</label>
                      <span>
                        {ethers.formatEther(
                          BigInt(crop.details.price) * BigInt(crop.details.quantity)
                        )} ETH
                      </span>
                    </div>
                    <div className="metric">
                      <label>Quality Grade</label>
                      <span className={`grade grade-${crop.details.qualityGrade.toLowerCase()}`}>
                        {crop.details.qualityGrade}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="crop-detailed-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Harvest Date:</label>
                      <span>{crop.details.harvestDate}</span>
                    </div>

                    {crop.details.fertilizerUsed && (
                      <div className="info-item">
                        <label>Fertilizer Used:</label>
                        <span>{crop.details.fertilizerUsed}</span>
                      </div>
                    )}

                    {crop.details.pesticideUsed && (
                      <div className="info-item">
                        <label>Pesticide Used:</label>
                        <span>{crop.details.pesticideUsed}</span>
                      </div>
                    )}

                    {crop.details.geoLocation && (
                      <div className="info-item">
                        <label>Location:</label>
                        <span>{crop.details.geoLocation}</span>
                      </div>
                    )}

                    {crop.details.imageHash && (
                      <div className="info-item">
                        <label>Image Hash:</label>
                        <span className="hash">{crop.details.imageHash}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="inspection-actions">
                  <div className="inspection-checklist">
                    <h5>Inspection Checklist:</h5>
                    <ul>
                      <li>✓ Crop details are accurate</li>
                      <li>✓ Quality grade matches description</li>
                      <li>✓ Harvest date is reasonable</li>
                      <li>✓ Chemical usage is within limits</li>
                      <li>✓ Farmer information verified</li>
                    </ul>
                  </div>

                  <div className="action-buttons">
                    <button
                      className="approve-btn"
                      onClick={() => handleApproveCrop(crop.id)}
                      disabled={loading && approvingId === crop.id}
                    >
                      {loading && approvingId === crop.id ? (
                        <>
                          <span className="spinner"></span>
                          Approving...
                        </>
                      ) : (
                        <>✓ Approve Crop</>
                      )}
                    </button>

                    <button
                      className="disapprove-btn"
                      onClick={() => handleDisapproveCrop(crop.id)}
                      disabled={loading && approvingId === crop.id}
                    >
                      ✗ Disapprove Crop
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="inspection-guidelines">
        <h4>Inspection Guidelines</h4>
        <div className="guidelines-grid">
          <div className="guideline">
            <h5>🌱 Quality Standards</h5>
            <ul>
              <li>Grade A: Premium quality, no defects</li>
              <li>Grade B: Good quality, minor defects</li>
              <li>Grade C: Standard quality, visible defects</li>
            </ul>
          </div>

          <div className="guideline">
            <h5>🧪 Chemical Limits</h5>
            <ul>
              <li>Verify pesticide usage is within safe limits</li>
              <li>Check fertilizer types are approved</li>
              <li>Ensure no banned substances used</li>
            </ul>
          </div>

          <div className="guideline">
            <h5>📋 Documentation</h5>
            <ul>
              <li>Harvest date should be recent</li>
              <li>Location information should be accurate</li>
              <li>All required fields should be filled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorDashboard;
