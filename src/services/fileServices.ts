import API from './apiClient';

const fileServices = {
  async uploadFile(user_id: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('file', file);

    const response = await API.post('/files/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Extract and return the file_url from the response
    if (response.data.file_url) {
      return response.data.file_url;
    }

    throw new Error(`Could not determine file URL from: ${JSON.stringify(response.data)}`);
  },
};

export default fileServices;