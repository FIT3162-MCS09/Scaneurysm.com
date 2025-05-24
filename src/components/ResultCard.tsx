import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ShapQuadrantChart from "./ShapQuadrantChart";
import "./ResultCard.css";

interface ResultCardProps {
  result: any;
}

// PredictionSection component
const PredictionSection: React.FC<{ prediction: any }> = ({ prediction }) => {
  const { t } = useTranslation("result");

  if (!prediction) return null;

  return (
    <div className="prediction-section">
      <h3>{t('aiPrediction')}</h3>
      <div className="prediction-card">
        <p className={prediction.prediction === "Aneurysm" ? "positive" : "negative"}>
          {prediction.prediction === "Aneurysm" ? t('aneurysmDetected') : t('noAneurysm')}
        </p>
        {prediction.confidence && (
          <p>{t('confidence')}: {(prediction.confidence * 100).toFixed(1)}%</p>
        )}
        {prediction.probabilities && (
          <div>
            <p>{t('aneurysmProbability')}: {(prediction.probabilities.aneurysm * 100).toFixed(1)}%</p>
            <p>{t('nonAneurysmProbability')}: {(prediction.probabilities.non_aneurysm * 100).toFixed(1)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ShapVisualization component
const ShapVisualization: React.FC<{ 
  result: any, 
  onExpandVisualization: () => void 
}> = ({ result, onExpandVisualization }) => {
  const { t } = useTranslation("result");
  
  return (
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
            onClick={onExpandVisualization}
          />
        </div>
      )}
    </div>
  );
};

// ExplanationSection component
const ExplanationSection: React.FC<{ 
  shapExplanation: any, 
  result: any,
  onExpandVisualization: () => void 
}> = ({ shapExplanation, result, onExpandVisualization }) => {
  const { t } = useTranslation("result");

  return (
    <div className="explanation-section">
      <h3>{t('aiExplanation')}</h3>
      {shapExplanation.status === "processing" ? (
        <p>{t('shapProcessing')}</p>
      ) : (
        <ShapVisualization 
          result={result} 
          onExpandVisualization={onExpandVisualization} 
        />
      )}
    </div>
  );
};

// MetadataSection component
const MetadataSection: React.FC<{ metadata: any }> = ({ metadata }) => {
  const { t } = useTranslation("result");

  if (!metadata) return null;

  return (
    <div className="metadata-section">
      <h3>{t('metadata')}</h3>
      <p>{t('timestamp')}: {metadata.timestamp}</p>
      <p>{t('pytorchVersion')}: {metadata.pytorch_version}</p>
    </div>
  );
};

// VisualizationOverlay component
const VisualizationOverlay: React.FC<{
  imageUrl: string,
  onClose: () => void
}> = ({ imageUrl, onClose }) => {
  // Function to handle clicks on the overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click is directly on the overlay, not on its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fullscreen-overlay"
      onClick={handleOverlayClick}
    >
      <div className="overlay-content">
        <button 
          className="close-button"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          className="fullscreen-image"
          src={imageUrl}
          alt="SHAP Analysis Visualization (Fullscreen)"
        />
      </div>
    </div>
  );
};

// Main ResultCard component
const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [expandedVisualization, setExpandedVisualization] = useState<boolean>(false);

  const handleExpandVisualization = () => {
    setExpandedVisualization(true);
  };

  const handleCloseVisualization = () => {
    setExpandedVisualization(false);
  };

  return (
    <div className="result-card">
      <h2>Result ID: {result.id}</h2>

      <PredictionSection prediction={result.prediction} />

      {result.shap_explanation && (
        <ExplanationSection 
          shapExplanation={result.shap_explanation} 
          result={result}
          onExpandVisualization={handleExpandVisualization}
        />
      )}

      {result.prediction?.metadata && (
        <MetadataSection metadata={result.prediction.metadata} />
      )}

      {expandedVisualization && result.shap_explanation?.visualization?.url && (
        <VisualizationOverlay
          imageUrl={result.shap_explanation.visualization.url}
          onClose={handleCloseVisualization}
        />
      )}
    </div>
  );
};

export default ResultCard;
