import API from './apiClient';

interface PredictionRequest {
  id: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  image_url: string;
  prediction?: any;
  shap_explanation?: any;
}

interface PredictionDetailsResponse {
  id: number;
  user: string;
  image_url: string;
  prediction: {
    metadata?: {
      user: string;
      timestamp: string;
      pytorch_version: string;
    };
    confidence?: number;
    prediction?: string;
    probabilities?: {
      aneurysm: number;
      non_aneurysm: number;
    };
    shap_explanation?: {
      status: string;
      analysis?: {
        quadrant_scores: {
          lower_left: number;
          upper_left: number;
          lower_right: number;
          upper_right: number;
        };
        stability_score: number;
        importance_score: number;
        relative_importances: {
          lower_left: number;
          upper_left: number;
          lower_right: number;
          upper_right: number;
        };
        most_important_quadrant: string;
      };
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
    };
  };
  created_at: string;
}

const predictionServices = {
  async create(imageUrl: string): Promise<void> {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");
  await API.post('/analysis/predictions/create/', {
      user: user.id,
      image_url: imageUrl,
      include_shap: true
    });
  },

  async createNoExplanation(imageUrl: string): Promise<string> {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");
    const response = await API.post('/analysis/predictions/create/', {
      user: user.id,
      image_url: imageUrl,
      include_shap: false
    });
    return response.data.id;
  },

  async checkStatus(predictionId: string): Promise<PredictionRequest> {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");
    const response = await API.post('/analysis/predictions/status/', null, {
      params: {
        request_id: predictionId,
        user_id: user.id
      }
    });
    return response.data;
  },

  async manualPollResults(predictionId?: string): Promise<PredictionDetailsResponse> {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");
    const params: Record<string, any> = {
      ...(predictionId && { request_id: predictionId }),
      ...(user.id && { user_id: user.id }),
    };

    const response = await API.post('/analysis/predictions/poll/', { params });

    return response.data;
  },

  async getPredictionDetails(predictionId?: string): Promise<PredictionDetailsResponse> {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");
    const params: Record<string, any> = {
      ...(user.id && { user_id: user.id }),
      ...(predictionId && { request_id: predictionId }),
    };

    await this.manualPollResults(predictionId);

    const response = await API.get('/analysis/predictions/history/', { params });
    return response.data;
  },
};

export default predictionServices;