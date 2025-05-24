import React from "react";
import HospitalPreviewCard from "./HospitalPreviewCard";

// Patient navigation buttons component
export const PatientNavigationButtons: React.FC<{
  t: any;
  navigate: (path: string) => void;
}> = ({ t, navigate }) => (
  <div className="dashboard-buttons">
    <button onClick={() => navigate("/upload")}>
      {t("uploadScan")}
    </button>
    <button onClick={() => navigate("/result")}>
      {t("myResults")}
    </button>
    <button
      className="full-width"
      onClick={() => navigate("/about")}
    >
      {t("aboutAneurysm")}
    </button>
    <HospitalPreviewCard t={t} navigate={navigate} />
  </div>
);

// Doctor navigation buttons component
export const DoctorNavigationButtons: React.FC<{
  t: any;
  navigate: (path: string) => void;
}> = ({ t, navigate }) => (
  <div className="dashboard-buttons">
    <button onClick={() => navigate("/result")}>
      {t("doctorWelcome.myPatients") || "My Patients"}
    </button>
    <HospitalPreviewCard t={t} navigate={navigate} />
  </div>
);
