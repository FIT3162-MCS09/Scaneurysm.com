// File: src/pages/AboutModel.tsx
import React from "react";
import "./AboutModel.css";
import SidebarPatient from "../components/SidebarPatient";
import Footer from "../components/Footer";

const AboutModel = () => {
    return (
        <div className="about-model-container">
            <SidebarPatient />
            <h1>About the MRI Image Classification Model</h1>
            <section className="section">
                <h2>Purpose of This Website</h2>
                <p>
                    This website is designed to demonstrate the use of machine learning in analyzing MRI images for potential brain aneurysms. It uses a convolutional neural network (CNN) trained on ImageNet to classify images and provide predictions. However, it is important to note that this tool is <strong>not a proper diagnostic tool</strong> and should not be used as a substitute for professional medical advice.
                </p>
            </section>

            <section className="section">
                <h2>How the Model Works</h2>
                <p>
                    The model processes MRI images using a CNN architecture, which is a type of deep learning model commonly used for image classification tasks. The model has been trained on a dataset to identify patterns that may indicate the presence of an aneurysm.
                </p>
                <p>
                    To ensure transparency, the model's predictions are explained using eXplainable AI (XAI) techniques, specifically SHAP (SHapley Additive exPlanations). SHAP provides insights into which parts of the image contributed most to the model's decision, helping users understand the reasoning behind the predictions.
                </p>
            </section>

            <section className="section">
                <h2>Limitations</h2>
                <ul>
                    <li>This tool is not a replacement for professional medical diagnosis.</li>
                    <li>The model's predictions are based on patterns in the training data and may not generalize to all cases.</li>
                    <li>SHAP explanations provide insights into the model's decision-making but do not guarantee accuracy.</li>
                </ul>
                <p>
                    Always consult a qualified healthcare professional for accurate diagnosis and treatment.
                </p>
            </section>
        <Footer />
        </div>
    );
};

export default AboutModel;