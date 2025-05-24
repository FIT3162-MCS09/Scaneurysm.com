// src/pages/Dashboard.tsx
// -----------------------------------------------------------------------------
// Dashboard with mini-map preview + i18n
// -----------------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { useNavigate }          from "react-router-dom";
import { useTranslation }       from "react-i18next";

import { authService }          from "../services/authServices";
import predictionServices       from "../services/predictionServices";

import ProfileButton            from "../components/ProfileButton";
import LanguageSelector         from "../components/LanguageSelector";
import ResultSummary            from "../components/ResultSummary";
import Footer                   from "../components/Footer";

import { PredictionResult }     from "../types/prediction";

import "./Dashboard.css";

/* ── tiny Leaflet preview for the “Find Hospitals” card ──────────────────── */
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default as any).prototype._getIconUrl;             // eslint-disable-line
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl:       require("leaflet/dist/images/marker-icon.png"),
  shadowUrl:     require("leaflet/dist/images/marker-shadow.png"),
});
// ----------------------------------------------------------------------------

const Dashboard: React.FC = () => {
  const navigate            = useNavigate();
  const { t }               = useTranslation("dashboard");

  const [role,    setRole]  = useState("");
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  /* fetch user role once */
  useEffect(() => {
    (async () => {
      try {
        const profile = await authService.fetchUserProfile();
        setRole(profile.role);
      } catch (err) {
        console.error(t("errors.fetchRole"), err);
      }
    })();
  }, [t]);

  /* fetch predictions + profile in parallel */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, predictionData] = await Promise.all([
          authService.fetchUserProfile(),
          predictionServices.getPredictionDetails(),
        ]);

        setRole(profile.role);
        if (Array.isArray(predictionData)) {
          setResults(predictionData);
        } else {
          throw new Error("Invalid prediction data format");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(t("errors.fetchData"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  /* ──────────────────────────────────────────────────────────────────────── */

  return (
    <div className="dashboard-wrapper">
      <div className="top-controls">
        <LanguageSelector />
        <ProfileButton />
      </div>

      <header className="dashboard-header">
        <img src="/images/logo.png" alt={t("logoAlt")} className="dashboard-logo" />
      </header>

      <main className="dashboard-content">
        {/* ╭──── left grid (buttons + preview) ────╮ */}
        <div className="dashboard-buttons">
          <button onClick={() => navigate("/upload")}>
            {t("uploadScan")}
          </button>

          <button onClick={() => navigate("/result")}>
            {t("myResults")}
          </button>

          {/* full-row ABOUT button */}
          <button
            className="full-width"
            onClick={() => navigate("/about")}
          >
            {t("aboutAneurysm")}
          </button>

          {/* full-row hospital preview card */}
          <div
            className="hospital-card full-width"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/find-hospital")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/find-hospital")}
          >
            <span className="hospital-card-label">
              <i className="fas fa-hospital-alt" /> {t("Find Nearby Hospitals")}
            </span>

            <MapContainer
              center={[4.2, 102.0]}
              zoom={5}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              dragging={false}
              attributionControl={false}
              zoomControl={false}
              style={{ height: "200px", width: "100%", borderRadius: "12px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[3.1201, 101.6544]} />
              <Marker position={[5.4151, 100.3288]} />
              <Marker position={[1.486, 103.7615]} />
            </MapContainer>
          </div>
        </div>
        {/* ╰──────────────────────────────────────╯ */}

        {/* right-hand panel */}
        {loading ? (
          <div className="summary-loading">
            <h3>{t("summary.title")}</h3>
            <div className="loading-content">
              <div className="loading-spinner" />
              <p>{t("summary.loadingMessage")}</p>
              <p className="loading-subtext">{t("summary.loadingSubtext")}</p>
            </div>
          </div>
        ) : error ? (
          <div className="summary-error">
            <h3>{t("summary.title")}</h3>
            <p>{error}</p>
          </div>
        ) : results.length > 0 ? (
          <ResultSummary
            latestResult={results[0]}
            totalScans={results.length}
            recentResults={results.slice(0, 5)}
          />
        ) : (
          <div className="summary-empty">
            <h3>{t("summary.title")}</h3>
            <p>{t("summary.noResults")}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;