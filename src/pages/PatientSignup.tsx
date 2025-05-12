import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientService } from "../services/authServices";
import { patientSchema } from "../schemas/patientSchema";
import "./PatientSignup.css";
import { searchDoctors } from "../services/searchServices";

const PatientSignup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [doctorSearchInput, setDoctorSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    medical_record_number: "",
    birth_date: "",
    sex: "",
    primary_doctor: "",
  });

  const handleDoctorSearch = async () => {
    const [firstName, lastName] = doctorSearchInput.trim().split(/\s+/);
    try {
      const doctors = await searchDoctors("", firstName || "", lastName || "");
      setSearchResults(doctors);
    } catch (error) {
      console.error("Error searching doctors:", error);
      setError("Failed to search doctors");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    try {
      patientSchema.parse(form);
      setValidationErrors({});
      return true;
    } catch (err: any) {
      const errors: Record<string, string> = {};
      err.errors.forEach((error: any) => {
        const path = error.path[0];
        errors[path] = error.message;
      });
      setValidationErrors(errors);
      return false;
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      await patientService.register(form);
      navigate("/");
    } catch (err: any) {
      console.error("❌ Error during patient signup:", err);
      if (err?.response?.status === 400) {
        const responseData = err.response.data;
        if (responseData.username) {
          setValidationErrors(prev => ({
            ...prev,
            username: responseData.username[0]
          }));
        } else {
          setError("Signup failed");
        }
      } else {
        setError("Signup failed");
      }
    }
  };

  const getInputClassName = (fieldName: string) => {
    return validationErrors[fieldName] ? "input-error" : "";
  };

  return (
      <div className="login-container">
        <div className="left-section">
          <h1>Patient Signup</h1>
        </div>
        <div className="right-section">
          <div className="login-box">
            <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className={getInputClassName("username")}
            />
            {validationErrors.username && <span className="error-message">{validationErrors.username}</span>}

            <input
                name="email"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={getInputClassName("email")}
            />
            {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}

            <input
                name="password"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className={getInputClassName("password")}
            />
            {validationErrors.password && <span className="error-message">{validationErrors.password}</span>}

            <input
                name="first_name"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                className={getInputClassName("first_name")}
            />
            {validationErrors.first_name && <span className="error-message">{validationErrors.first_name}</span>}

            <input
                name="last_name"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
                className={getInputClassName("last_name")}
            />
            {validationErrors.last_name && <span className="error-message">{validationErrors.last_name}</span>}

            <input
                name="medical_record_number"
                placeholder="Medical Record Number"
                value={form.medical_record_number}
                onChange={handleChange}
                className={getInputClassName("medical_record_number")}
            />
            {validationErrors.medical_record_number && (
                <span className="error-message">{validationErrors.medical_record_number}</span>
            )}

            <input
                name="birth_date"
                type="date"
                value={form.birth_date}
                onChange={handleChange}
                className={getInputClassName("birth_date")}
                max={new Date().toISOString().split('T')[0]} // Prevents future dates
            />
            {validationErrors.birth_date && <span className="error-message">{validationErrors.birth_date}</span>}

            <select
                name="sex"
                value={form.sex}
                onChange={handleChange}
                className={`dropdown ${getInputClassName("sex")}`}
            >
              <option value="" disabled hidden>Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="I">Intersex</option>
              <option value="O">Other</option>
              <option value="U">Unspecified</option>
              <option value="P">Prefer not to say</option>
            </select>
            {validationErrors.sex && <span className="error-message">{validationErrors.sex}</span>}

            <div className="input-with-search">
              <input
                  name="primary_doctor"
                  placeholder="Search doctor by full name"
                  value={doctorSearchInput}
                  onChange={(e) => setDoctorSearchInput(e.target.value)}
                  style={{ width: '80%', padding: '8px', height: '38px', boxSizing: 'border-box' }}
              />
                <button
                    className="search-button"
                    onClick={() => {
                      handleDoctorSearch();
                      setShowDoctorSearch(true);
                    }}
                    style={{ width: '20%', minWidth: '40px' }}
                >
                    <SearchIcon />
                </button>
            </div>
            {form.primary_doctor && (
                <div style={{
                  backgroundColor: '#f0f9f9',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  marginTop: '5px',
                  fontSize: '0.9rem',
                  color: '#1C3334',
                  border: '1px solid #d0e8e8'
                }}>
                  ✓ Selected Doctor: {doctorSearchInput}
                </div>
            )}
            {validationErrors.primary_doctor && (
                <span className="error-message">{validationErrors.primary_doctor}</span>
            )}
            {showDoctorSearch && (
                <div className="search-modal">
                  <div className="search-modal-content">
                    <h3>Select a Doctor</h3>
                    <div className="search-results">
                      {searchResults.map((doctor: any) => (
                          <div
                              key={doctor.id}
                              className="doctor-result"
                              onClick={() => {
                                setForm({ ...form, primary_doctor: doctor.id });
                                setDoctorSearchInput(`${doctor.first_name} ${doctor.last_name}`);
                                setShowDoctorSearch(false);
                              }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontWeight: '500' }}>
                {doctor.first_name} {doctor.last_name}
              </span>
                              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                {doctor.email}
              </span>
                            </div>
                          </div>
                      ))}
                    </div>
                    <button
                        onClick={() => setShowDoctorSearch(false)}
                        style={{ marginTop: '15px' }}
                    >
                      Close
                    </button>
                  </div>
                </div>
            )}

            <button onClick={handleSubmit}>Sign Up</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
  );
};

export default PatientSignup;