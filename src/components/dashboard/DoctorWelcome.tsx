import React from "react";

// Doctor welcome message component
const DoctorWelcome: React.FC<{ t: any }> = ({ t }) => (
  <div className="doctor-welcome-section">
    <h3>{t("doctorWelcome.title") || "Welcome, Doctor"}</h3>
    <p>{t("doctorWelcome.description") || "Use the buttons above to view patient data and locate nearby hospitals."}</p>
  </div>
);

export default DoctorWelcome;
