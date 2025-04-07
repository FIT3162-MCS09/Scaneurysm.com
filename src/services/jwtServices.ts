import API from './apiClient';

interface TokenResponse {
  access: string;
  refresh: string;
}

interface RefreshTokenRequest {
  refresh: string;
}

const jwtServices = {
  /**
   * Obtain a new pair of access and refresh tokens
   * @param username - The username of the user
   * @param password - The password of the user
   * @returns Promise with access and refresh tokens
   */
  obtainToken: async (username: string, password: string): Promise<TokenResponse> => {
    try {
      const response = await API.post<TokenResponse>('/jwt/token/', { username, password });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to obtain token' };
    }
  },

  /**
   * Refresh the access token using the refresh token
   * @param refreshToken - The refresh token
   * @returns Promise with a new access token
   */
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    try {
      const response = await API.post<{ access: string }>('/jwt/token/refresh/', { refresh: refreshToken });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to refresh token' };
    }
  },
};

export default jwtServices;