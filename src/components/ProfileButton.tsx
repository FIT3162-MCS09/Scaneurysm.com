import React, { useState } from "react";
import ProfilePopup from "../pages/common/ProfilePopup";
import "./ProfileButton.css";

const ProfileButton = () => {
  const [show, setShow] = useState(false);
  const user = JSON.parse(localStorage.getItem("user_info") || "{}");

  return (
    <>
      <button className="profile-button" onClick={() => setShow(true)}>
        <i className="fas fa-user-circle" />
        <span>{user.first_name || user.username || "Profile"}</span>
      </button>

      {show && <ProfilePopup onClose={() => setShow(false)} />}
    </>
  );
};

export default ProfileButton;
