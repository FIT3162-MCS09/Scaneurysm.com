import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Upload from "./pages/common/Upload";
import PatientRecords from "./pages/patient/PatientRecords";
import Dashboard from "./pages/common/Dashboard";
import DoctorSignup from "./pages/auth/DoctorSignup";
import PatientSignup from "./pages/auth/PatientSignup";
import PatientProfile from "./pages/common/PatientProfile";
import MyRecords from "./pages/common/MyRecords";
import AboutAneurysm from "./pages/misc/AboutAneurysm";
import ResultList from "./pages/patient/Result";
import Popup from "./components/Popup";
import API from "./services/apiClient";
import AboutModel from "./pages/misc/AboutModel";
import About from "./pages/misc/About";
import SidebarStateHandler from "./handler/SidebarStateHandler";
import DoctorLocator from "./pages/common/DoctorLocator";
import PatientResult from "./pages/doctor/PatientResult";
import PrivacyPolicy from "./pages/misc/PrivacyPolicy";
import AboutUs from "./pages/misc/AboutUs";

function App() {
  const [showPopup, setShowPopup] = useState(false);

  // Add Axios interceptor to handle 401 errors
    React.useEffect(() => {
        const interceptor = API.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    const isAuthMissing = error.response.data?.detail === "Authentication credentials were not provided.";
                    const isTokenInvalid = error.response.data?.code === "token_not_valid";

                    if ((isAuthMissing || isTokenInvalid) && !error.config._handled401) {
                        error.config._handled401 = true; // Mark as handled
                        setShowPopup(true); // Trigger the popup
                    }
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on unmount
        return () => {
            API.interceptors.response.eject(interceptor);
        };
    }, []);

  const handleRedirect = () => {
    setShowPopup(false);
    window.location.href = "/"; // Redirect to the login page
  };

  return (
      <Router>
          <SidebarStateHandler/>
        <div>
            {showPopup && (
                <div className="profile-popup-overlay" style={{ zIndex: 9999 }}>
                    <Popup
                        message="Session expired. Please log in again."
                        onClose={() => setShowPopup(false)}
                        onAction={handleRedirect}
                    />
                </div>
            )}
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/patient-records" element={<PatientRecords />} />
              <Route path="/signup/doctor" element={<DoctorSignup />} />
              <Route path="/signup/patient" element={<PatientSignup />} />
              <Route path="/profile" element={<PatientProfile />} />
              <Route path="/my-records" element={<MyRecords />} />
              <Route path="/about" element={<About/>} />
              <Route path="/result/" element={<ResultList />} />
              <Route path="/about-model" element={<AboutModel />} />
              <Route path="/about-aneurysm" element={<AboutAneurysm />} />
              <Route path="/find-hospital" element={<DoctorLocator />} />
              <Route path="/patient/results/:patientId" element={<PatientResult />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/about-us" element={<AboutUs />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
