import React from "react";
import { useTranslation } from "react-i18next";
import "./AboutAneurysm.css";
import SidebarPatient from "../components/SidebarPatient";

const AboutAneurysm = () => {
    const { t } = useTranslation("aboutAneurysm");

    return (
        <div className="about-container">
            <SidebarPatient />
            <h1>{t("title")}</h1>
            <section className="section">
                <h2>{t("whatIs")}</h2>
                <p>{t("description")}</p>
                <img src="/images/aneurysm-diagram.png" alt={t("diagramAlt")} className="infographic" />
            </section>

            <section className="section">
                <h2>{t("symptoms")}</h2>
                <ul>
                    <li>{t("symptom1")}</li>
                    <li>{t("symptom2")}</li>
                    <li>{t("symptom3")}</li>
                    <li>{t("symptom4")}</li>
                    <li>{t("symptom5")}</li>
                    <li>{t("symptom6")}</li>
                </ul>
            </section>

            <section className="section">
                <h2>{t("prevention")}</h2>
                <ul>
                    <li>{t("tip1")}</li>
                    <li>{t("tip2")}</li>
                    <li>{t("tip3")}</li>
                    <li>{t("tip4")}</li>
                    <li>{t("tip5")}</li>
                </ul>
            </section>

            <footer className="footer-bar">
                <div className="footer-left">
                    <a href="#">{t("feedback")}</a>
                    <a href="#">{t("privacy")}</a>
                    <a href="/about-aneurysm">{t("aboutAneurysm")}</a>
                </div>
                <div className="footer-center">
                    <strong>{t("emergencyHelp")}</strong>
                    <p>📞 +60 1234567</p>
                </div>
                <div className="footer-right">
                    <strong>{t("connect")}</strong>
                    <div className="social-icons">
                        <a href="#"><i className="fab fa-facebook"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutAneurysm;
