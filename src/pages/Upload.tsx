import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fileServices from "../services/fileServices";
import predictionServices from "../services/predictionServices";
import SidebarPatient from "../components/SidebarPatient";
import ProfileButton from "../components/ProfileButton";     // ← NEW
import "./Scan.css";

const Upload = () => {
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  const user = JSON.parse(localStorage.getItem("user_info") || "{}");

  /* ------------- full flow ---------------------------------- */
  const analyze = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError("");

    try {
      // 1. Upload
      setProgress(25);
      const imageUrl = await fileServices.uploadFile(user.id, file);
      setProgress(50);

      // 2. Prediction
      await predictionServices.create(imageUrl);
      setProgress(75);

      // 3. Navigate
      navigate("/result/");
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

  /* ------------- UI ----------------------------------------- */
  return (
    <div className="dashboard-container">
      {/* floating profile trigger */}
      <ProfileButton />

      <SidebarPatient />

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
          {loading ? `Processing (${progress}%)…` : "Analyze"}
        </button>

        {loading && (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default Upload;
