import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import predictionServices from "../services/predictionServices";
import "./Result.css";

const Result = () => {
  const { predictionId } = useParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!predictionId) {
      setError("Missing prediction ID");
      setLoading(false);
      return;
    }

    const loadResult = async () => {
      try {
        const data = await predictionServices.pollUntilComplete(predictionId);
        setResult(data);
      } catch (err: any) {
        setError(err.message || "Failed to get results");
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [predictionId]);

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Analyzing your brain scan...</p>
      <p>This may take a few minutes</p>
    </div>
  );

  if (error) return (
    <div className="error">
      <h2>Error</h2>
      <p>{error}</p>
      <button onClick={() => navigate("/upload")}>Try Again</button>
    </div>
  );

  return (
    <div className="result-container">
      <h1>Analysis Results</h1>
      
      <div className="image-section">
        <h3>Original Scan</h3>
        <img src={result.image_url} alt="Brain scan" />
      </div>

      <div className="prediction-section">
        <h3>AI Prediction</h3>
        <div className="prediction-card">
          <p className={result.prediction?.has_aneurysm ? "positive" : "negative"}>
            {result.prediction?.has_aneurysm ? "ANEURYSM DETECTED" : "No aneurysm detected"}
          </p>
          {result.prediction?.confidence && (
            <p>Confidence: {(result.prediction.confidence * 100).toFixed(1)}%</p>
          )}
        </div>
      </div>

      {result.shap_explanation && (
        <div className="explanation-section">
          <h3>AI Explanation</h3>
          <div className="shap-visualization">
            <pre>{JSON.stringify(result.shap_explanation, null, 2)}</pre>
          </div>
        </div>
      )}

      <button onClick={() => navigate("/upload")}>Analyze Another Scan</button>
    </div>
  );
};

export default Result;