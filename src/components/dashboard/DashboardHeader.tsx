import React from "react";

// Header component with logo
const DashboardHeader: React.FC<{ logoAlt: string }> = ({ logoAlt }) => (
  <header className="dashboard-header">
    <img
      src="/images/logo.png"
      alt={logoAlt}
      className="dashboard-logo"
    />
  </header>
);

export default DashboardHeader;
