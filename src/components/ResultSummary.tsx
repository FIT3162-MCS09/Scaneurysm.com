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
    const { t } = useTranslation('dashboard');

    const getConfidenceLevel = (confidence: number): string => {
        if (confidence >= 0.8) return 'high';
        if (confidence >= 0.6) return 'moderate';
        return 'low';
    };

    return (
        <div className="result-summary">
            <h3>{t('summary.title')}</h3>

            <div className="summary-stats">
                <div className="stat-box">
                    <span className="stat-label">{t('summary.totalScans')}</span>
                    <span className="stat-value">{totalScans}</span>
                </div>

                <div className="stat-box">
                    <span className="stat-label">{t('summary.latestScan')}</span>
                    <span className="stat-value">
                        {new Date(latestResult.created_at).toLocaleDateString()}
                    </span>
                </div>

                <div className={`stat-box prediction ${
                    latestResult.prediction.prediction.toLowerCase()
                }`}>
                    <span className="stat-label">{t('summary.result')}</span>
                    <span className="stat-value">
                        {t(`prediction.${latestResult.prediction.prediction.toLowerCase()}`)}
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
                        <h4>{t('summary.trends')}</h4>
                        <PredictionGraph results={[...recentResults].reverse()} />
                    </div>
                    <div className="recent-scans">
                        <h4>{t('summary.recentScans')}</h4>
                        <div className="recent-list">
                            {recentResults.slice(1).map(result => (
                                <div key={result.id} className="recent-item">
                                    <span className="date">
                                        {new Date(result.created_at).toLocaleDateString()}
                                    </span>
                                    <span className={`prediction ${
                                        result.prediction.prediction.toLowerCase()
                                    }`}>
                                        {t(`prediction.${result.prediction.prediction.toLowerCase()}`)}
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