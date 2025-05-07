// File: src/pages/AboutAneurysm.tsx
import React from "react";
import "./AboutAneurysm.css";

const AboutAneurysm = () => {
  return (
    <div className="about-container">
      <h1>About Brain Aneurysms</h1>
      <section className="section">
        <h2>What is a Brain Aneurysm?</h2>
        <p>
          A brain aneurysm is a bulge or ballooning in a blood vessel in the brain. It can leak or rupture, causing bleeding into the brain (hemorrhagic stroke). Often, brain aneurysms don’t show symptoms until they rupture.
        </p>
        <img src="/images/aneurysm-diagram.png" alt="Brain aneurysm diagram" className="infographic" />
      </section>

      <section className="section">
        <h2>Signs and Symptoms</h2>
        <ul>
          <li>Sudden severe headache (worst of your life)</li>
          <li>Blurred or double vision</li>
          <li>Neck pain or stiffness</li>
          <li>Sensitivity to light</li>
          <li>Seizure or confusion</li>
          <li>Drooping eyelid</li>
        </ul>
        
      </section>

      <section className="section">
        <h2>Prevention Tips</h2>
        <ul>
          <li>Avoid smoking and excessive alcohol</li>
          <li>Manage blood pressure</li>
          <li>Exercise regularly</li>
          <li>Eat a healthy, low-fat diet</li>
          <li>Get regular medical checkups if at risk</li>
        </ul>
        
      </section>

      <footer className="footer-bar">
        <div className="footer-left">
          <a href="#">Give us feedback</a>
          <a href="#">Privacy Policy</a>
          <a href="/about">About Aneurysm</a>
        </div>
        <div className="footer-center">
          <strong>Emergency Help</strong>
          <p>📞 +60 1234567</p>
        </div>
        <div className="footer-right">
          <strong>Connect with us!</strong>
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
