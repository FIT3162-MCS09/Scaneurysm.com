import API from './apiClient';

interface PredictionResponse {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  image_url: string;
  prediction?: any;
  shap_explanation?: any;
}

const predictionServices = {
  async createPrediction(imageUrl: string): Promise<{ id: string }> {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");
    const response = await API.post('/analysis/predictions/create/', {
      image_url: imageUrl,
      user: user.id
    });
    return response.data;
  },

  async getPrediction(id: string): Promise<PredictionResponse> {
    const response = await API.get(`/analysis/predictions/${id}/`);
    return response.data;
  },

  async pollPrediction(id: string, interval = 2000, maxAttempts = 30): Promise<PredictionResponse> {
    let attempts = 0;
    
    const checkStatus = async (): Promise<PredictionResponse> => {
      attempts++;
      const result = await this.getPrediction(id);
      
      if (result.status === 'COMPLETED') {
        return result;
      } else if (result.status === 'FAILED') {
        throw new Error('Prediction processing failed');
      } else if (attempts >= maxAttempts) {
        throw new Error('Prediction timeout');
      } else {
        await new Promise(resolve => setTimeout(resolve, interval));
        return checkStatus();
      }
    };

    return checkStatus();
  }
};

export default predictionServices;