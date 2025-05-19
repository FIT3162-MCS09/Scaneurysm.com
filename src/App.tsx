import React, { useState } from "react";
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
import ResultList from "./pages/Result";
import Popup from "./components/Popup";
import API from "./services/apiClient";
import AboutModel from "./pages/AboutModel";
import About from "./pages/About";
import SidebarStateHandler from "./handler/SidebarStateHandler";
import DoctorLocator from "./pages/DoctorLocator";

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
          </Routes>
        </div>
      </Router>
  );
}

export default App;
