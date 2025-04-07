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
      const response = await API.post<RegisterResponse>('/auth/signup/patient/', userData);
      // Store tokens after successful registration
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      const userInfo: UserInfo = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: 'patient',
      };

      localStorage.setItem('user_info', JSON.stringify(userInfo));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Add other patient-specific methods here
};

// Interface for doctor registration data
interface DoctorSignupData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  license_number: string;
  specialty: string;
}

// Interface for API response
interface DoctorSignupResponse {
  id: string;
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  license_number: string;
  specialty: string;
  access: string;
  refresh: string;
}

// Interface for user info to store in localStorage
interface DoctorUserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

const doctorService = {
  // Register as doctor
  signup: async (doctorData: DoctorSignupData): Promise<DoctorSignupResponse> => {
    try {
      const response = await API.post<DoctorSignupResponse>('/auth/signup/patient/', doctorData);

      // Store tokens after successful registration
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      const userInfo: DoctorUserInfo = {
        id: response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        role: 'doctor',
        first_name: response.data.first_name,
        last_name: response.data.last_name,
      };

      localStorage.setItem('user_info', JSON.stringify(userInfo));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Doctor registration failed' };
    }
  },

  // Get doctor profile
  getProfile: async (doctorId: string) => {
    try {
      const response = await API.get(`/doctors/${doctorId}/`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch doctor profile' };
    }
  },

  // Update doctor profile
  updateProfile: async (doctorId: string, profileData: Partial<DoctorSignupData>) => {
    try {
      const response = await API.patch(`/doctors/${doctorId}/`, profileData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update doctor profile' };
    }
  },
};

// Use named exports instead of default exports
export { patientService, doctorService };