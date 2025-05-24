import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import LanguageSelector from "./LanguageSelector";

const Sidebar: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        // Retrieve the sidebar state from localStorage or default to false
        return localStorage.getItem("isSidebarOpen") === "true";
    });
    const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        // Check user role from localStorage
        const userInfoStr = localStorage.getItem("user_info");
        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                setUserType(userInfo.role === "doctor" ? "doctor" : "patient");
            } catch (error) {
                console.error("Error parsing user_info from localStorage:", error);
            }
        }
    }, []);

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

    // Determine button text based on userType
    const resultsBtnLabel = userType === 'patient' ? 'My Results' : 'My Patients';

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
                    {resultsBtnLabel}
                </button>
                       
                <button
                className={pathname === "/find-hospital" ? "active" : ""}
                onClick={() => navigate("/find-hospital")}
                >
                Find&nbsp;Hospitals
                </button>

                <button
                    className={pathname === "/about" ? "active" : ""}
                    onClick={() => navigate("/about")}
                >
                    About
                </button>
                <div className="sidebar-footer">
                    <LanguageSelector />
                </div>
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

export default Sidebar;
