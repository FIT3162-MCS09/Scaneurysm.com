import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import PatientRecords from "./pages/PatientRecords";
import Dashboard from "./pages/Dashboard";
import DoctorSignup from "./pages/DoctorSignup";
import PatientSignup from "./pages/PatientSignup";
import PatientProfile from "./pages/PatientProfile";
import MyRecords from "./pages/MyRecords";
import AboutAneurysm from "./pages/AboutAneurysm";
import Result from "./pages/Result";

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
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/my-records" element={<MyRecords />} />
        <Route path="/about" element={<AboutAneurysm />} />
        <Route path="/result/:id" element={<Result />} />


      </Routes>
    </Router>
  );
}

export default App;
