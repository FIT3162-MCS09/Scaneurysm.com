import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import predictionServices from "../services/predictionServices";
import SidebarPatient from "../components/SidebarPatient";
import ProfileButton from "../components/ProfileButton";
import "./Result.css";

const Result = () => {
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
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/upload")}>Try Again</button>
            </div>
        );

    return (
        <div className="result-container">
            <ProfileButton />
            <SidebarPatient />

            <h1>Analysis Results</h1>
            <button
                style={{ marginBottom: "20px" }}
                onClick={() => window.location.reload()}
            >
                Refresh Results
            </button>

            {loading ? (
                <div className="result-card loading">
                    <div className="spinner" />
                    <p>Analyzing your brain scans…</p>
                    <p>This may take a few minutes</p>
                </div>
            ) : results.length === 0 ? (
                <div className="result-card">
                    <p>No results available</p>
                </div>
            ) : (
                results.map((result) => (
                    <div key={result.id} className="result-card">
                        <h2>Result ID: {result.id}</h2>

                        {/* Prediction Section */}
                        <div className="prediction-section">
                            <h3>AI Prediction</h3>
                            <div className="prediction-card">
                                <p
                                    className={
                                        result.prediction?.prediction === "aneurysm"
                                            ? "positive"
                                            : "negative"
                                    }
                                >
                                    {result.prediction?.prediction === "aneurysm"
                                        ? "ANEURYSM DETECTED"
                                        : "No aneurysm detected"}
                                </p>
                                {result.prediction?.confidence && (
                                    <p>
                                        Confidence:{" "}
                                        {(result.prediction.confidence * 100).toFixed(1)}%
                                    </p>
                                )}
                                {result.prediction?.probabilities && (
                                    <div>
                                        <p>
                                            Aneurysm Probability:{" "}
                                            {(
                                                result.prediction.probabilities.aneurysm * 100
                                            ).toFixed(1)}
                                            %
                                        </p>
                                        <p>
                                            Non-Aneurysm Probability:{" "}
                                            {(
                                                result.prediction.probabilities.non_aneurysm * 100
                                            ).toFixed(1)}
                                            %
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SHAP Explanation Section */}
                        {result.shap_explanation && (
                            <div className="explanation-section">
                                <h3>AI Explanation</h3>
                                {result.shap_explanation.status === "processing" ? (
                                    <p>
                                        SHAP explanation is still being processed. Please check back
                                        later.
                                    </p>
                                ) : (
                                    <div className="shap-visualization">
                                        <h4>Quadrant Scores:</h4>
                                        <ul>
                                            {Object.entries(
                                                result.shap_explanation.analysis.quadrant_scores
                                            ).map(([k, v]) => (
                                                <li key={k}>{`${k}: ${v}`}</li>
                                            ))}
                                        </ul>
                                        <h4>Stability Score:</h4>
                                        <p>{result.shap_explanation.analysis.stability_score}</p>
                                        <h4>Importance Score:</h4>
                                        <p>{result.shap_explanation.analysis.importance_score}</p>
                                        <h4>Most Important Quadrant:</h4>
                                        <p>
                                            {result.shap_explanation.analysis.most_important_quadrant}
                                        </p>
                                        {result.shap_explanation.visualization?.url && (
                                            <div>
                                                <h4>Visualization:</h4>
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

                        {/* Metadata Section */}
                        {result.prediction?.metadata && (
                            <div className="metadata-section">
                                <h3>Metadata</h3>
                                <p>Timestamp: {result.prediction.metadata.timestamp}</p>
                                <p>PyTorch Version: {result.prediction.metadata.pytorch_version}</p>
                            </div>
                        )}
                    </div>
                ))
            )}

            <button onClick={() => navigate("/upload")}>Analyze Another Scan</button>
        </div>
    );
};

export default Result;