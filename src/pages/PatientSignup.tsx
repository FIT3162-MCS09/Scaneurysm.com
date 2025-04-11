import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientService } from "../services/authServices";
import "./Login.css";

const PatientSignup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    try {
      await patientService.register({
        username: form.username,
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        medical_record_number: form.medical_record_number,
        birth_date: form.birth_date,
        sex: form.sex,
        primary_doctor: form.primary_doctor,
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ Error during patient signup:", err); // Log full error object

      if (err && typeof err === "object") {
        const errorMessages = Object.values(err).flat().join(" ");
        setError(errorMessages || "Signup failed");
      } else {
        setError("Signup failed");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <h1>Patient Signup</h1>
      </div>
      <div className="right-section">
        <div className="login-box">
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} />
          <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />
          <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} />
          <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} />
          <input name="medical_record_number" placeholder="Medical Record Number" value={form.medical_record_number} onChange={handleChange} />
          <input name="birth_date" placeholder="Birth Date (YYYY-MM-DD)" value={form.birth_date} onChange={handleChange} />
          <select name="sex" value={form.sex} onChange={handleChange} className="dropdown">
            <option value="" disabled hidden>Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="I">Intersex</option>
            <option value="O">Other</option>
            <option value="U">Unspecified</option>
            <option value="P">Prefer not to say</option>
          </select>
          <input name="primary_doctor" placeholder="Primary Doctor ID (UUID)" value={form.primary_doctor} onChange={handleChange} />

          <button onClick={handleSubmit}>Sign Up</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default PatientSignup;
