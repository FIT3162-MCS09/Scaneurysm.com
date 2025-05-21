// types/prediction.ts
export interface PredictionMetadata {
    user: string;
    timestamp: string;
    pytorch_version: string;
}

export interface Probabilities {
    aneurysm: number;
    non_aneurysm: number;
}

export interface Prediction {
    metadata: PredictionMetadata;
    confidence: number;
    prediction: "aneurysm" | "Non-aneurysm";
    probabilities: Probabilities;
}

export interface ShapAnalysis {
    quadrant_scores: Record<string, number>;
    stability_score: number;
    importance_score: number;
    relative_importances: Record<string, number>;
    most_important_quadrant: string;
}

export interface ShapExplanation {
    status: "completed" | "processing";
    analysis?: ShapAnalysis;
    metadata?: {
        end_time: string;
        start_time: string;
        analysis_duration: number;
    };
    prediction?: {
        result: string;
        confidence: number;
        confidence_level: string;
    };
    request_id: string;
    visualization?: {
        url: string;
    };
    completion_time?: string;
    timestamp?: string;
}

export interface PredictionResult {
    id: number;
    user: string;
    image_url: string;
    prediction: Prediction;
    created_at: string;
    shap_explanation: ShapExplanation;
}