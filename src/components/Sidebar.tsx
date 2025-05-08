import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate     = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="sidebar">
      <button
        className={pathname === "/dashboard" ? "active" : ""}
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </button>

      <button
        className={pathname === "/upload" ? "active" : ""}
        onClick={() => navigate("/upload")}
      >
        Upload Scan
      </button>

      <button
        className={pathname.startsWith("/result") ? "active" : ""}
        onClick={() => navigate("/result")}
      >
        My Results
      </button>
    </div>
  );
};

export default Sidebar;
