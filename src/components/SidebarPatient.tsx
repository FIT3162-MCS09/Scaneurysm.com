import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const SidebarPatient = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user_info") || "{}");

    return (
        <div className="sidebar">
            <button
                className={location.pathname === `/dashboard` ? "active" : ""}
                onClick={() => navigate(`/dashboard/`)}
            >
                Dashboard
            </button>
            <button
                className={location.pathname === "/upload" ? "active" : ""}
                onClick={() => navigate("/upload")}
            >
                Upload Scan
            </button>
            <button
                className={location.pathname === "/my-records" ? "active" : ""}
                onClick={() => navigate("/my-records")}
            >
                My Records
            </button>
            <button
                className={location.pathname === `/result/${user.id}` ? "active" : ""}
                onClick={() => navigate(`/result/`)}
            >
                My Results
            </button>
        </div>
    );
};

export default SidebarPatient;