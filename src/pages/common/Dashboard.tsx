import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authServices";
import ProfileButton from "../../components/ProfileButton";
import "./Dashboard.css";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/LanguageSelector";
import ResultSummary from "../../components/ResultSummary";
import predictionServices from "../../services/predictionServices";
import { PredictionResult } from "../../types/prediction";

/* ──────────────── NEW: tiny Leaflet preview imports ──────────────── */
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default as any).prototype._getIconUrl;             // eslint-disable-line
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl:       require("leaflet/dist/images/marker-icon.png"),
    shadowUrl:     require("leaflet/dist/images/marker-shadow.png"),
});
/* ─────────────────────────────────────────────────────────────────── */

const Dashboard = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const { t } = useTranslation("dashboard");
    const [results, setResults] = useState<PredictionResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* fetch role once */
    useEffect(() => {
        (async () => {
            try {
                const profile = await authService.fetchUserProfile();
                setRole(profile.role);          // kept in case you need it later
            } catch (err) {
                console.error(t("errors.fetchRole"), err);
            }
        })();
    }, [t]);

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

    return (
        <div className="dashboard-wrapper">
            <div className="top-controls">
                <LanguageSelector />
                <ProfileButton />
            </div>

            <header className="dashboard-header">
                <img
                    src="/images/logo.png"
                    alt={t("logoAlt")}
                    className="dashboard-logo"
                />
            </header>

            <main className="dashboard-content">
                <div className="dashboard-buttons">
                    <button onClick={() => navigate("/upload")}>
                        {t("uploadScan")}
                    </button>
                    <button onClick={() => navigate("/result")}>
                        {t("myResults")}
                    </button>

                    {/* ▼▼ NEW: give About full row ▼▼ */}
                    <button
                        className="full-width"
                        onClick={() => navigate("/about")}
                    >
                        {t("aboutAneurysm")}
                    </button>

                    {/* ▼▼ NEW: hospital preview card ▼▼ */}
                    <div
                        className="hospital-card full-width"
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate("/find-hospital")}
                        onKeyDown={(e) =>
                            e.key === "Enter" && navigate("/find-hospital")
                        }
                    >
                        <span className="hospital-card-label">
                            <i className="fas fa-hospital-alt" />{" "}
                            {t("Find Nearby Hospitals")}
                        </span>

                        <MapContainer
                            center={[4.2, 102.0]}
                            zoom={5}
                            scrollWheelZoom={false}
                            doubleClickZoom={false}
                            dragging={false}
                            attributionControl={false}
                            zoomControl={false}
                            style={{
                                height: "200px",
                                width: "100%",
                                borderRadius: "12px",
                            }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[3.1201, 101.6544]} />
                            <Marker position={[5.4151, 100.3288]} />
                            <Marker position={[1.486, 103.7615]} />
                        </MapContainer>
                    </div>
                </div>

                {loading ? (
                    <div className="summary-loading">
                        <h3>{t("summary.title")}</h3>
                        <div className="loading-content">
                            <div className="loading-spinner" />
                            <p>{t("summary.loadingMessage")}</p>
                            <p className="loading-subtext">
                                {t("summary.loadingSubtext")}
                            </p>
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