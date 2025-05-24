import React from "react";
import { PredictionResult } from "../../types/prediction";
import ResultSummary from "../../components/ResultSummary";

// Loading state component for results summary
const LoadingSummary: React.FC<{ t: any }> = ({ t }) => (
  <div className="summary-loading">
    <h3>{t("summary.title")}</h3>
    <div className="loading-content">
      <div className="loading-spinner" />
      <p>{t("summary.loadingMessage")}</p>
      <p className="loading-subtext">
        {t("summary.loadingSubtext")}
      </p>
    </div>
  </div>
);

// Error state component for results summary
const ErrorSummary: React.FC<{ t: any; error: string }> = ({ t, error }) => (
  <div className="summary-error">
    <h3>{t("summary.title")}</h3>
    <p>{error}</p>
  </div>
);

// Empty state component for results summary
const EmptySummary: React.FC<{ t: any }> = ({ t }) => (
  <div className="summary-empty">
    <h3>{t("summary.title")}</h3>
    <p>{t("summary.noResults")}</p>
  </div>
);

// Results section component
const ResultsSection: React.FC<{
  loading: boolean;
  error: string;
  results: PredictionResult[];
  t: any;
}> = ({ loading, error, results, t }) => {
  if (loading) return <LoadingSummary t={t} />;
  if (error) return <ErrorSummary t={t} error={error} />;
  if (results.length > 0) {
    return (
      <ResultSummary
        latestResult={results[0]}
        totalScans={results.length}
        recentResults={results.slice(0, 5)}
      />
    );
  }
  return <EmptySummary t={t} />;
};

export default ResultsSection;
