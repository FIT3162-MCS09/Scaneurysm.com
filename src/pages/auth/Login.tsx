import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Login.css";
import { patientService } from "../../services/authServices";
import LanguageSelector from "../../components/LanguageSelector";

// Header component that displays the language selector
const Header: React.FC = () => {
    return (
        <div className="login-language-selector">
            <LanguageSelector />
        </div>
    );
};

// Left section component with the title
const LeftSection: React.FC = () => {
    const { t } = useTranslation("login");
    
    return (
        <div className="left-section">
            <h1>{t("title")}</h1>
        </div>
    );
};

// Login form component that handles the form inputs and submission
interface LoginFormProps {
    onLogin: (username: string, password: string) => Promise<void>;
    isLoading: boolean;
    error: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error }) => {
    const { t } = useTranslation("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onLogin(username, password);
    };

    return (
        <form className="login-box" onSubmit={handleSubmit}>
            <h2>{t("title")}</h2>
            <input
                type="text"
                placeholder={t("usernamePlaceholder")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
            />
            <input
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
            />
            <div className="login-actions">
                <button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <div className="loader"></div>
                    ) : (
                        t("signIn")
                    )}
                </button>
                <a href="#">{t("forgotPassword")}</a>
            </div>
            {error && <p className="error-message">{error}</p>}
            <p>
                {t("noAccount")}
                <a href="/signup/doctor"> {t("doctorSignUp")}</a> {t("or")}{" "}
                <a href="/signup/patient"> {t("patientSignUp")}</a>
            </p>
        </form>
    );
};

// Right section component that contains the logo and login form
interface RightSectionProps {
    onLogin: (username: string, password: string) => Promise<void>;
    isLoading: boolean;
    error: string;
}

const RightSection: React.FC<RightSectionProps> = ({ onLogin, isLoading, error }) => {
    const { t } = useTranslation("login");
    
    return (
        <div className="right-section">
            <div className="login-content">
                <img
                    src="/images/logo.png"
                    alt={t("logoAlt")}
                    className="login-logo"
                />
                <LoginForm onLogin={onLogin} isLoading={isLoading} error={error} />
            </div>
        </div>
    );
};

// Main Login component
const Login: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("login");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (username: string, password: string) => {
        setError("");
        setIsLoading(true);
        
        try {
            const result = await patientService.login(username, password);
            if (result && result.access) {
                navigate("/dashboard");
            } else {
                setError(t("error"));
            }
        } catch (err: any) {
            setError(err.message || t("error"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Header />
            <LeftSection />
            <RightSection 
                onLogin={handleLogin} 
                isLoading={isLoading} 
                error={error} 
            />
        </div>
    );
};

export default Login;
