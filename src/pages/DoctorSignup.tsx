import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doctorService } from "../services/authServices";
import "./Login.css";

const DoctorSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    license_number: "",
    specialty: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    try {
      await doctorService.signup(form);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <h1>Doctor Signup</h1>
      </div>
      <div className="right-section">
        <div className="login-box">
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} />
          <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} />
          <input name="license_number" placeholder="License Number" value={form.license_number} onChange={handleChange} />
          <input name="specialty" placeholder="Specialty" value={form.specialty} onChange={handleChange} />
          <button onClick={handleSubmit}>Sign Up</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;
