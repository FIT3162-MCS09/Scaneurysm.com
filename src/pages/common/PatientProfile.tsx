import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../services/apiClient";
import "./PatientProfile.css";

const PatientProfile = () => {
    const { t } = useTranslation("patientProfile");
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileRes = await API.get("/auth/profile/");
                setProfile(profileRes.data);
            } catch (err: any) {
                setError(t("error"));
                console.error(err);
            }
        };

        fetchProfile();
    }, [t]);

    if (error) return <p className="error">{error}</p>;

    return (
        <div className="patient-profile-page">
            <h1>{t("title")}</h1>

            {profile ? (
                <div className="profile-section">
                    <h2>{t("personalInfo")}</h2>
                    <p><strong>{t("username")}:</strong> {profile.username}</p>
                    <p><strong>{t("email")}:</strong> {profile.email}</p>
                    <p><strong>{t("fullName")}:</strong> {profile.first_name} {profile.last_name}</p>
                    <p><strong>{t("role")}:</strong> {profile.role}</p>
                </div>
            ) : (
                <p>{t("loading")}</p>
            )}
        </div>
    );
};

export default PatientProfile;
