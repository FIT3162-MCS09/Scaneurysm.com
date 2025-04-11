import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import PatientRecords from "./pages/PatientRecords";
import Dashboard from "./pages/Dashboard";
import DoctorSignup from "./pages/DoctorSignup";
import PatientSignup from "./pages/PatientSignup"; // ✅ Add this line

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/patient-records" element={<PatientRecords />} />
        <Route path="/signup/doctor" element={<DoctorSignup />} />
        <Route path="/signup/patient" element={<PatientSignup />} />
      </Routes>
    </Router>
  );
}

export default App;
