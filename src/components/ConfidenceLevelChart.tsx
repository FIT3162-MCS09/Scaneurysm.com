import React from 'react';
import { Pie } from 'react-chartjs-2';
import { PredictionResult } from '../types/prediction';

interface ConfidenceLevelChartProps {
    results: PredictionResult[];
}

const ConfidenceLevelChart: React.FC<ConfidenceLevelChartProps> = ({ results }) => {
    const confidenceLevels = results.reduce((acc: Record<string, number>, result) => {
        const confidence = result.prediction.confidence;
        const level = confidence >= 0.8 ? 'High' : confidence >= 0.6 ? 'Moderate' : 'Low';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});

    const data = {
        labels: Object.keys(confidenceLevels),
        datasets: [{
            data: Object.values(confidenceLevels),
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)'
            ]
        }]
    };

    return <Pie data={data} />;
};

export default ConfidenceLevelChart;