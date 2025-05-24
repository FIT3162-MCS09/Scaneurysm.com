import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../services/apiClient";
import ProfileButton from "../components/ProfileButton";
import SidebarPatient from "../components/SidebarPatient";
import ShapQuadrantChart from "../components/ShapQuadrantChart";
import predictionServices from "../services/predictionServices";
import "./Result.css";
import {searchPatientById} from "../services/searchServices";

const PatientResult = () => {
    const { patientId } = useParams();
    const { t } = useTranslation("result");
    const [results, setResults] = useState<any[]>([]);
    const [patientInfo, setPatientInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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

            {patientInfo && (
                <div className="patient-header">
                    <h1>Results for {patientInfo.first_name} {patientInfo.last_name}</h1>
                    <p>Patient ID: {patientInfo.id}</p>
                    <p>Email: {patientInfo.email}</p>
                </div>
            )}
            
            <button
                style={{ marginBottom: "20px" }}
                onClick={() => navigate("/result")}
            >
                Back to Patients List
            </button>

            {loading ? (
                <div className="result-card loading">
                    <div className="spinner" />
                    <p>Loading patient results...</p>
                </div>
            ) : results.length === 0 ? (
                <div className="result-card">
                    <p>No results found for this patient.</p>
                </div>
            ) : (
                results.map((result) => (
                    <div key={result.id} className="result-card">
                        <h2>Result ID: {result.id}</h2>

                        <div className="prediction-section">
                            <h3>{t('aiPrediction')}</h3>
                            <div className="prediction-card">
                                <p className={result.prediction?.prediction === "Aneurysm" ? "positive" : "negative"}>
                                    {result.prediction?.prediction === "Aneurysm" ? t('aneurysmDetected') : t('noAneurysm')}
                                </p>
                                {result.prediction?.confidence && (
                                    <p>{t('confidence')}: {(result.prediction.confidence * 100).toFixed(1)}%</p>
                                )}
                                {result.prediction?.probabilities && (
                                    <div>
                                        <p>{t('aneurysmProbability')}: {(result.prediction.probabilities.aneurysm * 100).toFixed(1)}%</p>
                                        <p>{t('nonAneurysmProbability')}: {(result.prediction.probabilities.non_aneurysm * 100).toFixed(1)}%</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {result.shap_explanation && (
                            <div className="explanation-section">
                                <h3>{t('aiExplanation')}</h3>
                                {result.shap_explanation.status === "processing" ? (
                                    <p>{t('shapProcessing')}</p>
                                ) : (
                                    <div className="shap-visualization">
                                        <div className="visualization-container">
                                            <div className="chart-container">
                                                <h4>{t('quadrantAnalysis')}</h4>
                                                <ShapQuadrantChart result={result} />
                                            </div>
                                            <div className="scores-container">
                                                <h4>{t('stabilityScore')}:</h4>
                                                <p>{result.shap_explanation.analysis.stability_score.toFixed(3)}</p>
                                                <h4>{t('importanceScore')}:</h4>
                                                <p>{result.shap_explanation.analysis.importance_score.toFixed(6)}</p>
                                                <h4>{t('mostImportantQuadrant')}:</h4>
                                                <p>{result.shap_explanation.analysis.most_important_quadrant}</p>
                                            </div>
                                        </div>
                                        {result.shap_explanation.visualization?.url && (
                                            <div className="shap-image">
                                                <h4>{t('visualization')}:</h4>
                                                <img
                                                    className="visualization-image"
                                                    src={result.shap_explanation.visualization.url}
                                                    alt="SHAP Analysis Visualization"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {result.prediction?.metadata && (
                            <div className="metadata-section">
                                <h3>{t('metadata')}</h3>
                                <p>{t('timestamp')}: {result.prediction.metadata.timestamp}</p>
                                <p>{t('pytorchVersion')}: {result.prediction.metadata.pytorch_version}</p>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default PatientResult;
