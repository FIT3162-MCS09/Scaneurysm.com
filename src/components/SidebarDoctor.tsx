import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const SidebarDoctor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sidebar">
      <button
        className={location.pathname === "/upload" ? "active" : ""}
        onClick={() => navigate("/upload")}
      >
        Upload Scan
      </button>
      <button
        className={location.pathname === "/patient-records" ? "active" : ""}
        onClick={() => navigate("/patient-records")}
      >
        Patient Records
      </button>
    </div>
  );
};

export default SidebarDoctor;