import React, { useEffect, useState } from "react";
import API from "../../services/apiClient";
import SidebarPatient from "../../components/SidebarPatient";
import "./PatientProfile.css"; // reuse same CSS

const MyRecords = () => {
  const [profile, setProfile] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const profileRes = await API.get("/auth/profile/");
        setProfile(profileRes.data);

        const filesRes = await API.get("/api/files/view/");
        setRecords(filesRes.data);
      } catch (err) {
        console.error(err);
        setError("Could not load records.");
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="patient-profile-container">
      <SidebarPatient />
      <div className="content">
        <h1>My Records</h1>

        {error && <p>{error}</p>}

        {profile && (
          <div className="patient-info-box">
            <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Sex:</strong> {profile.sex}</p>
          </div>
        )}

        <div className="records-list">
          <h2>Uploaded Scans</h2>
          {records.length > 0 ? (
            records.map((record, idx) => (
              <div className="record-card" key={idx}>
                <p><strong>Filename:</strong> {record.filename}</p>
                <p><strong>Upload Date:</strong> {record.upload_date}</p>
              </div>
            ))
          ) : (
            <p>No records available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRecords;
