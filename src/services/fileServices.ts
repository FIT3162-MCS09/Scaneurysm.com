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

    // Case 1: If response contains direct URL
    if (response.data.image_url) {
      return response.data.image_url;
    }

    // Case 2: If response is just success message
    if (response.data.message === "File uploaded successfully") {
      // Construct URL using known API pattern
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `upload_${user_id}_${timestamp}.${fileExt}`;
      return `${process.env.REACT_APP_API_URL}/uploads/${fileName}`;
    }

    // Case 3: If URL is in another field
    const possibleUrlFields = ['url', 'location', 'file_url'];
    for (const field of possibleUrlFields) {
      if (response.data[field]) {
        return response.data[field];
      }
    }

    throw new Error(`Could not determine image URL from: ${JSON.stringify(response.data)}`);
  },
};

export default fileServices;