import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Register.css"; // You'll need to create this CSS file

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  role: "patient" | "doctor";
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "patient" // Default role
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    // Prepare data for API (exclude confirm_password)
    const { confirm_password, role, ...registrationData } = formData;

    try {
      setIsLoading(true);
      setError("");
      
      if (role === "doctor") {
        await authService.registerDoctor(registrationData);
        navigate("/doctor-dashboard");
      } else {
        await authService.registerPatient(registrationData);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="left-section">
        <h1>Join our platform!</h1>
      </div>
      <div className="right-section">
        <div className="register-box">
          <h2>Create an Account</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
            />
            
            <div className="role-selection">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={formData.role === "patient"}
                  onChange={handleChange}
                />
                Patient
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="doctor"
                  checked={formData.role === "doctor"}
                  onChange={handleChange}
                />
                Doctor
              </label>
            </div>
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;