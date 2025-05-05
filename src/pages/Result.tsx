// File: src/pages/Result.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Result.css";

const Result = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const access_token = localStorage.getItem("access_token");

        const res = await axios.get(`${API_BASE}/analysis/predictions/history/`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const found = res.data.find((item: any) => item.id.toString() === resultId);
        if (!found) {
          setError("No result found for the given ID.");
        } else {
          setResult(found);
        }
      } catch (err) {
        console.error("Failed to fetch result", err);
        setError("Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (loading) return <div className="loading">Loading result...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!result) return null;

  return (
    <div className="result-container">
      <h1>Scan Result</h1>

      <div className="image-section">
        <h3>Scanned Image</h3>
        <img src={result.image_url} alt="Scan" className="result-image" />
      </div>

      <div className="prediction-section">
        <h3>Prediction Output</h3>
        <pre>{JSON.stringify(result.prediction, null, 2)}</pre>
      </div>

      {result.shap_explanation && (
        <div className="shap-section">
          <h3>SHAP Explanation</h3>
          <pre>{JSON.stringify(result.shap_explanation, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Result;