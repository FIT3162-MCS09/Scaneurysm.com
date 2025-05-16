import React from "react";
import { useTranslation } from "react-i18next";
import "./AboutModel.css";
import SidebarPatient from "../components/SidebarPatient";
import Footer from "../components/Footer";

const AboutModel = () => {
    const { t } = useTranslation("aboutModel");

    return (
        <div className="about-model-container">
            <SidebarPatient />
            <h1>{t("title")}</h1>
            <section className="section">
                <h2>{t("purpose")}</h2>
                <p>{t("purposeDescription")}</p>
            </section>

            <section className="section">
                <h2>{t("howItWorks")}</h2>
                <p>{t("howItWorksDescription1")}</p>
                <p>{t("howItWorksDescription2")}</p>
            </section>

            <section className="section">
                <h2>{t("limitations")}</h2>
                <ul>
                    <li>{t("limitation1")}</li>
                    <li>{t("limitation2")}</li>
                    <li>{t("limitation3")}</li>
                </ul>
                <p>{t("limitationsDescription")}</p>
            </section>
            <Footer />
        </div>
    );
};

export default AboutModel;
