import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import predictionServices from "../services/predictionServices";
import SidebarPatient from "../components/SidebarPatient";
import ProfileButton from "../components/ProfileButton";
import ResultCard from "../components/ResultCard";
import "./Result.css";
import { authService } from "../services/authServices";

const Result = () => {
    const { t } = useTranslation("result");
    const [results, setResults] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDoctor, setIsDoctor] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                // First check if user is a doctor
                const profile = await authService.fetchUserProfile();
                const userIsDoctor = profile.role === "doctor";
                setIsDoctor(userIsDoctor);

                if (userIsDoctor) {
                    // If doctor, fetch patients instead of results
                    const patientData = await predictionServices.getDoctorPatients();
                    console.log("Doctor patients:", patientData); // Debug log
                    setPatients(patientData);
                } else {
                    // If patient, fetch their results as before
                    const data = await predictionServices.getPredictionDetails();
                    setResults(Array.isArray(data) ? data : [data]);
                }
            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError(err.message || "Failed to get data");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handlePatientSelect = (patient: any) => {
        // Ensure we have a valid patient ID before navigating
        if (!patient || !patient.user_id) {
            console.error("Invalid patient data:", patient);
            setError("Invalid patient data");
            return;
        }
        
        console.log("Navigating to patient results:", patient.user_id);
        navigate(`/patient/results/${patient.user_id}/`);
    };

    if (error)
        return (
            <div className="error">
                <h2>{t('error')}</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/upload")}>{t('tryAgain')}</button>
            </div>
        );

    // Doctor view - show patients list
    if (isDoctor) {
        return (
            <div className="result-container">
                <ProfileButton />
                <SidebarPatient />

                <h1>My Patients</h1>
                <button
                    style={{ marginBottom: "20px" }}
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
                    <div className="result-card">
                        <p>No patients found linked to your account.</p>
                    </div>
                ) : (
                    <div className="patients-list">
                        {patients.map((patient) => (
                            <div key={patient.user_id} className="patient-card">
                                <h3>{patient.first_name} {patient.last_name}</h3>
                                <p>Email: {patient.email}</p>
                                <p>ID: {patient.user_id}</p>
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
        );
    }

    // Patient view - original results view
    return (
        <div className="result-container">
            <ProfileButton />
            <SidebarPatient />

            <h1>{t('title')}</h1>
            <button
                style={{ marginBottom: "20px" }}
                onClick={() => window.location.reload()}
            >
                {t('refresh')}
            </button>

            {loading ? (
                <div className="result-card loading">
                    <div className="spinner" />
                    <p>{t('analyzing')}</p>
                    <p>This may take a few minutes</p>
                </div>
            ) : results.length === 0 ? (
                <div className="result-card">
                    <p>{t('noResults')}</p>
                </div>
            ) : (
                results.map((result) => <ResultCard key={result.id} result={result} />)
            )}

            <button onClick={() => navigate("/upload")}>{t('analyzeAnother')}</button>
        </div>
    );
};

export default Result;
