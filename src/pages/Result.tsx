import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import predictionServices from "../services/predictionServices";
import SidebarPatient from "../components/SidebarPatient";
import ProfileButton from "../components/ProfileButton";
import "./Result.css";
import ShapQuadrantChart from "../components/ShapQuadrantChart";
import { PredictionResult as ShapPredictionResult } from "../types/prediction";

// Update interface to match the PredictionDetailsResponse from service
interface PredictionResult {
  id: number;
  user: string;
  image_url: string;
  created_at: string;
  prediction?: {
    metadata?: {
      user: string;
      timestamp: string;
      pytorch_version: string;
    };
    confidence?: number;
    prediction?: string;
    probabilities?: {
      aneurysm: number;
      non_aneurysm: number;
    };
  };
  shap_explanation?: {
    status: string;
    analysis?: {
      stability_score: number;
      importance_score: number;
      most_important_quadrant: string;
      relative_importances: Record<string, number>;
    };
    metadata?: {
      start_time: string;
      end_time: string;
      analysis_duration: number;
    };
    visualization?: {
      url: string;
    };
  };
}

const Result = () => {
    const { t } = useTranslation("result");
    const [results, setResults] = useState<PredictionResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await predictionServices.getPredictionDetails();
                // Handle different response formats and type cast to match our interface
                const data = Array.isArray(response) ? response as PredictionResult[] : [response as PredictionResult];
                setResults(data);
                // Set the latest result as expanded initially
                if (data && data.length > 0) {
                    setExpandedId(data[0].id);
                }
            } catch (err: any) {
                setError(err.message || "Failed to get results");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleCardClick = (id: number) => {
        setExpandedId(id);
    };

    // Get expanded result
    const expandedResult = results.find(result => result.id === expandedId);
    
    // Get collapsed results
    const collapsedResults = results.filter(result => result.id !== expandedId);

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
                <div className="results-layout">
                    <div className="collapsed-cards">
                        {collapsedResults.map((result) => (
                            <div 
                                key={result.id} 
                                className="result-card collapsed"
                                onClick={() => handleCardClick(result.id)}
                            >
                                <h2>Result ID: {result.id}</h2>
                                
                                <div className="prediction-summary">
                                    <p className={result.prediction?.prediction === "Aneurysm" ? "positive" : "negative"}>
                                        {result.prediction?.prediction === "Aneurysm" ? t('aneurysmDetected') : t('noAneurysm')}
                                    </p>
                                    {result.prediction?.confidence && (
                                        <p>{t('confidence')}: {(result.prediction.confidence * 100).toFixed(1)}%</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {expandedResult && (
                        <div className="expanded-card-container">
                            <div className="result-card expanded">
                                <h2>Result ID: {expandedResult.id}</h2>
                                
                                <div className="prediction-summary">
                                    <p className={expandedResult.prediction?.prediction === "Aneurysm" ? "positive" : "negative"}>
                                        {expandedResult.prediction?.prediction === "Aneurysm" ? t('aneurysmDetected') : t('noAneurysm')}
                                    </p>
                                    {expandedResult.prediction?.confidence && (
                                        <p>{t('confidence')}: {(expandedResult.prediction.confidence * 100).toFixed(1)}%</p>
                                    )}
                                </div>

                                <div className="expanded-content">
                                    <div className="prediction-section">
                                        <h3>{t('aiPrediction')}</h3>
                                        <div className="prediction-card">
                                            {expandedResult.prediction?.probabilities && (
                                                <div>
                                                    <p>{t('aneurysmProbability')}: {(expandedResult.prediction.probabilities.aneurysm * 100).toFixed(1)}%</p>
                                                    <p>{t('nonAneurysmProbability')}: {(expandedResult.prediction.probabilities.non_aneurysm * 100).toFixed(1)}%</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {expandedResult.shap_explanation && (
                                        <div className="explanation-section">
                                            <h3>{t('aiExplanation')}</h3>
                                            {expandedResult.shap_explanation.status === "processing" ? (
                                                <p>{t('shapProcessing')}</p>
                                            ) : (
                                                <div className="shap-visualization">
                                                    <div className="visualization-container">
                                                        <div className="chart-container">
                                                            <h4>{t('quadrantAnalysis')}</h4>
                                                            <ShapQuadrantChart result={expandedResult as unknown as ShapPredictionResult} />
                                                        </div>
                                                        <div className="scores-container">
                                                            {expandedResult.shap_explanation.analysis && (
                                                                <>
                                                                    <h4>{t('stabilityScore')}:</h4>
                                                                    <p>{expandedResult.shap_explanation.analysis.stability_score.toFixed(3)}</p>
                                                                    <h4>{t('importanceScore')}:</h4>
                                                                    <p>{expandedResult.shap_explanation.analysis.importance_score.toFixed(6)}</p>
                                                                    <h4>{t('mostImportantQuadrant')}:</h4>
                                                                    <p>{expandedResult.shap_explanation.analysis.most_important_quadrant}</p>
                                                                    
                                                                    <h4>{t('relativeImportance')}:</h4>
                                                                    <div className="relative-importance">
                                                                        {Object.entries(expandedResult.shap_explanation.analysis.relative_importances).map(([key, value]) => (
                                                                            <p key={key}>{key.replace('_', ' ')}: {(value as number).toFixed(3)}</p>
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {expandedResult.shap_explanation.metadata && (
                                                        <div className="timing-info">
                                                            <h4>{t('analysisDetails')}:</h4>
                                                            <p>{t('startTime')}: {new Date(expandedResult.shap_explanation.metadata.start_time).toLocaleString()}</p>
                                                            <p>{t('endTime')}: {new Date(expandedResult.shap_explanation.metadata.end_time).toLocaleString()}</p>
                                                            <p>{t('duration')}: {expandedResult.shap_explanation.metadata.analysis_duration.toFixed(2)} seconds</p>
                                                        </div>
                                                    )}

                                                    {expandedResult.shap_explanation.visualization?.url && (
                                                        <div className="shap-image">
                                                            <h4>{t('visualization')}:</h4>
                                                            <img
                                                                className="visualization-image"
                                                                src={expandedResult.shap_explanation.visualization.url}
                                                                alt="SHAP Analysis Visualization"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {expandedResult.prediction?.metadata && (
                                        <div className="metadata-section">
                                            <h3>{t('metadata')}</h3>
                                            <div className="metadata-grid">
                                                <div className="metadata-item">
                                                    <label>{t('timestamp')}:</label>
                                                    <p>{new Date(expandedResult.prediction.metadata.timestamp).toLocaleString()}</p>
                                                </div>
                                                <div className="metadata-item">
                                                    <label>{t('pytorchVersion')}:</label>
                                                    <p>{expandedResult.prediction.metadata.pytorch_version}</p>
                                                </div>
                                                <div className="metadata-item">
                                                    <label>{t('user')}:</label>
                                                    <p>{expandedResult.prediction.metadata.user}</p>
                                                </div>
                                                <div className="metadata-item">
                                                    <label>{t('createdAt')}:</label>
                                                    <p>{new Date(expandedResult.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <button onClick={() => navigate("/upload")}>{t('analyzeAnother')}</button>
        </div>
    );
};

export default Result;
