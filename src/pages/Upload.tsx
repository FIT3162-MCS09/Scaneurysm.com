import React, { useState, useRef, useEffect, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import fileServices from "../services/fileServices";
import predictionServices from "../services/predictionServices";
import SidebarPatient from "../components/SidebarPatient";
import ProfileButton from "../components/ProfileButton";
import "./Upload.css";

const Upload = () => {
  const { t } = useTranslation("upload");
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
      setError(t('error'));
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
      setError(t('error'));
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
          t('analysisFailed')
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
        }, 300);
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
          <h1>{t('title')}</h1>

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
                    <p>{t('dragDrop')}</p>
                    <p className="small">{t('accepts')}</p>
                  </div>
                  <div className="or-divider">
                    <span>{t('or')}</span>
                  </div>
                  <button
                      className="manual-upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                  >
                    {t('chooseFile')}
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

          {file && <p className="file-name">{t('selectedFile')}: {file.name}</p>}

          <button
              className="analyze-button"
              onClick={analyze}
              disabled={!file || loading}
          >
            {loading ? `${t('processing')} (${progress}%)…` : t('analyze')}
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