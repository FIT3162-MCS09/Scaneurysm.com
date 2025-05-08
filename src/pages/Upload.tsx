import React, { useState, useRef, useEffect, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import fileServices from "../services/fileServices";
import predictionServices from "../services/predictionServices";
import SidebarPatient from "../components/SidebarPatient";
import ProfileButton from "../components/ProfileButton";
import "./Upload.css";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user_info") || "{}");

  const handleFile = (newFile: File) => {
    if (!newFile.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    setFile(newFile);
    setError("");

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(newFile);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const analyze = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError("");

    try {
      setProgress(25);
      const imageUrl = await fileServices.uploadFile(user.id, file);
      setProgress(50);
      await predictionServices.create(imageUrl);
      setProgress(75);
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

  useEffect(() => {
    const cancelButton = document.querySelector(".cancel-button");
    const imagePreview = document.querySelector(".image-preview");

    const handleCancelClick = () => {
      if (imagePreview) {
        imagePreview.classList.add("fade-out");
        setTimeout(() => {
          setFile(null);
          setPreview("");
        }, 300); // Match the animation duration in CSS
      }
    };

    cancelButton?.addEventListener("click", handleCancelClick);

    return () => {
      cancelButton?.removeEventListener("click", handleCancelClick);
    };
  }, [preview]);

  return (
      <div className="dashboard-container">
        <ProfileButton />
        <SidebarPatient />

        <div className="main-content">
          <h1>Upload Brain Scan</h1>

          <div
              className={`drop-zone ${isDragging ? "dragging" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
          >
            {preview ? (
                <>
                  <img src={preview} alt="Preview" className="image-preview" />
                  <button className="cancel-button" type="button">
                    &times;
                  </button>
                </>
            ) : (
                <>
                  <div className="drop-zone-text">
                    <p>Drag & Drop your brain scan here</p>
                    <p className="small">Accepts image files only</p>
                  </div>
                  <div className="or-divider">
                    <span>OR</span>
                  </div>
                  <button
                      className="manual-upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                  >
                    Choose File
                  </button>
                </>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                style={{ display: "none" }}
                disabled={loading}
            />
          </div>

          {file && <p className="file-name">Selected file: {file.name}</p>}

          <button
              className="analyze-button"
              onClick={analyze}
              disabled={!file || loading}
          >
            {loading ? `Processing (${progress}%)…` : "Analyze"}
          </button>

          {loading && (
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
          )}

          {error && <div className="error">{error}</div>}
        </div>
      </div>
  );
};

export default Upload;