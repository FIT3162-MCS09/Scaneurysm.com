import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      // Call the login method from authService
      const userData = await authService.login(username, password);
      console.log(userData)
      // Redirect based on user role
      if (userData.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <h1>Check your scans!</h1>
      </div>
      <div className="right-section">
        <div className="login-box">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
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
              <a href="/forgot-password">Forgot Password?</a>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
          <p>
            Don't have an account?{" "}
            <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;