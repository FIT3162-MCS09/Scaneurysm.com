import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProfileButton from "../../components/ProfileButton";
import Sidebar from "../../components/Sidebar";
import ResultCard from "../../components/ResultCard";
import predictionServices from "../../services/predictionServices";
import "../patient/Result.css"; // Import Result.css first as base styles
import "./PatientResult.css"; // Import PatientResult.css second to override specific styles
import { searchPatientById } from "../../services/searchServices";

// Type definitions
interface PatientInfo {
  id?: string;
  user_id?: string;
  birth_date?: string;
  user: {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  sex?: string;
}

interface Patient {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface PredictionResult {
  id: string;
  prediction_date: string;
  prediction_result: string;
  model_name: string;
  confidence_score: number;
  [key: string]: any; // For any additional properties
}

// Loading indicator component
const LoadingIndicator: React.FC<{ message: string }> = ({ message }) => (
  <div className="result-card loading">
    <div className="spinner" />
    <p>{message}</p>
  </div>
);

// Error display component
const ErrorDisplay: React.FC<{ error: string; t: any; onBack: () => void }> = ({ error, t, onBack }) => (
  <div className="error">
    <h2>{t('error')}</h2>
    <p>{error}</p>
    <button onClick={onBack}>Back to Patients</button>
  </div>
);

// Patient Header component
const PatientHeader: React.FC<{ patientInfo: PatientInfo }> = ({ patientInfo }) => {
  const handlePatientCardClick = () => {
    console.log("Patient card clicked");
  };

  return (
    <div className="patient-card" onClick={handlePatientCardClick}>
      <div className="patient-avatar">
        {patientInfo.user.first_name?.charAt(0)}{patientInfo.user.last_name?.charAt(0)}
      </div>
      <div className="patient-details">
        <h1>{patientInfo.user.first_name} {patientInfo.user.last_name}</h1>
        <div className="patient-info-grid">
          <div className="info-item">
            <span className="label">Sex</span>
            <span className="value">{patientInfo.sex }</span>
          </div>
          <div className="info-item">
            <span className="label">Email</span>
            <span className="value">{patientInfo.user.email}</span>
          </div>
          {patientInfo.birth_date && (
            <div className="info-item">
              <span className="label">Date of Birth</span>
              <span className="value">{new Date(patientInfo.birth_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Patient Results component
const PatientResults: React.FC<{ results: PredictionResult[]; loading: boolean; t: any }> = ({ results, loading, t }) => {
  if (loading) {
    return <LoadingIndicator message="Loading patient results..." />;
  }

  if (results.length === 0) {
    return (
      <div className="result-card empty-results">
        <p>No results found for this patient.</p>
      </div>
    );
  }

  return (
    <div className="results-grid">
      {results.map((result) => <ResultCard key={result.id} result={result} />)}
    </div>
  );
};

// Patient Card component for doctor's view
const PatientCard: React.FC<{ patient: Patient; onSelect: (patient: Patient) => void }> = ({ patient, onSelect }) => (
  <div className="patient-card">
    <div className="patient-avatar">
      {patient.first_name?.charAt(0)}
      {patient.last_name?.charAt(0)}
    </div>
    <h3>{patient.first_name} {patient.last_name}</h3>
    <div className="patient-info">
      <div className="patient-info-row">
        <span>Email:</span>
        <span>{patient.email}</span>
      </div>
      <div className="patient-info-row">
        <span>ID:</span>
        <span>{patient.user_id}</span>
      </div>
    </div>
    <button 
      className="view-results-btn"
      onClick={() => onSelect(patient)}
    >
      View Patient Results
    </button>
  </div>
);

// Doctor's patients list view
const DoctorPatientList: React.FC<{ patients: Patient[]; loading: boolean; onSelectPatient: (patient: Patient) => void; t: any }> = 
  ({ patients, loading, onSelectPatient, t }) => {
  
  if (loading) {
    return <LoadingIndicator message="Loading patients..." />;
  }
  
  if (patients.length === 0) {
    return (
      <div className="result-card empty-results">
        <p>No patients found linked to your account.</p>
      </div>
    );
  }
  
  return (
    <div className="patients-list">
      {patients.map((patient) => (
        <PatientCard 
          key={patient.user_id} 
          patient={patient} 
          onSelect={onSelectPatient} 
        />
      ))}
    </div>
  );
};

// Main PatientResult component
const PatientResult: React.FC = () => {
  const { patientId } = useParams();
  const { t } = useTranslation("result");
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDoctor, setIsDoctor] = useState(false); // Example: replace with your actual logic
  const [patients, setPatients] = useState<Patient[]>([]); // Example: replace with your actual logic
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientResults = async () => {
      try {
        if (!patientId || patientId === "undefined") {
          throw new Error("No valid patient ID provided");
        }

        // Fetch patient info - using the correct endpoint for user info
        try {
          const patientResponse = await searchPatientById(patientId);
          setPatientInfo(patientResponse);
          console.log("Patient info loaded:", patientResponse);
        } catch (err) {
          console.error("Error fetching patient info:", err);
          throw new Error("Failed to get patient information");
        }
        
        // Fetch patient's results using the dedicated method
        try {
          const data = await predictionServices.getPatientPredictionDetails(patientId);
          console.log("Patient results:", data);
          // @ts-ignore
            setResults(Array.isArray(data) ? data : [data]);
        } catch (err) {
          console.error("Error fetching patient results:", err);
          throw new Error("Failed to get patient's results");
        }
      } catch (err: any) {
        setError(err.message || "Failed to get patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientResults();
  }, [patientId]);

  const handlePatientSelect = (patient: Patient) => {
    // Placeholder for patient selection logic
    console.log("Selected patient:", patient);
    // Navigate to the patient's results page
    navigate(`/patient/${patient.user_id}/results`);
  };

  if (error) {
    return <ErrorDisplay error={error} t={t} onBack={() => navigate("/result")} />;
  }

  if (isDoctor) {
    return (
      <div className="result-container">
        <ProfileButton />
        <Sidebar />

        <div className="content-area">
          <h1 className="doctor-patients-header">My Patients</h1>
          <button
            className="refresh-button"
            onClick={() => window.location.reload()}
          >
            {t('refresh')}
          </button>

          <DoctorPatientList 
            patients={patients} 
            loading={loading} 
            onSelectPatient={handlePatientSelect} 
            t={t} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <ProfileButton />
      <Sidebar />
      
      <div className="content-area">
        <button
          className="back-button"
          onClick={() => navigate("/result")}
        >
          ← Back to Patients List
        </button>

        {patientInfo && <PatientHeader patientInfo={patientInfo} />}

        <h2 className="results-heading">{t('patientResults')}</h2>

        <PatientResults 
          results={results} 
          loading={loading} 
          t={t} 
        />
      </div>
    </div>
  );
};

export default PatientResult;
