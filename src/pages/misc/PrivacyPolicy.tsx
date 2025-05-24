// src/pages/PrivacyPolicy.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./PrivacyPolicy.css";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

const PrivacyPolicy: React.FC = () => {
  /* i18n hook — pulls strings from translations/pages/privacyPolicy.ts */
  const { t } = useTranslation("privacyPolicy");

  return (
    <div className="privacy-container">
      <Sidebar />

      {/* title & effective date */}
      <h1>{t("title")}</h1>
      <p className="effective-date">
        <em>{t("effectiveDate")}</em>
      </p>

      {/* 1 — What information we collect */}
      <section className="section">
        <h2>{t("section1")}</h2>
        <ul>
          <li>{t("bullet1a")}</li>
          <li>{t("bullet1b")}</li>
          <li>{t("bullet1c")}</li>
          <li>{t("bullet1d")}</li>
        </ul>
      </section>

      {/* 2 — How we use it */}
      <section className="section">
        <h2>{t("section2")}</h2>
        <ul>
          <li>{t("bullet2a")}</li>
          <li>{t("bullet2b")}</li>
          <li>{t("bullet2c")}</li>
          <li>{t("bullet2d")}</li>
        </ul>
        <p>
          <strong>{t("bullet2e")}</strong>
        </p>
      </section>

      {/* 3 — Storage & security */}
      <section className="section">
        <h2>{t("section3")}</h2>
        <p>{t("bullet3a")}</p>
        <p>{t("bullet3b")}</p>
        <p>{t("bullet3c")}</p>
      </section>

      {/* 4 — Data sharing */}
      <section className="section">
        <h2>{t("section4")}</h2>
        <p>{t("bullet4a")}</p>
        <p>{t("bullet4b")}</p>
        <p>{t("bullet4c")}</p>
      </section>

      {/* 5 — Your rights */}
      <section className="section">
        <h2>{t("section5")}</h2>
        <ul>
          <li>{t("bullet5a")}</li>
          <li>{t("bullet5b")}</li>
          <li>{t("bullet5c")}</li>
        </ul>
        <p>
          {t("contact")}
        </p>
      </section>

      {/* 6 — Third-party services */}
      <section className="section">
        <h2>{t("section6")}</h2>
        <p>{t("bullet6a")}</p>
        <p>{t("bullet6b")}</p>
      </section>

      {/* 7 — Changes */}
      <section className="section">
        <h2>{t("section7")}</h2>
        <p>{t("p7")}</p>
      </section>

      {/* 8 — Contact */}
      <section className="section">
        <h2>{t("section8")}</h2>
        <p>{t("contact")}</p>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;