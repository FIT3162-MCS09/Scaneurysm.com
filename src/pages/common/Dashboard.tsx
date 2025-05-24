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

// Doctor patient interface
interface DoctorPatient {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  dateOfBirth?: string;
  lastVisit?: string;
  medicalRecordNumber?: string;
  latestPrediction?: {
    result: string;
    confidence: number;
  };
}

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

// Doctor's patients summary component
const DoctorPatientsSummary: React.FC<{
  patients: DoctorPatient[];
  loading: boolean;
  error: string;
  t: any;
  navigate: (path: string) => void;
}> = ({ patients, loading, error, t, navigate }) => {
  const [patientPredictions, setPatientPredictions] = useState<Record<string, any>>({});
  const [predictionLoading, setPredictionLoading] = useState(true);

  // Fetch latest prediction for each patient
  useEffect(() => {
    const fetchPatientPredictions = async () => {
      if (!patients.length) return;

      setPredictionLoading(true);
      const predictions: Record<string, any> = {};

      try {
        // Process patients in batches to avoid too many simultaneous requests
        const batchSize = 3;
        for (let i = 0; i < patients.length; i += batchSize) {
          const batch = patients.slice(i, i + batchSize);

          // Fetch predictions for this batch in parallel
          const batchResults = await Promise.all(
            batch.map(async (patient) => {
              try {
                const result = await predictionServices.getPatientPredictionDetails(patient.user_id);
                if (Array.isArray(result) && result.length > 0) {
                  // Get the latest prediction
                  const latestResult = result[0];
                  return {
                    patientId: patient.user_id,
                    prediction: latestResult.prediction?.prediction || "unknown",
                    confidence: latestResult.prediction?.confidence || 0,
                  };
                }
                return { patientId: patient.user_id, prediction: "none", confidence: 0 };
              } catch (error) {
                console.error(`Error fetching prediction for patient ${patient.user_id}:`, error);
                return { patientId: patient.user_id, prediction: "error", confidence: 0 };
              }
            })
          );

          // Add batch results to predictions object
          batchResults.forEach((result) => {
            predictions[result.patientId] = {
              prediction: result.prediction,
              confidence: result.confidence,
            };
          });
        }

        setPatientPredictions(predictions);
      } catch (err) {
        console.error("Error fetching patient predictions:", err);
      } finally {
        setPredictionLoading(false);
      }
    };

    fetchPatientPredictions();
  }, [patients]);

  if (loading) {
    return (
      <div className="doctor-patients-summary loading">
        <h3>{t("doctorPatients.title") || "My Patients"}</h3>
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>{t("doctorPatients.loading") || "Loading patient data..."}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-patients-summary error">
        <h3>{t("doctorPatients.title") || "My Patients"}</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="doctor-patients-summary empty">
        <h3>{t("doctorPatients.title") || "My Patients"}</h3>
        <p>{t("doctorPatients.noPatients") || "You have no patients assigned yet."}</p>
      </div>
    );
  }

  // Count aneurysm vs non-aneurysm cases
    // Fix the countResults function
    const countResults = () => {
        const counts = {
            aneurysm: 0,
            non_aneurysm: 0,
            unknown: 0,
        };

        Object.values(patientPredictions).forEach((prediction) => {
            if (prediction.prediction === "aneurysm" || prediction.prediction === "Aneurysm") {
                counts.aneurysm++;
            } else if (prediction.prediction === "non_aneurysm" || prediction.prediction === "Non-aneurysm") {
                counts.non_aneurysm++;
            } else {
                counts.unknown++;
            }
        });

        return counts;
    };

  const resultCounts = countResults();

  const handleViewPatient = (patientId: string) => {
    navigate(`/result?patientId=${patientId}`);
  };

  const getPredictionColor = (prediction: string) => {
    if (prediction === "aneurysm") return "#e74c3c"; // Red for aneurysm
    if (prediction === "non_aneurysm") return "#2ecc71"; // Green for non-aneurysm
    return "#95a5a6"; // Gray for unknown
  };

  return (
    <div className="doctor-patients-summary">
      <div className="patients-header">
        <h3>{t("doctorPatients.title") || "My Patients"}</h3>
        <div className="patient-stats">
          <div className="stat-item">
            <span className="stat-number">{patients.length}</span>
            <span className="stat-label">{t("doctorPatients.totalPatients") || "Total Patients"}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ color: "#e74c3c" }}>
              {resultCounts.aneurysm}
            </span>
            <span className="stat-label">{t("doctorPatients.aneurysmCases") || "Aneurysm Cases"}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ color: "#2ecc71" }}>
              {resultCounts.non_aneurysm}
            </span>
            <span className="stat-label">{t("doctorPatients.nonAneurysmCases") || "Non-Aneurysm Cases"}</span>
          </div>
        </div>
      </div>

      {/*<div className="patients-chart">*/}
      {/*  <h4>{t("doctorPatients.patientDistribution") || "Patient Diagnosis Distribution"}</h4>*/}
      {/*  <div className="chart-container">*/}
      {/*    {predictionLoading ? (*/}
      {/*      <div className="chart-loading">*/}
      {/*        <div className="loading-spinner" />*/}
      {/*        <p>{t("doctorPatients.loadingPredictions") || "Loading patient diagnoses..."}</p>*/}
      {/*      </div>*/}
      {/*    ) : (*/}
      {/*      <div className="bar-chart">*/}
      {/*        {patients.map((patient) => {*/}
      {/*          const prediction = patientPredictions[patient.user_id] || { prediction: "unknown", confidence: 0 };*/}
      {/*          return (*/}
      {/*            <div*/}
      {/*              key={patient.user_id}*/}
      {/*              className="bar-item"*/}
      {/*              style={{*/}
      {/*                height: `${Math.max(30, Math.min(100, 40 + prediction.confidence * 60))}px`,*/}
      {/*                backgroundColor: getPredictionColor(prediction.prediction),*/}
      {/*              }}*/}
      {/*              onClick={() => handleViewPatient(patient.user_id)}*/}
      {/*            >*/}
      {/*              <span className="bar-label">*/}
      {/*                {patient.first_name.charAt(0)}*/}
      {/*                {patient.last_name.charAt(0)}*/}
      {/*              </span>*/}
      {/*            </div>*/}
      {/*          );*/}
      {/*        })}*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="recent-patients">
        <h4>{t("doctorPatients.recentPatients") || "Recent Patients"}</h4>

        <table className="patients-table">
          <thead>
            <tr>
              <th>{t("doctorPatients.name") || "Name"}</th>
              <th>{t("doctorPatients.email") || "Email"}</th>
              <th>{t("doctorPatients.diagnosis") || "Diagnosis"}</th>
              <th>{t("doctorPatients.actions") || "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {patients.slice(0, 5).map((patient) => {
              const prediction = patientPredictions[patient.user_id] || { prediction: "unknown", confidence: 0 };
              console.log(prediction);
              return (
                <tr key={patient.user_id}>
                  <td>{`${patient.first_name} ${patient.last_name}`}</td>
                  <td>{patient.email}</td>
                  <td>
                    <span className={`diagnosis-badge ${prediction.prediction}`}>
                      {prediction.prediction === "aneurysm" || prediction.prediction === "Aneurysm"
                          ? t("prediction.aneurysm") || "Aneurysm"
                          : prediction.prediction === "non_aneurysm" || prediction.prediction === "Non-aneurysm"
                              ? t("prediction.nonAneurysm") || "No Aneurysm"
                              : t("prediction.unknown") || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-patient-btn"
                      onClick={() => handleViewPatient(patient.user_id)}
                    >
                      {t("doctorPatients.viewResults") || "View Results"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Dashboard component
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const { t } = useTranslation("dashboard");
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Doctor patients state
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Fetching user profile...");
        // Fetch user profile first to determine role
        const profile = await authService.fetchUserProfile();
        console.log("User profile received:", profile);
        setRole(profile.role);

        if (profile.role === "doctor") {
          // Fetch doctor's patients
          setPatientsLoading(true);
          try {
            console.log("Fetching doctor's patients...");
            const doctorPatients = await predictionServices.getDoctorPatients();
            console.log("Doctor patients received:", doctorPatients);
            setPatients(doctorPatients);
          } catch (err) {
            console.error("Error fetching doctor's patients:", err);
            setPatientsError(t("doctorPatients.error") || "Failed to load patient data");
          } finally {
            setPatientsLoading(false);
          }
        } else {
          // Only fetch prediction data for patients
          console.log("Patient role detected, fetching prediction data...");
          const predictionData = await predictionServices.getPredictionDetails();
          if (Array.isArray(predictionData)) {
            console.log("Prediction data received:", predictionData.length, "items");
            setResults(predictionData);
          } else {
            console.error("Invalid prediction data format:", predictionData);
            throw new Error("Invalid prediction data format");
          }
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
            <DoctorPatientsSummary
              patients={patients}
              loading={patientsLoading}
              error={patientsError}
              t={t}
              navigate={navigate}
            />
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
