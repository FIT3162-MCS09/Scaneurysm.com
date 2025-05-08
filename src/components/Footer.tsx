import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer-bar">
            <div className="footer-left">
                <a href="#"><i className="fas fa-comment-alt"></i> Give us feedback</a>
                <a href="#"><i className="fas fa-user-shield"></i> Privacy Policy</a>
                <a href="/about"><i className="fas fa-info-circle"></i> About Aneurysm</a>
                <a href="https://github.com/FIT3162-MCS09" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i> GitHub
                </a>
            </div>
            <div className="footer-center">
                <strong><i className="fas fa-phone-alt"></i> Emergency Help</strong>
                <p>📞 +60 1234567</p>
            </div>
            <div className="footer-right">
                <strong><i className="fas fa-share-alt"></i> Connect with us!</strong>
                <div className="social-icons">
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;