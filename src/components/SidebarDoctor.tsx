import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const SidebarDoctor = () => {
  const navigate     = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="sidebar">
      {/* Dashboard */}
      <button
        className={pathname === "/dashboard" ? "active" : ""}
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </button>

      {/* Upload */}
      <button
        className={pathname === "/upload" ? "active" : ""}
        onClick={() => navigate("/upload")}
      >
        Upload Scan
      </button>

      {/* Results */}
      <button
        className={pathname.startsWith("/result") ? "active" : ""}
        onClick={() => navigate("/result")}
      >
        My Results
      </button>
    </div>
  );
};

export default SidebarDoctor;
