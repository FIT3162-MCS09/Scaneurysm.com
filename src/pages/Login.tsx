import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate(); // Use navigate for redirection

  return (
    <div className="login-container">
      <div className="left-section">
        <h1>Check your scans!</h1>
      </div>
      <div className="right-section">
        <div className="login-box">
          <h2>Login</h2>
          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />
          <div className="login-actions">
            <a href="#">Forgot Password?</a>
            <button onClick={() => navigate("/dashboard")}>Sign In</button>
          </div>
          <p>Don’t have an account? <a href="#">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
