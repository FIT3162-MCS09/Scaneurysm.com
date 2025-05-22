import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import predictionServices from "../services/predictionServices";
import SidebarPatient from "../components/SidebarPatient";
import ProfileButton from "../components/ProfileButton";
import "./Result.css";
import ShapQuadrantChart from "../components/ShapQuadrantChart";

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
                                                
                                                {/* Add relative importance scores */}
                                                <h4>{t('relativeImportance')}:</h4>
                                                <div className="relative-importance">
                                                    {Object.entries(result.shap_explanation.analysis.relative_importances).map(([key, value]) => (
                                                        <p key={key}>{key.replace('_', ' ')}: {(value as number).toFixed(3)}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Add SHAP analysis timing information */}
                                        {result.shap_explanation.metadata && (
                                            <div className="timing-info">
                                                <h4>{t('analysisDetails')}:</h4>
                                                <p>{t('startTime')}: {new Date(result.shap_explanation.metadata.start_time).toLocaleString()}</p>
                                                <p>{t('endTime')}: {new Date(result.shap_explanation.metadata.end_time).toLocaleString()}</p>
                                                <p>{t('duration')}: {result.shap_explanation.metadata.analysis_duration.toFixed(2)} seconds</p>
                                            </div>
                                        )}

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
                                <div className="metadata-grid">
                                    <div className="metadata-item">
                                        <label>{t('timestamp')}:</label>
                                        <p>{new Date(result.prediction.metadata.timestamp).toLocaleString()}</p>
                                    </div>
                                    <div className="metadata-item">
                                        <label>{t('pytorchVersion')}:</label>
                                        <p>{result.prediction.metadata.pytorch_version}</p>
                                    </div>
                                    <div className="metadata-item">
                                        <label>{t('user')}:</label>
                                        <p>{result.prediction.metadata.user}</p>
                                    </div>
                                    <div className="metadata-item">
                                        <label>{t('createdAt')}:</label>
                                        <p>{new Date(result.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
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
