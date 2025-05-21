import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PredictionResult } from '../types/prediction';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface PredictionGraphProps {
    results: PredictionResult[];
}

const PredictionGraph: React.FC<PredictionGraphProps> = ({ results }) => {
    const data = {
        labels: results.map(result =>
            new Date(result.created_at).toLocaleDateString()
        ),
        datasets: [
            {
                label: 'Aneurysm Probability',
                data: results.map(result =>
                    result.prediction.probabilities.aneurysm * 100
                ),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.3
            },
            {
                label: 'Non-Aneurysm Probability',
                data: results.map(result =>
                    result.prediction.probabilities.non_aneurysm * 100
                ),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value: number | string) {
                        return value + '%';
                    }
                }
            }
        }
    };

    return (
        <div className="prediction-graph">
            <Line options={options} data={data} />
        </div>
    );
};

export default PredictionGraph;