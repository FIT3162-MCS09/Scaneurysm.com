import React, { useEffect, useState } from "react";
import { authService } from "../services/authServices";
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
        console.error("Failed to load profile:", err);
      }
    })();
  }, []);

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
      alert("New passwords don't match!");
      return;
    }
    try {
      await authService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      alert("Password changed successfully!");
      setMode("view");
    } catch (err) {
      console.error("Password change failed:", err);
    }
  };

  if (!profile)
    return <div className="profile-loading">Loading profile…</div>;

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
            <h2>My Profile</h2>
            <div className="profile-info">
              <p>
                <strong>Name:</strong> {profile.first_name} {profile.last_name}
              </p>
              <p>
                <strong>Username:</strong> {profile.username}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Role:</strong> {profile.role}
              </p>
            </div>

            <div className="profile-actions">
              <button className="edit-btn" onClick={() => setMode("edit")}>
                Edit Profile
              </button>
              <button
                className="password-btn"
                onClick={() => setMode("password")}
              >
                Change Password
              </button>
            </div>
          </div>
        )}

        {mode === "edit" && (
          <form className="profile-edit" onSubmit={handleProfileUpdate}>
            <h2>Edit Profile</h2>

            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Email</label>
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
                Save Changes
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setMode("view")}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {mode === "password" && (
          <form className="password-change" onSubmit={handlePasswordChange}>
            <h2>Change Password</h2>

            <div className="form-group">
              <label>Current Password</label>
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
              <label>New Password</label>
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
              <label>Confirm New Password</label>
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
                Change Password
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setMode("view")}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePopup;
