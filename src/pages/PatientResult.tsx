import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProfileButton from "../components/ProfileButton";
import SidebarPatient from "../components/SidebarPatient";
import ResultCard from "../components/ResultCard";
import predictionServices from "../services/predictionServices";
import "./Result.css"; // Import Result.css first as base styles
import "./PatientResult.css"; // Import PatientResult.css second to override specific styles
import { searchPatientById } from "../services/searchServices";

const PatientResult = () => {
    const { patientId } = useParams();
    const { t } = useTranslation("result");
    const [results, setResults] = useState<any[]>([]);
    const [patientInfo, setPatientInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDoctor, setIsDoctor] = useState(false); // Example: replace with your actual logic
    const [patients, setPatients] = useState<any[]>([]); // Example: replace with your actual logic
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

    const handlePatientCardClick = () => {
        // Placeholder for card click action
        // Could navigate to more detailed patient view or toggle expanded view
        console.log("Patient card clicked");
    };

    const handlePatientSelect = (patient: any) => {
        // Placeholder for patient selection logic
        console.log("Selected patient:", patient);
    };

    if (isDoctor) {
        return (
            <div className="result-container">
                <ProfileButton />
                <SidebarPatient />

                <div className="content-area">
                    <h1 className="doctor-patients-header">My Patients</h1>
                    <button
                        className="refresh-button"
                        onClick={() => window.location.reload()}
                    >
                        {t('refresh')}
                    </button>

                    {loading ? (
                        <div className="result-card loading">
                            <div className="spinner" />
                            <p>Loading patients...</p>
                        </div>
                    ) : patients.length === 0 ? (
                        <div className="result-card empty-results">
                            <p>No patients found linked to your account.</p>
                        </div>
                    ) : (
                        <div className="patients-list">
                            {patients.map((patient) => (
                                <div key={patient.user_id} className="patient-card">
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
                                        onClick={() => handlePatientSelect(patient)}
                                    >
                                        View Patient Results
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <h2>{t('error')}</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/result")}>Back to Patients</button>
            </div>
        );
    }

    return (
        <div className="result-container">
            <ProfileButton />
            <SidebarPatient />
            
            <div className="content-area">
                <button
                    className="back-button"
                    onClick={() => navigate("/result")}
                >
                    ← Back to Patients List
                </button>

                {patientInfo && (
                    <div className="patient-card" onClick={handlePatientCardClick}>
                        <div className="patient-avatar">
                            {patientInfo.user.first_name?.charAt(0)}{patientInfo.user.last_name?.charAt(0)}
                        </div>
                        <div className="patient-details">
                            <h1>{patientInfo.user.first_name} {patientInfo.user.last_name}</h1>
                            <div className="patient-info-grid">
                                <div className="info-item">
                                    <span className="label">Patient ID</span>
                                    <span className="value">{patientInfo.user_id || patientInfo.user.id || patientInfo.id}</span>
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
                                {/*{patientInfo.phone && (*/}
                                {/*    <div className="info-item">*/}
                                {/*        <span className="label">Phone</span>*/}
                                {/*        <span className="value">{patientInfo.phone}</span>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                            </div>
                        </div>
                    </div>
                )}

                <h2 className="results-heading">{t('patientResults')}</h2>

                {loading ? (
                    <div className="result-card loading">
                        <div className="spinner" />
                        <p>Loading patient results...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="result-card empty-results">
                        <p>No results found for this patient.</p>
                    </div>
                ) : (
                    <div className="results-grid">
                        {results.map((result) => <ResultCard key={result.id} result={result} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientResult;
