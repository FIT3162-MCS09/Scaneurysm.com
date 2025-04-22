import React, { useEffect, useState } from "react";
import API from "../services/apiClient";
import "./PatientProfile.css";

const PatientProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await API.get("/auth/profile/");
        setProfile(profileRes.data);
      } catch (err: any) {
        setError("Failed to load patient profile.");
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="patient-profile-page">
      <h1>Patient Profile</h1>

      {profile ? (
        <div className="profile-section">
          <h2>Personal Information</h2>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Full Name:</strong> {profile.first_name} {profile.last_name}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default PatientProfile;
