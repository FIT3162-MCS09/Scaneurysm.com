import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import predictionServices from "../../services/predictionServices";
import Sidebar from "../../components/Sidebar";
import ProfileButton from "../../components/ProfileButton";
import ResultCard from "../../components/ResultCard";
import "./Result.css";
import { authService } from "../../services/authServices";
import genAiService from "../../services/genAiServices";
import ReactMarkdown from 'react-markdown';


// Types
interface Patient {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AIReport {
  generated_insight: string;
  model_used: string;
  source: string;
  metadata: {
    timestamp: string;
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
  already_exists: boolean;
}

// Reusable component for page layout with common elements
const PageLayout: React.FC<{
  title: string;
  children: React.ReactNode;
  onRefresh: () => void;
  refreshText: string;
}> = ({ title, children, onRefresh, refreshText }) => (
  <div className="result-container">
    {/*TODO: Not working yet in results page*/}
    {/*<ProfileButton />*/}
    <Sidebar />
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
  <div className="patient-card" onClick={() => onSelect(patient)}>
    {/*<div className="patient-avatar">*/}
    {/*  {patient.first_name[0]}{patient.last_name[0]}*/}
    {/*</div>*/}
    <div className="patient-info">
      <h3>{patient.first_name} {patient.last_name}</h3>
      <p className="patient-email">{patient.email}</p>
      <p className="patient-id">Patient ID: {patient.user_id}</p>
    </div>
    <div className="patient-actions">
      <button 
        className="view-results-btn"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(patient);
        }}
      >
        View Results
      </button>
    </div>
  </div>
);

// AI Report component
const AiReportCard: React.FC<{ aiReport: AIReport | null; loading: boolean }> = ({ aiReport, loading }) => {
  if (loading) {
    return <LoadingIndicator primaryText="Loading AI report..." />;
  }

  if (!aiReport) {
    return (
        <div className="result-card">
          <h3>AI Analysis</h3>
          <p>No AI analysis available for this scan.</p>
        </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
      return dateString;
    }
  };

  return (
      <div className="result-card ai-report">
        <div className="ai-report-header">
          <h3>AI-Assisted Analysis <span className="latest-scan-badge">Latest Scan Only</span></h3>
          <div className="ai-model-info">
            {/*<span className="model-name">Model: {aiReport.model_used}</span>*/}
            <span className="report-time">Generated: {formatDate(aiReport.metadata.timestamp)}</span>
          </div>
          <p className="analysis-scope-note">This analysis pertains only to the most recent scan results.</p>
        </div>

        <div className="ai-report-content">
          <ReactMarkdown>
            {aiReport.generated_insight}
          </ReactMarkdown>
        </div>

        <div className="ai-report-footer">
          <p className="token-info">Analysis tokens: {aiReport.metadata.completion_tokens}</p>
        </div>
      </div>
  );
};

// Doctor's view component
const DoctorView: React.FC<{
  patients: Patient[];
  loading: boolean;
  onPatientSelect: (patient: Patient) => void;
  t: any;
}> = ({ patients, loading, onPatientSelect, t }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredPatients = patients.filter(patient => 
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout 
      title="My Patients" 
      onRefresh={() => window.location.reload()}
      refreshText={t('refresh')}
    >
      {loading ? (
        <LoadingIndicator primaryText="Loading patients..." />
      ) : patients.length === 0 ? (
        <div className="result-card empty-state">
          <div className="empty-icon">👤</div>
          <h3>No patients found</h3>
          <p>There are no patients linked to your account yet.</p>
        </div>
      ) : (
        <div className="doctor-dashboard">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search patients by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="patient-search"
            />
            <div className="patient-count">
              {filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'} found
            </div>
          </div>
          {filteredPatients.length === 0 ? (
            <div className="result-card empty-state">
              <p>No patients match your search criteria.</p>
            </div>
          ) : (
            <div className="patients-grid">
              {filteredPatients.map((patient) => (
                <PatientCard 
                  key={patient.user_id} 
                  patient={patient} 
                  onSelect={onPatientSelect} 
                />
              ))}
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
};

// Patient's view component
const PatientView: React.FC<{
  results: any[];
  loading: boolean;
  t: any;
  onAnalyzeAnother: () => void;
}> = ({ results, loading, t, onAnalyzeAnother }) => {
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [aiReportLoading, setAiReportLoading] = useState(false);

  useEffect(() => {
    const fetchAiReport = async () => {
      // Only fetch AI report if we have results
      if (results.length > 0) {
        setAiReportLoading(true);
        try {
          const report = await genAiService.getLatestGeneratedAiReport();
          setAiReport(report);
        } catch (error) {
          console.error("Failed to fetch AI report:", error);
          setAiReport(null);
        } finally {
          setAiReportLoading(false);
        }
      }
    };

    fetchAiReport();
  }, [results]);

  return (
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
        <>
          <div className="main-content-wrapper">
            {/* AI Report Card - Now outside of results-container */}
            <div className="ai-report-column">
              <AiReportCard aiReport={aiReport} loading={aiReportLoading} />
            </div>
            
            {/* Regular Results */}
            <div className="results-container">
              {results.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          </div>
          <button 
            className="analyze-another-btn" 
            onClick={onAnalyzeAnother}
          >
            {t('analyzeAnother')}
          </button>
        </>
      )}
    </PageLayout>
  );
};

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
