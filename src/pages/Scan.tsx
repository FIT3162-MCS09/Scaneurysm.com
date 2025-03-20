import React from "react";
import "./Scan.css"; // Creating this next

const Scan = () => {
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <button className="active">Patient Records</button>
        <button>Upload Scan</button>
      </div>
      <div className="main-content">
        <h1>Brain Aneurysm Detection</h1>
        <input type="text" placeholder="Enter Patient ID" />
        <button>Search</button>
      </div>
    </div>
  );
};

export default Scan;
