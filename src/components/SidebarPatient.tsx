import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const SidebarPatient = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        // Retrieve the sidebar state from localStorage or default to false
        return localStorage.getItem("isSidebarOpen") === "true";
    });
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const toggleSidebar = () => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        localStorage.setItem("isSidebarOpen", String(newState)); // Save the state to localStorage
    };

    useEffect(() => {
        // Sync the sidebar state with localStorage on component mount
        const savedState = localStorage.getItem("isSidebarOpen") === "true";
        setIsSidebarOpen(savedState);
    }, []);

    return (
        <div className="sidebar-container">
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
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

                <button
                    className={pathname === "/about" ? "active" : ""}
                    onClick={() => navigate("/about")}
                >
                    About
                </button>
            </div>

            {/* Toggle Button */}
            <button
                className={`sidebar-toggle ${isSidebarOpen ? "open" : ""}`}
                onClick={toggleSidebar}
            >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
            </button>
        </div>
    );
};

export default SidebarPatient;