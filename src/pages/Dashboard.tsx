import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authServices";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const profile = await authService.fetchUserProfile();
        setRole(profile.role); // 'doctor' or 'patient'
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        // Optional: redirect to login page if auth fails
      }
    };

    fetchRole();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Brain Aneurysm Detection</h1>
      <div className="dashboard-buttons">
        <button onClick={() => navigate("/upload")}>Upload Scan</button>
        {role === "doctor" && (
          <button onClick={() => navigate("/patient-records")}>Patient Records</button>
        )}
        {role === "patient" && (
          <button onClick={() => navigate("/my-records")}>My Records</button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
