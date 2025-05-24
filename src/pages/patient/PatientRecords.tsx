import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./PatientRecords.css";

const PatientRecords = () => {
  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState<any>(null);

  const handleSearch = () => {
    setPatientData({
      name: "John Doe",
      id: patientId,
      hospital: "Monash Medical Center",
      doctor: "Dr. Smith",
      age: 45,
      sex: "Male",
      history: "Previous aneurysm detected",
    });
  };

  return (
    <div className="patient-records-page">
      <Sidebar />
      <div className="patient-records-content">
        <h1>Patient Records</h1>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        {patientData && (
          <div className="patient-info">
            <h2>Patient Information</h2>
            <p><strong>Name:</strong> {patientData.name}</p>
            <p><strong>ID:</strong> {patientData.id}</p>
            <p><strong>Hospital:</strong> {patientData.hospital}</p>
            <p><strong>Doctor:</strong> {patientData.doctor}</p>
            <p><strong>Age:</strong> {patientData.age}</p>
            <p><strong>Sex:</strong> {patientData.sex}</p>
            <p><strong>History:</strong> {patientData.history}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecords;
