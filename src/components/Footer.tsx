import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer-bar">
            <div className="footer-left">
                <a href="#"><i className="fas fa-comment-alt"></i> Give us feedback</a> 
                <a href="/privacy"><i className="fas fa-user-shield"></i> Privacy Policy</a>
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
                <a href="/about-us"><i className="fas fa-users"></i> About&nbsp;Us</a>
            </div>
        </footer>
    );
};

export default Footer;