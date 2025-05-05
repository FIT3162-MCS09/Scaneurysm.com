import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fileServices from "../services/fileServices";
import "./Scan.css";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user_info") || "{}");
  const accessTok = localStorage.getItem("access_token");

  /* ------------ helpers ------------------------------------------------ */
  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const analyze = async () => {
    if (!file || !accessTok) {
      alert("Please upload a file and make sure you’re logged in.");
      return;
    }
    setLoading(true);

    try {
      /* STEP 1 – upload -------------------------------------------------- */
      console.log("Uploading image …");
      const uploadRes = await fileServices.uploadFile({
        user_id: user.id,
        file: file,
      });

      const imageUrl: string = uploadRes.message; // Assuming `message` contains the image URL
      if (!imageUrl) throw new Error("Upload succeeded but no image URL returned");

      /* STEP 2 – prediction --------------------------------------------- */
      console.log("Requesting AI prediction …");
      const predRes = await fileServices.uploadFile({
        user_id: user.id,
        file: file,
      });

      const id = predRes.message;
      if (!id) throw new Error("Prediction succeeded but no id returned");

      /* STEP 3 – go to results ------------------------------------------ */
      navigate(`/result/${id}`);
    } catch (err: any) {
      console.error("Upload / prediction error:", err.response ?? err);
      alert(
          err.response?.data?.detail ??
          err.message ??
          "Something went wrong during upload or analysis."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ------------ UI ----------------------------------------------------- */
  return (
      <div className="dashboard-container">
        <div className="sidebar">
          <button className="active">Upload Scan</button>
          <button>Patient Records</button>
        </div>

        <div className="main-content">
          <h1>Upload Scan</h1>

          <input type="file" accept="image/*" onChange={pickFile} />
          {file && (
              <p style={{ marginTop: 10 }}>
                Selected file:&nbsp;<strong>{file.name}</strong>
              </p>
          )}

          <button onClick={analyze} disabled={!file || loading}>
            {loading ? "Analyzing…" : "Analyze"}
          </button>

          {loading && (
              <p style={{ marginTop: 20, color: "#1C3334", fontWeight: "bold" }}>
                Please wait – this may take up to a minute…
              </p>
          )}
        </div>
      </div>
  );
};

export default Upload;