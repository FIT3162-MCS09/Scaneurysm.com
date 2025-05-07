import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fileServices from "../services/fileServices";
import predictionServices from "../services/predictionServices";
import "./Scan.css";
import SidebarPatient from "../components/SidebarPatient";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user_info") || "{}");

  const analyze = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }
  
    setLoading(true);
    setProgress(0);
    setError("");
  
    try {
      // 1. Upload file (25%)
      setProgress(25);
      console.log("Starting file upload...");
      const imageUrl = await fileServices.uploadFile(user.id, file);
      console.log("Received image URL:", imageUrl);
      setProgress(50);
  
      // 2. Create prediction (50%)
      console.log("Creating prediction...");
      await predictionServices.create(imageUrl);
      setProgress(75);
  
      // 3. Navigate to results
      navigate(`/result/`);
    } catch (err: any) {
      console.error("Full analysis error:", err);
      setError(
        err.response?.data?.error ||
        err.message ||
        "Analysis failed. Please check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <SidebarPatient /> {/* Use the Sidebar component here */}

      <div className="main-content">
        <h1>Upload Brain Scan</h1>
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={loading}
        />
        
        {file && <p>Selected file: {file.name}</p>}

        <button onClick={analyze} disabled={!file || loading}>
          {loading ? `Processing (${progress}%)...` : "Analyze"}
        </button>

        {loading && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default Upload;