import React, { useState, useEffect } from "react";
import "./OwnerDashboard.css";

const OwnerDashboard = ({ contract, account }) => {
  const [inspectorAddress, setInspectorAddress] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState("");

  useEffect(() => {
    const checkOwner = async () => {
      if (!contract || !account) return;

      try {
        const contractOwner = await contract.owner();
        setOwnerAddress(contractOwner);
        setIsOwner(contractOwner.toLowerCase() === account.toLowerCase());
      } catch (err) {
        console.error("Failed to check owner:", err);
        setIsOwner(false);
      }
    };

    checkOwner();
  }, [contract, account]);

  const handleAddInspector = async (e) => {
    e.preventDefault();
    if (!contract || !inspectorAddress) return;

    setLoading(true);
    try {
      const tx = await contract.addInspector(inspectorAddress);
      await tx.wait();

      alert("✅ Inspector added successfully!");
      setInspectorAddress("");
    } catch (error) {
      console.error("❌ Error adding inspector:", error);
      alert("Failed to add inspector.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) {
    return (
      <div className="owner-dashboard">
        <div className="dashboard-card">
          <h2>🚫 Access Denied</h2>
          <p>You are not the contract owner.</p>
          <p>
            <strong>Contract Owner:</strong> {ownerAddress || "Loading..."}
          </p>
          <p>
            <strong>Your Account:</strong> {account || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      <div className="dashboard-card">
        <h2>👑 Owner Dashboard</h2>
        <p>
          <strong>Owner:</strong> {ownerAddress}
        </p>

        <form onSubmit={handleAddInspector} className="inspector-form">
          <label htmlFor="inspectorAddress">Add Inspector (Ethereum Address)</label>
          <input
            type="text"
            id="inspectorAddress"
            value={inspectorAddress}
            onChange={(e) => setInspectorAddress(e.target.value)}
            placeholder="0x..."
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Inspector"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerDashboard;
