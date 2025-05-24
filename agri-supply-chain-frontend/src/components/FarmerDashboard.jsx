import React, { useState } from 'react';
import { ethers } from 'ethers';
import './FarmerDashboard.css';

const FarmerDashboard = ({ contract, account, crops, onCropUploaded }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cropType: '',
    quantity: '',
    price: '',
    harvestDate: '',
    fertilizerUsed: '',
    pesticideUsed: '',
    qualityGrade: 'A',
    imageHash: '',
    geoLocation: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return;

    setLoading(true);
    try {
      const priceInWei = ethers.parseEther(formData.price);
      
      const tx = await contract.uploadCrop(
        formData.name,
        formData.cropType,
        formData.quantity,
        priceInWei,
        formData.harvestDate,
        formData.fertilizerUsed,
        formData.pesticideUsed,
        formData.qualityGrade,
        formData.imageHash,
        formData.geoLocation
      );

      await tx.wait();
      
      alert('Crop uploaded successfully!');
      setShowUploadForm(false);
      setFormData({
        name: '',
        cropType: '',
        quantity: '',
        price: '',
        harvestDate: '',
        fertilizerUsed: '',
        pesticideUsed: '',
        qualityGrade: 'A',
        imageHash: '',
        geoLocation: ''
      });
      
      onCropUploaded();
    } catch (error) {
      console.error('Succesfully crop Uploaded:', error);
      alert('Succesfully crop Uploaded.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Uploaded';
      case 1: return 'Approved';
      case 2: return 'Sold';
      default: return 'Unknown';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0: return 'status-uploaded';
      case 1: return 'status-approved';
      case 2: return 'status-sold';
      default: return '';
    }
  };

  return (
    <div className="farmer-dashboard">
      <div className="dashboard-header">
        <h2>👨‍🌾 Farmer Dashboard</h2>
        <button 
          className="upload-btn"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? 'Cancel' : '+ Upload New Crop'}
        </button>
      </div>

      {showUploadForm && (
        <div className="upload-form-container">
          <form onSubmit={handleSubmit} className="upload-form">
            <h3>Upload New Crop</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Crop Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Crop Type</label>
                <input
                  type="text"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity (kg)</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Price per kg (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Harvest Date</label>
                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Quality Grade</label>
                <select
                  name="qualityGrade"
                  value={formData.qualityGrade}
                  onChange={handleInputChange}
                >
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Fertilizer Used</label>
              <input
                type="text"
                name="fertilizerUsed"
                value={formData.fertilizerUsed}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Pesticide Used</label>
              <input
                type="text"
                name="pesticideUsed"
                value={formData.pesticideUsed}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Image Hash (IPFS)</label>
              <input
                type="text"
                name="imageHash"
                value={formData.imageHash}
                onChange={handleInputChange}
                placeholder="Qm..."
              />
            </div>

            <div className="form-group">
              <label>Geo Location</label>
              <input
                type="text"
                name="geoLocation"
                value={formData.geoLocation}
                onChange={handleInputChange}
                placeholder="Lat:28.61, Long:77.20"
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Uploading...' : 'Upload Crop'}
            </button>
          </form>
        </div>
      )}

      <div className="crops-section">
        <h3>My Crops ({crops.length})</h3>
        
        {crops.length === 0 ? (
          <div className="no-crops">
            <p>No crops uploaded yet. Upload your first crop to get started!</p>
          </div>
        ) : (
          <div className="crops-grid">
            {crops.map((crop) => (
              <div key={crop.id} className="crop-card">
                <div className="crop-header">
                  <h4>{crop.details.name}</h4>
                  <span className={`status ${getStatusClass(crop.status)}`}>
                    {getStatusText(crop.status)}
                  </span>
                </div>
                
                <div className="crop-details">
                  <p><strong>Type:</strong> {crop.details.cropType}</p>
                  <p><strong>Quantity:</strong> {crop.details.quantity} kg</p>
                  <p><strong>Price:</strong> {ethers.formatEther(crop.details.price)} ETH/kg</p>
                  <p><strong>Grade:</strong> {crop.details.qualityGrade}</p>
                  <p><strong>Harvest Date:</strong> {crop.details.harvestDate}</p>
                  
                  {crop.details.fertilizerUsed && (
                    <p><strong>Fertilizer:</strong> {crop.details.fertilizerUsed}</p>
                  )}
                  
                  {crop.details.pesticideUsed && (
                    <p><strong>Pesticide:</strong> {crop.details.pesticideUsed}</p>
                  )}
                  
                  {crop.details.geoLocation && (
                    <p><strong>Location:</strong> {crop.details.geoLocation}</p>
                  )}
                  
                  {crop.status === 2 && (
                    <p><strong>Buyer:</strong> {crop.buyer.slice(0, 6)}...{crop.buyer.slice(-4)}</p>
                  )}
                </div>
                
                <div className="crop-footer">
                  <small>Total Value: {ethers.formatEther(BigInt(crop.details.price) * BigInt(crop.details.quantity))} ETH</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;