import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { PredictionResult } from '../types/prediction';

// Register required components
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface ShapQuadrantChartProps {
    result: PredictionResult;
}

const ShapQuadrantChart: React.FC<ShapQuadrantChartProps> = ({ result }) => {
    const quadrantScores = result.shap_explanation?.analysis?.relative_importances;

    if (!quadrantScores) return null;

    const data = {
        labels: ['Lower Left', 'Upper Left', 'Lower Right', 'Upper Right'],
        datasets: [{
            label: 'Quadrant Importance (%)',
            data: [
                quadrantScores.lower_left * 100,
                quadrantScores.upper_left * 100,
                quadrantScores.lower_right * 100,
                quadrantScores.upper_right * 100
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20
                }
            }
        }
    };

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <Radar data={data} options={options} />
        </div>
    );
};

export default ShapQuadrantChart;