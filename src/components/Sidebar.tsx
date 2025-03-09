import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => (
    <div className="sidebar">
        <Link to="/upload">Upload MRI/CT Scan</Link>
        <Link to="/records">Patient Records</Link>
        <Link to="/analyses">Previous Analyses</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/help">Help</Link>
    </div>
);

export default Sidebar;