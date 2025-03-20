import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Brain Aneurysm Detection</h1>
      <div className="dashboard-buttons">
        <button onClick={() => navigate("/upload")}>Upload Scan</button>
        <button onClick={() => navigate("/patient-records")}>Patient Records</button>
      </div>
    </div>
  );
};

export default Dashboard;
