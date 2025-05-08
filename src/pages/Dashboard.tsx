import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authServices";
import ProfileButton from "../components/ProfileButton";
import "./Dashboard.css";

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

      <footer className="dashboard-footer">
        <div className="footer-left">
          <a href="#">Give us feedback</a>
          <a href="#">Privacy Policy</a>
          <a href="/about">About Aneurysm</a>
        </div>

        <div className="footer-center">
          <p><strong>Emergency Help</strong></p>
          <p>📞 +60&nbsp;1234567</p>
        </div>

        <div className="footer-right">
          <p><strong>Connect with us!</strong></p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f" /></a>
            <a href="#"><i className="fab fa-instagram" /></a>
            <a href="#"><i className="fab fa-linkedin-in" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
