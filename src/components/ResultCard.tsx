import React from "react";
import { useTranslation } from "react-i18next";
import ShapQuadrantChart from "./ShapQuadrantChart";

interface ResultCardProps {
  result: any;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { t } = useTranslation("result");

  return (
    <div className="result-card">
      <h2>Result ID: {result.id}</h2>

      <div className="prediction-section">
        <h3>{t('aiPrediction')}</h3>
        <div className="prediction-card">
          <p className={result.prediction?.prediction === "Aneurysm" ? "positive" : "negative"}>
            {result.prediction?.prediction === "Aneurysm" ? t('aneurysmDetected') : t('noAneurysm')}
          </p>
          {result.prediction?.confidence && (
            <p>{t('confidence')}: {(result.prediction.confidence * 100).toFixed(1)}%</p>
          )}
          {result.prediction?.probabilities && (
            <div>
              <p>{t('aneurysmProbability')}: {(result.prediction.probabilities.aneurysm * 100).toFixed(1)}%</p>
              <p>{t('nonAneurysmProbability')}: {(result.prediction.probabilities.non_aneurysm * 100).toFixed(1)}%</p>
            </div>
          )}
        </div>
      </div>

      {result.shap_explanation && (
        <div className="explanation-section">
          <h3>{t('aiExplanation')}</h3>
          {result.shap_explanation.status === "processing" ? (
            <p>{t('shapProcessing')}</p>
          ) : (
            <div className="shap-visualization">
              <div className="visualization-container">
                <div className="chart-container">
                  <h4>{t('quadrantAnalysis')}</h4>
                  <ShapQuadrantChart result={result} />
                </div>
                <div className="scores-container">
                  <h4>{t('stabilityScore')}:</h4>
                  <p>{result.shap_explanation.analysis.stability_score.toFixed(3)}</p>
                  <h4>{t('importanceScore')}:</h4>
                  <p>{result.shap_explanation.analysis.importance_score.toFixed(6)}</p>
                  <h4>{t('mostImportantQuadrant')}:</h4>
                  <p>{result.shap_explanation.analysis.most_important_quadrant}</p>
                </div>
              </div>
              {result.shap_explanation.visualization?.url && (
                <div className="shap-image">
                  <h4>{t('visualization')}:</h4>
                  <img
                    className="visualization-image"
                    src={result.shap_explanation.visualization.url}
                    alt="SHAP Analysis Visualization"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {result.prediction?.metadata && (
        <div className="metadata-section">
          <h3>{t('metadata')}</h3>
          <p>{t('timestamp')}: {result.prediction.metadata.timestamp}</p>
          <p>{t('pytorchVersion')}: {result.prediction.metadata.pytorch_version}</p>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
