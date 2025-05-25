import API from './apiClient';

const genAiService = {
    async getLatestGeneratedAiReport() {
        try {
            const response = await API.get(`/genai/reports/latest/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching latest AI report:', error);
            throw error;
        }
    }
}

export default genAiService;
