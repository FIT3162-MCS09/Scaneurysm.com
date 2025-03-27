import API from './apiClient';

interface UserData {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  [key: string]: any;
}

interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  access: string;
  refresh: string;
  [key: string]: any;
}

interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
}

const patientService = {
  // Register as patient
  register: async (userData: UserData): Promise<RegisterResponse> => {
    try {
      const response = await API.post<RegisterResponse>('/patient/signup/', userData);
      // Store tokens after successful registration
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      const userInfo: UserInfo = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: 'patient'
      };
      
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },
  
  // Add other patient-specific methods here
};

export default patientService;