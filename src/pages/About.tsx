import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";
import SidebarPatient from "../components/SidebarPatient";
import Footer from "../components/Footer";

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-model-container">
            <SidebarPatient />
            <h1>About Information</h1>
            <div className="navigation-cards">
                <div
                    className="card"
                    onClick={() => navigate("/about-aneurysm")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate("/about-aneurysm")}
                >
                    <h3>About Aneurysm</h3>
                    <p>Learn more about brain aneurysms, their symptoms, and prevention.</p>
                </div>
                <div
                    className="card"
                    onClick={() => navigate("/about-model")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate("/about-model")}
                >
                    <h3>About the MRI Image Classification Model</h3>
                    <p>Discover how the MRI Image Classification Model works and its limitations.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;