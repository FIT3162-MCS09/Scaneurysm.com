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
      // Handle file upload - if 'file' is a File object, we need to use FormData
      let requestData: FileUploadRequest | FormData = fileData;
      
      if (fileData.file instanceof File) {
        const formData = new FormData();
        formData.append('user_id', fileData.user_id.toString());
        formData.append('file', fileData.file);
        requestData = formData;
      }
      
      const response = await API.post<FileUploadResponse>('/api/files/upload', requestData, {
        headers: {
          // If using FormData, let the browser set the correct Content-Type
          ...(!(fileData.file instanceof File) && { 'Content-Type': 'application/json' })
        }
      });
      
      // A successful response should have status 200
      return response.data;
    } catch (error: any) {
      // Handle potential errors - 500 is a server error
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
      const response = await API.get<FileViewResponse>(`/api/files/view/`, {
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