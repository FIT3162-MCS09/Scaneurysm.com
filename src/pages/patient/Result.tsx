import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import predictionServices from "../../services/predictionServices";
import SidebarPatient from "../../components/SidebarPatient";
import ProfileButton from "../../components/ProfileButton";
import ResultCard from "../../components/ResultCard";
import "./Result.css";
import { authService } from "../../services/authServices";

// Types
interface Patient {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

// Reusable component for page layout with common elements
const PageLayout: React.FC<{
  title: string;
  children: React.ReactNode;
  onRefresh: () => void;
  refreshText: string;
}> = ({ title, children, onRefresh, refreshText }) => (
  <div className="result-container">
    <ProfileButton />
    <SidebarPatient />
    <h1>{title}</h1>
    <button
      style={{ marginBottom: "20px" }}
      onClick={onRefresh}
    >
      {refreshText}
    </button>
    {children}
  </div>
);

// Loading indicator component
const LoadingIndicator: React.FC<{ primaryText: string; secondaryText?: string }> = ({ 
  primaryText, 
  secondaryText 
}) => (
  <div className="result-card loading">
    <div className="spinner" />
    <p>{primaryText}</p>
    {secondaryText && <p>{secondaryText}</p>}
  </div>
);

// Error display component
const ErrorDisplay: React.FC<{
  message: string;
  buttonText: string;
  onButtonClick: () => void;
  title: string;
}> = ({ message, buttonText, onButtonClick, title }) => (
  <div className="error">
    <h2>{title}</h2>
    <p>{message}</p>
    <button onClick={onButtonClick}>{buttonText}</button>
  </div>
);

// Patient card component for doctor view
const PatientCard: React.FC<{
  patient: Patient;
  onSelect: (patient: Patient) => void;
}> = ({ patient, onSelect }) => (
  <div className="patient-card">
    <h3>{patient.first_name} {patient.last_name}</h3>
    <p>Email: {patient.email}</p>
    <p>ID: {patient.user_id}</p>
    <button 
      className="view-results-btn"
      onClick={() => onSelect(patient)}
    >
      View Patient Results
    </button>
  </div>
);

// Doctor's view component
const DoctorView: React.FC<{
  patients: Patient[];
  loading: boolean;
  onPatientSelect: (patient: Patient) => void;
  t: any;
}> = ({ patients, loading, onPatientSelect, t }) => (
  <PageLayout 
    title="My Patients" 
    onRefresh={() => window.location.reload()}
    refreshText={t('refresh')}
  >
    {loading ? (
      <LoadingIndicator primaryText="Loading patients..." />
    ) : patients.length === 0 ? (
      <div className="result-card">
        <p>No patients found linked to your account.</p>
      </div>
    ) : (
      <div className="patients-list">
        {patients.map((patient) => (
          <PatientCard 
            key={patient.user_id} 
            patient={patient} 
            onSelect={onPatientSelect} 
          />
        ))}
      </div>
    )}
  </PageLayout>
);

// Patient's view component
const PatientView: React.FC<{
  results: any[];
  loading: boolean;
  t: any;
  onAnalyzeAnother: () => void;
}> = ({ results, loading, t, onAnalyzeAnother }) => (
  <PageLayout 
    title={t('title')} 
    onRefresh={() => window.location.reload()}
    refreshText={t('refresh')}
  >
    {loading ? (
      <LoadingIndicator 
        primaryText={t('analyzing')} 
        secondaryText="This may take a few minutes" 
      />
    ) : results.length === 0 ? (
      <div className="result-card">
        <p>{t('noResults')}</p>
      </div>
    ) : (
      results.map((result) => (
        <ResultCard key={result.id} result={result} />
      ))
    )}
    <button onClick={onAnalyzeAnother}>{t('analyzeAnother')}</button>
  </PageLayout>
);

// Main container component
const Result: React.FC = () => {
  const { t } = useTranslation("result");
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);

  const fetchUserData = async () => {
    try {
      // Check if user is a doctor
      const profile = await authService.fetchUserProfile();
      const userIsDoctor = profile.role === "doctor";
      setIsDoctor(userIsDoctor);

      if (userIsDoctor) {
        // If doctor, fetch patients list
        const patientData = await predictionServices.getDoctorPatients();
        setPatients(patientData);
      } else {
        // If patient, fetch their results
        const data = await predictionServices.getPredictionDetails();
        setResults(Array.isArray(data) ? data : [data]);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to get data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    if (!patient?.user_id) {
      console.error("Invalid patient data:", patient);
      setError("Invalid patient data");
      return;
    }
    navigate(`/patient/results/${patient.user_id}/`);
  };

  if (error) {
    return (
      <ErrorDisplay
        title={t('error')}
        message={error}
        buttonText={t('tryAgain')}
        onButtonClick={() => navigate("/upload")}
      />
    );
  }

  return isDoctor ? (
    <DoctorView
      patients={patients}
      loading={loading}
      onPatientSelect={handlePatientSelect}
      t={t}
    />
  ) : (
    <PatientView
      results={results}
      loading={loading}
      t={t}
      onAnalyzeAnother={() => navigate("/upload")}
    />
  );
};

export default Result;
