import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import predictionServices from "../services/predictionServices";
import SidebarPatient from "../components/SidebarPatient";
import ProfileButton from "../components/ProfileButton";
import "./Result.css";

const Result = () => {
    const { t } = useTranslation("result");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const data = await predictionServices.getPredictionDetails();
                // @ts-ignore
                setResults(data);
            } catch (err: any) {
                setError(err.message || "Failed to get results");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (error)
        return (
            <div className="error">
                <h2>{t('error')}</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/upload")}>{t('tryAgain')}</button>
            </div>
        );

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
                results.map((result) => (
                    <div key={result.id} className="result-card">
                        <h2>Result ID: {result.id}</h2>

                        <div className="prediction-section">
                            <h3>{t('aiPrediction')}</h3>
                            <div className="prediction-card">
                                <p className={result.prediction?.prediction === "aneurysm" ? "positive" : "negative"}>
                                    {result.prediction?.prediction === "aneurysm" ? t('aneurysmDetected') : t('noAneurysm')}
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

                        {result.explanation && (
                            <div className="explanation-section">
                                <h3>{t('aiExplanation')}</h3>
                                {result.explanation.status === "processing" ? (
                                    <p>{t('shapProcessing')}</p>
                                ) : (
                                    <div className="shap-visualization">
                                        <h4>{t('quadrantScores')}:</h4>
                                        <ul>
                                            {Object.entries(result.explanation.quadrant_scores).map(([k, v]) => (
                                                <li key={k}>{`${k}: ${v}`}</li>
                                            ))}
                                        </ul>
                                        <h4>{t('stabilityScore')}:</h4>
                                        <p>{result.explanation.stability_score}</p>
                                        <h4>{t('importanceScore')}:</h4>
                                        <p>{result.explanation.importance_score}</p>
                                        <h4>{t('mostImportantQuadrant')}:</h4>
                                        <p>{result.explanation.most_important_quadrant}</p>
                                        {result.explanation.visualization?.url && (
                                            <div>
                                                <h4>{t('visualization')}:</h4>
                                                <img
                                                    className="visualization-image"
                                                    src={result.explanation.visualization.url}
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

            <button onClick={() => navigate("/upload")}>{t('analyzeAnother')}</button>
        </div>
    );
};

export default Result;