// src/components/SidebarPatient.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import LanguageSelector from "./LanguageSelector";

const SidebarPatient = () => {
  /* --------------------------------------------------------- *
   * state – remember open/closed across refresh via localStorage
   * --------------------------------------------------------- */
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return localStorage.getItem("isSidebarOpen") === "true";
  });

  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("isSidebarOpen", String(newState));
  };

  /* restore sidebar state on mount */
  useEffect(() => {
    setIsSidebarOpen(localStorage.getItem("isSidebarOpen") === "true");
  }, []);

  /* --------------------------------------------------------- *
   * render
   * --------------------------------------------------------- */
  return (
    <div className="sidebar-container">
      {/* ─── sidebar panel ─── */}
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

        {/* NEW – Find Hospitals */}
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

        {/* footer = language switcher */}
        <div className="sidebar-footer">
          <LanguageSelector />
        </div>
      </div>

      {/* ─── hamburger toggle ─── */}
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