import API from './apiClient';

interface FileUploadRequest {
  user_id: number;
  file: string | File;
}

interface FileUploadResponse {
  message: string;
}

interface FileViewResponse {
  file_urls: string[];
}

const fileServices = {
  /**
   * Upload a file to the server
   * @param fileData - Object containing user_id and file 
   * @returns Promise with success message on successful upload
   */
  uploadFile: async (fileData: FileUploadRequest): Promise<FileUploadResponse> => {
    try {
      if (!(fileData.file instanceof File)) {
        throw new Error('Invalid file type. Expected a File object.');
      }

      const requestData = new FormData();
      requestData.append('user_id', fileData.user_id.toString());
      requestData.append('file', fileData.file);

      const response = await API.post<FileUploadResponse>('/files/upload/', requestData, {
        headers: {
          // Explicitly remove Content-Type to let browser set it with boundary
          'Content-Type': undefined,
          // Add this to ensure the browser handles the form data properly
          'Accept': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw { message: 'Server error occurred during file upload', status: 500 };
      }
      throw error.response?.data || { message: 'File upload failed' };
    }
  },
  
  /**
   * Retrieve file URLs for a specific user
   * @param userId - ID of the user to retrieve files for
   * @returns Promise with array of file URLs
   */
  getFileUrls: async (userId: number): Promise<FileViewResponse> => {
    try {
      const response = await API.get<FileViewResponse>(`/files/view/`, {
        params: { user_id: userId }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw { message: 'Bad request: Invalid user ID', status: 400 };
      }
      throw error.response?.data || { message: 'Failed to retrieve file URLs' };
    }
  },
  
  // Additional file-related methods can be added here
};

export default fileServices;