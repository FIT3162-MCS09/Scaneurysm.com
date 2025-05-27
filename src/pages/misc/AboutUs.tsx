// src/pages/AboutUs.tsx
// -----------------------------------------------------------------------------
// “About Us” — project & team story
// -----------------------------------------------------------------------------
import React        from "react";
import "./AboutUs.css";

import Sidebar from "../../components/Sidebar";
import Footer         from "../../components/Footer";

const AboutUs: React.FC = () => (
    <div className="about-us-container">
        <Sidebar />

        {/* ─── Hero ─────────────────────────────────────────────── */}
        <header className="hero">
            <h1>About our Team</h1>
            <p>
                We are final-year <strong>Monash University Malaysia</strong> students studying Advanced Computer Science.
                Our goal was to develop a product for the medical sector that can help make it easier for medical professionals to save lives, and <strong>Scaneurysm</strong> is the product of that vision
            </p>
        </header>

        {/* ─── Team ─────────────────────────────────────────────── */}
        <section className="section team">
            <h2>Meet the Team</h2>

            {/* Replace the placeholder with your real group photo later */}
            {/*<img*/}
            {/*    src="/images/team-placeholder.jpg"*/}
            {/*    alt="Kemala, Daiyaan, Shaquille & Rajkamal"*/}
            {/*    className="team-photo"*/}
            {/*/>*/}

            <ul className="team-list">
                <li><strong>Kemala Aryne Rakhman</strong> — Team&nbsp;Leader &amp; AI&nbsp;Development</li>
                <li><strong>Daiyaan Murshed Chowdhury</strong> — Front-End Development &amp; UI/UX&nbsp;Design</li>
                <li><strong>Sayyidina Shaquille Malcolm</strong> — Back-End Engineering &amp; API&nbsp;Services</li>
                <li><strong>Rajkamal Chakraborty Arghya</strong> — SHAP Explainability &amp; Model&nbsp;Visualisation</li>
            </ul>

            <p className="supervisor">
                Supervised by&nbsp;
                <strong>Dr Sicily Ting Fung Fung</strong>, School of Information Technology,
                Monash University Malaysia.
            </p>
        </section>

        {/* ─── Mission ──────────────────────────────────────────── */}
        <section className="section">
            <h2>Our Mission</h2>
            <p>
                Brain-aneurysm rupture is sudden and often fatal. Early detection saves lives,
                yet access to experienced neuroradiologists is scarce in many regions.
                <strong> Scaneurysm </strong> harnesses deep-learning to screen MRI scans for
                aneurysms <em>and</em> explains its findings so clinicians can act with confidence.
            </p>
        </section>

        {/* ─── What the site does ───────────────────────────────── */}
        <section className="section">
            <h2>What This Website Offers</h2>
            <ul>
                <li>Secure upload of brain-MRI images (no patient identifiers required).</li>
                <li>Prediction—<em>aneurysm / non-aneurysm</em>—in seconds.</li>
                <li>Interactive SHAP heat-maps that show <em>why</em> the model decided so.</li>
                <li>A “Find Hospitals” tool to locate nearby neurosurgical centres.</li>
            </ul>
        </section>

        {/* ─── Tech stack ───────────────────────────────────────── */}
        <section className="section">
            <h2>Technology Stack</h2>
            <p>
                React + Vite front-end • FastAPI REST back-end • PyTorch CNN model •
                AWS S3, Lambda &amp; SageMaker for secure inference • PostgreSQL for metadata •
                GitHub Actions CI/CD.
            </p>
        </section>

        {/* ─── Milestones / roadmap ─────────────────────────────── */}
        <section className="section">
            <h2>Looking Ahead</h2>
            <p>
                Next milestones: external clinical validation with local hospitals,
                multi-modality support (CTA & MRA), and open-sourcing our reproducible pipeline
                to accelerate research collaborations.
            </p>
        </section>


        <Footer />
    </div>
);

export default AboutUs;