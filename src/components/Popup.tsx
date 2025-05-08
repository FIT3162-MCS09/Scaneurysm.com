import React from "react";
import "./Popup.css";

interface PopupProps {
    message: string;
    onClose: () => void;
    onAction: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose, onAction }) => {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <p>{message}</p>
                <div className="popup-actions">
                    <button onClick={onAction}>Go to Login</button>
                </div>
            </div>
        </div>
    );
};

export default Popup;