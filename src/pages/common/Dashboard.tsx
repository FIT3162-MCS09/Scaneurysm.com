import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authService } from "../../services/authServices";
import predictionServices from "../../services/predictionServices";
import { PredictionResult } from "../../types/prediction";
import { DoctorPatient } from "../../types/doctor";
import "./Dashboard.css";

// Import components
import TopControls from "../../components/dashboard/TopControls";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import { PatientNavigationButtons, DoctorNavigationButtons } from "../../components/dashboard/NavigationButtons";
import ResultsSection from "../../components/dashboard/ResultsSection";
import DoctorPatientsSummary from "../../components/dashboard/DoctorPatientsSummary";
import Footer from "../../components/Footer";

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
