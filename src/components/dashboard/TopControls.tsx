import React from "react";
import LanguageSelector from "../../components/LanguageSelector";
import ProfileButton from "../../components/ProfileButton";

// Top controls component containing language selector and profile button
const TopControls: React.FC = () => (
  <div className="top-controls">
    <LanguageSelector />
    <ProfileButton />
  </div>
);

export default TopControls;
