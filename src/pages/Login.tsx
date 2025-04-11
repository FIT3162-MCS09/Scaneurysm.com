import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { patientService } from "../services/authServices";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // Clear any old errors
    try {
      const result = await patientService.login(username, password);
  
      if (result && result.access) {
        // Successful login: redirect
        navigate("/dashboard");
      } else {
        // Login didn't return tokens
        setError("Invalid username or password.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <h1>Check your scans!</h1>
      </div>
      <div className="right-section">
        <div className="login-box">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="login-actions">
            <button onClick={handleLogin}>Sign In</button>
            <a href="#">Forgot Password?</a>
          </div>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          <p>Don’t have an account?
            <a href="/signup/doctor"> Doctor Sign Up</a> or
            <a href="/signup/patient"> Patient Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
