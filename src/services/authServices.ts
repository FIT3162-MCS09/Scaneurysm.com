import API from './apiClient';

// Interfaces for patient registration
interface UserData {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  medical_record_number: string;
  birth_date: string;
  sex: string;
  primary_doctor: string;
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
  register: async (userData: UserData): Promise<RegisterResponse> => {
    try {
      const formData = new URLSearchParams();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await API.post<RegisterResponse>('/auth/signup/patient/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

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

  login: async (username: string, password: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await API.post('/auth/signin/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_info', JSON.stringify({
        id: response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role
      }));

      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },
};

// Interfaces for doctor registration
interface DoctorSignupData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  license_number: string;
  specialty: string;
}

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

interface DoctorUserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

const doctorService = {
  signup: async (doctorData: DoctorSignupData): Promise<DoctorSignupResponse> => {
    try {
      const formData = new URLSearchParams();
      Object.entries(doctorData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await API.post<DoctorSignupResponse>('/auth/signup/doctor/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

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

  getProfile: async (doctorId: string) => {
    try {
      const response = await API.get(`/doctors/${doctorId}/`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch doctor profile' };
    }
  },

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
