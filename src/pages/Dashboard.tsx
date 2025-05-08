import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authServices";
import ProfileButton from "../components/ProfileButton";
import "./Dashboard.css";
import Footer from "../components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  /* fetch role once */
  useEffect(() => {
    (async () => {
      try {
        const profile = await authService.fetchUserProfile();
        setRole(profile.role);              // kept in case you need it later
      } catch (err) {
        console.error("Failed to fetch user role:", err);
      }
    })();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <ProfileButton />

      <header className="dashboard-header">
        <img
          src="/images/logo.png"
          alt="Scaneurysm Logo"
          className="dashboard-logo"
        />
      </header>

      <main className="dashboard-content">
        <div className="dashboard-buttons">
          <button onClick={() => navigate("/upload")}>Upload Scan</button>
          <button onClick={() => navigate("/result")}>My Results</button>
          <button onClick={() => navigate("/about")}>About Aneurysm</button>
        </div>
      </main>

      <Footer/>
    </div>
  );
};

export default Dashboard;
