import API from './apiClient';

interface PredictionResponse {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  image_url: string;
  prediction?: any;
  shap_explanation?: any;
}

const predictionServices = {
  async create(imageUrl: string): Promise<string> {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");
    const response = await API.post('/analysis/predictions/create/', {
      user: user.id,
      image_url: imageUrl,
      include_shap: true
    });
    return response.data.id;
  },

  async checkStatus(predictionId: string): Promise<PredictionResponse> {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");
    const response = await API.post('/analysis/predictions/status/', null, {
      params: {
        request_id: predictionId,
        user_id: user.id
      }
    });
    return response.data;
  },

  async pollUntilComplete(predictionId: string): Promise<PredictionResponse> {
    const maxAttempts = 30;
    const delay = 2000;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await this.checkStatus(predictionId);
      
      if (result.status === 'COMPLETED') return result;
      if (result.status === 'FAILED') throw new Error('Prediction failed');
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    throw new Error('Prediction timed out');
  }
};

export default predictionServices;