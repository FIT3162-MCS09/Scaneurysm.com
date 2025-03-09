import React from 'react';

interface ImagePanelProps {
    title: string;
    imageSrc: string;
    altText: string;
}

const ImagePanel: React.FC<ImagePanelProps> = ({ title, imageSrc, altText }) => (
    <div className="image-panel">
        <h3>{title}</h3>
        <img src={imageSrc} alt={altText} />
    </div>
);

export default ImagePanel;