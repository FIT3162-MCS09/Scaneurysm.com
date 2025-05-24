import React, { useEffect, useState } from "react";
import { DoctorPatient } from "../../types/doctor";
import predictionServices from "../../services/predictionServices";
import {useTranslation} from "react-i18next";

// Doctor's patients summary component
const DoctorPatientsSummary: React.FC<{
  patients: DoctorPatient[];
  loading: boolean;
  error: string;
  navigate: (path: string) => void;
}> = ({ patients, loading, error, navigate }) => {
  const [patientPredictions, setPatientPredictions] = useState<Record<string, any>>({});
  const [predictionLoading, setPredictionLoading] = useState(true);
  const { t } = useTranslation("dashboard");

  // Fetch latest prediction for each patient
  useEffect(() => {
    const fetchPatientPredictions = async () => {
      if (!patients.length) return;

      setPredictionLoading(true);
      const predictions: Record<string, any> = {};

      try {
        // Process patients in batches to avoid too many simultaneous requests
        const batchSize = 3;
        for (let i = 0; i < patients.length; i += batchSize) {
          const batch = patients.slice(i, i + batchSize);

          // Fetch predictions for this batch in parallel
          const batchResults = await Promise.all(
            batch.map(async (patient) => {
              try {
                const result = await predictionServices.getPatientPredictionDetails(patient.user_id);
                if (Array.isArray(result) && result.length > 0) {
                  // Get the latest prediction
                  const latestResult = result[0];
                  return {
                    patientId: patient.user_id,
                    prediction: latestResult.prediction?.prediction || "unknown",
                    confidence: latestResult.prediction?.confidence || 0,
                  };
                }
                return { patientId: patient.user_id, prediction: "none", confidence: 0 };
              } catch (error) {
                console.error(`Error fetching prediction for patient ${patient.user_id}:`, error);
                return { patientId: patient.user_id, prediction: "error", confidence: 0 };
              }
            })
          );

          // Add batch results to predictions object
          batchResults.forEach((result) => {
            predictions[result.patientId] = {
              prediction: result.prediction,
              confidence: result.confidence,
            };
          });
        }

        setPatientPredictions(predictions);
      } catch (err) {
        console.error("Error fetching patient predictions:", err);
      } finally {
        setPredictionLoading(false);
      }
    };

    fetchPatientPredictions();
  }, [patients]);

  if (loading) {
    return (
      <div className="doctor-patients-summary loading">
        <h3>{t("doctorPatients.title") || "My Patients"}</h3>
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>{t("doctorPatients.loading") || "Loading patient data..."}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-patients-summary error">
        <h3>{t("doctorPatients.title") || "My Patients"}</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="doctor-patients-summary empty">
        <h3>{t("doctorPatients.title") || "My Patients"}</h3>
        <p>{t("doctorPatients.noPatients") || "You have no patients assigned yet."}</p>
      </div>
    );
  }

  // Count aneurysm vs non-aneurysm cases
  const countResults = () => {
    const counts = {
      aneurysm: 0,
      non_aneurysm: 0,
      unknown: 0,
    };

    Object.values(patientPredictions).forEach((prediction) => {
      if (prediction.prediction === "aneurysm" || prediction.prediction === "Aneurysm") {
        counts.aneurysm++;
      } else if (prediction.prediction === "non_aneurysm" || prediction.prediction === "Non-aneurysm") {
        counts.non_aneurysm++;
      } else {
        counts.unknown++;
      }
    });

    return counts;
  };

  const resultCounts = countResults();

  const handleViewPatient = (patientId: string) => {
    navigate(`/result?patientId=${patientId}`);
  };

  const getPredictionColor = (prediction: string) => {
    if (prediction === "aneurysm") return "#e74c3c"; // Red for aneurysm
    if (prediction === "non_aneurysm") return "#2ecc71"; // Green for non-aneurysm
    return "#95a5a6"; // Gray for unknown
  };

  return (
    <div className="doctor-patients-summary">
      <div className="patients-header">
        <h3>{t("doctorPatients.title") || "My Patients"}</h3>
        <div className="patient-stats">
          <div className="stat-item">
            <span className="stat-number">{patients.length}</span>
            <span className="stat-label">{t("doctorPatients.totalPatients") || "Total Patients"}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ color: "#e74c3c" }}>
              {resultCounts.aneurysm}
            </span>
            <span className="stat-label">{t("doctorPatients.aneurysmCases") || "Aneurysm Cases"}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ color: "#2ecc71" }}>
              {resultCounts.non_aneurysm}
            </span>
            <span className="stat-label">{t("doctorPatients.nonAneurysmCases") || "Non-Aneurysm Cases"}</span>
          </div>
        </div>
      </div>

      <div className="recent-patients">
        <h4>{t("doctorPatients.recentPatients") || "Recent Patients"}</h4>

        <table className="patients-table">
          <thead>
            <tr>
              <th>{t("doctorPatients.name") || "Name"}</th>
              <th>{t("doctorPatients.email") || "Email"}</th>
              <th>{t("doctorPatients.diagnosis") || "Diagnosis"}</th>
              <th>{t("doctorPatients.actions") || "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {patients.slice(0, 5).map((patient) => {
              const prediction = patientPredictions[patient.user_id] || { prediction: "unknown", confidence: 0 };
              return (
                <tr key={patient.user_id}>
                  <td>{`${patient.first_name} ${patient.last_name}`}</td>
                  <td>{patient.email}</td>
                  <td>
                    <span className={`diagnosis-badge ${prediction.prediction}`}>
                      {prediction.prediction === "aneurysm" || prediction.prediction === "Aneurysm"
                          ? t("prediction.aneurysm") || "Aneurysm"
                          : prediction.prediction === "non_aneurysm" || prediction.prediction === "Non-aneurysm"
                              ? t("prediction.nonAneurysm") || "No Aneurysm"
                              : t("prediction.unknown") || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-patient-btn"
                      onClick={() => handleViewPatient(patient.user_id)}
                    >
                      {t("doctorPatients.viewResults") || "View Results"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorPatientsSummary;
