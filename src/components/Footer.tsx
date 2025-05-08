import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
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
    );
};

export default Footer;