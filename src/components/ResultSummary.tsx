import React from 'react';
import { useTranslation } from 'react-i18next';
import { PredictionResult } from '../types/prediction';
import PredictionGraph from './PredictionGraph';

interface ResultSummaryProps {
    latestResult: PredictionResult;
    totalScans: number;
    recentResults: PredictionResult[];
}

const ResultSummary: React.FC<ResultSummaryProps> = ({
                                                         latestResult,
                                                         totalScans,
                                                         recentResults
                                                     }) => {
    const { t } = useTranslation('resultSummary');

    const getConfidenceLevel = (confidence: number): string => {
        if (confidence >= 0.8) return 'high';
        if (confidence >= 0.6) return 'moderate';
        return 'low';
    };

    const mapPredictionToKey = (prediction: string): string => {
        const lowercasePrediction = prediction.toLowerCase();
        if (lowercasePrediction === 'aneurysm') return 'positive';
        if (lowercasePrediction === 'non-aneurysm') return 'negative';
        return 'inconclusive';
    };

    return (
        <div className="result-summary">
            <h3>{t('title')}</h3>

            <div className="summary-stats">
                <div className="stat-box">
                    <span className="stat-label">{t('totalScans')}</span>
                    <span className="stat-value">{totalScans}</span>
                </div>

                <div className="stat-box">
                    <span className="stat-label">{t('latestScan')}</span>
                    <span className="stat-value">
                        {new Date(latestResult.created_at).toLocaleDateString()}
                    </span>
                </div>

                <div className={`stat-box prediction ${
                    latestResult.prediction.prediction.toLowerCase()
                }`}>
                    <span className="stat-label">{t('result')}</span>
                    <span className="stat-value">
                            {t(`prediction.${mapPredictionToKey(latestResult.prediction.prediction)}`)}
                        <span className="confidence">
                            {(latestResult.prediction.confidence * 100).toFixed(1)}%
                            ({t(`confidence.${getConfidenceLevel(latestResult.prediction.confidence)}`)})
                        </span>
                    </span>
                </div>
            </div>

            {recentResults.length > 1 && (
                <>
                    <div className="prediction-trends">
                        <h4>{t('trends')}</h4>
                        <PredictionGraph results={[...recentResults].reverse()} />
                    </div>
                    <div className="recent-scans">
                        <h4>{t('recentScans')}</h4>
                        <div className="recent-list">
                            {recentResults.slice(1).map(result => (
                                <div key={result.id} className="recent-item">
                                    <span className="date">
                                        {new Date(result.created_at).toLocaleDateString()}
                                    </span>
                                    <span className={`prediction ${
                                        result.prediction.prediction.toLowerCase()
                                    }`}>
                                        {t(`prediction.${mapPredictionToKey(result.prediction.prediction)}`)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ResultSummary;