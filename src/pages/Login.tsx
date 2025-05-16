import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Login.css";
import { patientService } from "../services/authServices";
import LanguageSelector from "../components/LanguageSelector";

const Login = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");
        try {
            const result = await patientService.login(username, password);
            if (result && result.access) {
                navigate("/dashboard");
            } else {
                setError(t("error"));
            }
        } catch (err: any) {
            setError(err.message || t("error"));
        }
    };

    return (
        <div className="login-container">
            <div className="login-language-selector">
                <LanguageSelector />
            </div>
            <div className="left-section">
                <h1>{t("title")}</h1>
            </div>

            <div className="right-section">
                <div className="login-content">
                    <img
                        src="/images/logo.png"
                        alt={t("logoAlt")}
                        className="login-logo"
                    />

                    <div className="login-box">
                        <h2>{t("title")}</h2>
                        <input
                            type="text"
                            placeholder={t("usernamePlaceholder")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder={t("passwordPlaceholder")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="login-actions">
                            <button onClick={handleLogin}>{t("signIn")}</button>
                            <a href="#">{t("forgotPassword")}</a>
                        </div>
                        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
                        <p>
                            {t("noAccount")}
                            <a href="/signup/doctor"> {t("doctorSignUp")}</a> {t("or")}{" "}
                            <a href="/signup/patient"> {t("patientSignUp")}</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
