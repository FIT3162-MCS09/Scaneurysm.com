import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./About.css";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

const About = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("about");

    return (
        <div className="about-model-container">
            <Sidebar />
            <h1>{t("title")}</h1>
            <div className="navigation-cards">
                <div
                    className="card"
                    onClick={() => navigate("/about-aneurysm")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate("/about-aneurysm")}
                >
                    <h3>{t("aboutAneurysm")}</h3>
                    <p>{t("aneurysmDescription")}</p>
                </div>
                <div
                    className="card"
                    onClick={() => navigate("/about-model")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate("/about-model")}
                >
                    <h3>{t("aboutModel")}</h3>
                    <p>{t("modelDescription")}</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
