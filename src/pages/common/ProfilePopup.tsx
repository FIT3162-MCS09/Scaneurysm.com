import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../../services/authServices";
import "./ProfilePopup.css";

interface ProfileData {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

const ProfilePopup = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation("profilePopup");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | "password">("view");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  /* ------ load profile once -------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error(t("loadError"), err);
      }
    })();
  }, [t]);

  /* ------ update profile ----------------------------------- */
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await authService.updateProfile(formData);
      setProfile(updated);
      setMode("view");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  /* ------ change password ---------------------------------- */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert(t("passwordMismatch"));
      return;
    }
    try {
      await authService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      alert(t("passwordChangeSuccess"));
      setMode("view");
    } catch (err) {
      console.error(t("passwordChangeError"), err);
    }
  };

  if (!profile) {
    return (
      <div className="profile-popup-overlay">
        <div className="profile-loading">{t("loading")}</div>
      </div>
    );
  }

  /* ------ RENDER ------------------------------------------- */
  return (
    <div className="profile-popup-overlay" onClick={onClose}>
      <div
        className="profile-popup"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {mode === "view" && (
          <div className="profile-view">
            <h2>{t("myProfile")}</h2>
            <div className="profile-info">
              <p>
                <strong>{t("name")}:</strong> {profile.first_name} {profile.last_name}
              </p>
              <p>
                <strong>{t("username")}:</strong> {profile.username}
              </p>
              <p>
                <strong>{t("email")}:</strong> {profile.email}
              </p>
              <p>
                <strong>{t("role")}:</strong> {profile.role}
              </p>
            </div>

            <div className="profile-actions">
              <button
                className="logout-btn"
                onClick={() => {
                  localStorage.removeItem("user_info"); // Clear user data
                  window.location.href = "/"; // Redirect to default URL
                }}
              >
                {t("logout")}
              </button>
            </div>
          </div>
        )}

        {mode === "edit" && (
          <form className="profile-edit" onSubmit={handleProfileUpdate}>
            <h2>{t("editProfile")}</h2>

            <div className="form-group">
              <label>{t("firstName")}</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>{t("lastName")}</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>{t("email")}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                {t("saveChanges")}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setMode("view")}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        )}

        {mode === "password" && (
          <form className="password-change" onSubmit={handlePasswordChange}>
            <h2>{t("changePassword")}</h2>

            <div className="form-group">
              <label>{t("currentPassword")}</label>
              <input
                type="password"
                value={passwordData.old_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    old_password: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>{t("newPassword")}</label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>{t("confirmNewPassword")}</label>
              <input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirm_password: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                {t("changePassword")}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setMode("view")}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePopup;
