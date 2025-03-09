import React from 'react';

interface SummaryBoxProps {
    aneurysmDetected: boolean;
    confidenceScore: number;
    size: number;
    location: string;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ aneurysmDetected, confidenceScore, size, location }) => (
    <div className="summary-box">
        <h3>Analysis Summary</h3>
        <p><strong>Aneurysm Detected:</strong> {aneurysmDetected ? 'Yes' : 'No'}</p>
        <p><strong>Confidence Score:</strong> {confidenceScore}%</p>
        <p><strong>Size of Aneurysm:</strong> {size} mm</p>
        <p><strong>Location:</strong> {location}</p>
    </div>
);

export default SummaryBox;