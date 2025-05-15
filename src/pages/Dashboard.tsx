import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authServices";
import ProfileButton from "../components/ProfileButton";
import "./Dashboard.css";
import Footer from "../components/Footer";
import { useTranslation } from 'react-i18next';


const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const { t } = useTranslation('dashboard');

  /* fetch role once */
  useEffect(() => {
    (async () => {
      try {
        const profile = await authService.fetchUserProfile();
        setRole(profile.role);              // kept in case you need it later
      } catch (err) {
        console.error(t('errors.fetchRole'), err);
      }
    })();
  }, [t]);

  return (
    <div className="dashboard-wrapper">
      <ProfileButton />

      <header className="dashboard-header">
        <img
          src="/images/logo.png"
          alt={t('logoAlt')}
          className="dashboard-logo"
        />
      </header>

      <main className="dashboard-content">
        <div className="dashboard-buttons">
            <button onClick={() => navigate("/upload")}>{t('uploadScan')}</button>
            <button onClick={() => navigate("/result")}>{t('myResults')}</button>
            <button onClick={() => navigate("/about")}>{t('aboutAneurysm')}</button>
        </div>
      </main>

      <Footer/>
    </div>
  );
};

export default Dashboard;
