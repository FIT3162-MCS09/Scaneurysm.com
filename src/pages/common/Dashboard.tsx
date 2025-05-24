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

/* ──────────────── Leaflet preview imports ──────────────── */
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

// Top controls component containing language selector and profile button
const TopControls: React.FC = () => (
  <div className="top-controls">
    <LanguageSelector />
    <ProfileButton />
  </div>
);

// Header component with logo
const DashboardHeader: React.FC<{ logoAlt: string }> = ({ logoAlt }) => (
  <header className="dashboard-header">
    <img
      src="/images/logo.png"
      alt={logoAlt}
      className="dashboard-logo"
    />
  </header>
);

// Patient navigation buttons component
const PatientNavigationButtons: React.FC<{
  t: any;
  navigate: (path: string) => void;
}> = ({ t, navigate }) => (
  <div className="dashboard-buttons">
    <button onClick={() => navigate("/upload")}>
      {t("uploadScan")}
    </button>
    <button onClick={() => navigate("/result")}>
      {t("myResults")}
    </button>
    <button
      className="full-width"
      onClick={() => navigate("/about")}
    >
      {t("aboutAneurysm")}
    </button>
    <HospitalPreviewCard t={t} navigate={navigate} />
  </div>
);

// Doctor navigation buttons component
const DoctorNavigationButtons: React.FC<{
  t: any;
  navigate: (path: string) => void;
}> = ({ t, navigate }) => (
  <div className="dashboard-buttons">
    <button onClick={() => navigate("/result")}>
      {t("doctorWelcome.myPatients") || "My Patients"}
    </button>
    <HospitalPreviewCard t={t} navigate={navigate} />
  </div>
);

// Hospital preview card with map
const HospitalPreviewCard: React.FC<{
  t: any;
  navigate: (path: string) => void;
}> = ({ t, navigate }) => (
  <div
    className="hospital-card full-width"
    role="button"
    tabIndex={0}
    onClick={() => navigate("/find-hospital")}
    onKeyDown={(e) => e.key === "Enter" && navigate("/find-hospital")}
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
);

// Loading state component for results summary
const LoadingSummary: React.FC<{ t: any }> = ({ t }) => (
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
);

// Error state component for results summary
const ErrorSummary: React.FC<{ t: any; error: string }> = ({ t, error }) => (
  <div className="summary-error">
    <h3>{t("summary.title")}</h3>
    <p>{error}</p>
  </div>
);

// Empty state component for results summary
const EmptySummary: React.FC<{ t: any }> = ({ t }) => (
  <div className="summary-empty">
    <h3>{t("summary.title")}</h3>
    <p>{t("summary.noResults")}</p>
  </div>
);

// Results section component
const ResultsSection: React.FC<{
  loading: boolean;
  error: string;
  results: PredictionResult[];
  t: any;
}> = ({ loading, error, results, t }) => {
  if (loading) return <LoadingSummary t={t} />;
  if (error) return <ErrorSummary t={t} error={error} />;
  if (results.length > 0) {
    return (
      <ResultSummary
        latestResult={results[0]}
        totalScans={results.length}
        recentResults={results.slice(0, 5)}
      />
    );
  }
  return <EmptySummary t={t} />;
};

// Doctor welcome message component
const DoctorWelcome: React.FC<{ t: any }> = ({ t }) => (
  <div className="doctor-welcome-section">
    <h3>{t("doctorWelcome.title") || "Welcome, Doctor"}</h3>
    <p>{t("doctorWelcome.description") || "Use the buttons above to view patient data and locate nearby hospitals."}</p>
  </div>
);

// Main Dashboard component
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const { t } = useTranslation("dashboard");
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Fetching user profile...");
        // Fetch user profile first to determine role
        const profile = await authService.fetchUserProfile();
        console.log("User profile received:", profile);
        setRole(profile.role);
        
        // Only fetch prediction data for patients
        if (profile.role !== "doctor") {
          console.log("Patient role detected, fetching prediction data...");
          const predictionData = await predictionServices.getPredictionDetails();
          if (Array.isArray(predictionData)) {
            console.log("Prediction data received:", predictionData.length, "items");
            setResults(predictionData);
          } else {
            console.error("Invalid prediction data format:", predictionData);
            throw new Error("Invalid prediction data format");
          }
        } else {
          console.log("Doctor role detected, skipping prediction data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(t("errors.fetchData") || "Failed to fetch data");
      } finally {
        // Always set loading to false when done, regardless of success or failure
        console.log("Setting loading state to false");
        setLoading(false);
      }
    };

    // Check if we have a fallback for missing user profile
    const checkUserInfo = () => {
      try {
        const userInfoStr = localStorage.getItem("user_info");
        if (!userInfoStr) {
          console.warn("No user_info found in localStorage");
          setError("User information is missing. Please log in again.");
          setLoading(false);
          return false;
        }
        return true;
      } catch (e) {
        console.error("Error accessing localStorage:", e);
        setError("Could not access user data. Please log in again.");
        setLoading(false);
        return false;
      }
    };

    if (checkUserInfo()) {
      fetchDashboardData();
    }
  }, [t]);

  return (
    <div className="dashboard-wrapper">
      <TopControls />
      <DashboardHeader logoAlt={t("logoAlt")} />

      <main className="dashboard-content">
        {role === "doctor" ? (
          <>
            <DoctorNavigationButtons t={t} navigate={navigate} />
            <DoctorWelcome t={t} />
          </>
        ) : (
          <>
            <PatientNavigationButtons t={t} navigate={navigate} />
            <ResultsSection 
              loading={loading} 
              error={error} 
              results={results} 
              t={t} 
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

