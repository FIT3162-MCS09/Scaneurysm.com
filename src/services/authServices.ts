// Updated authServices.ts
import API from './apiClient';

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

      await authService.fetchUserProfile();

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

      await authService.fetchUserProfile();

      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },
};

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

      await authService.fetchUserProfile();

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

const authService = {
  fetchUserProfile: async () => {
    try {
      const res = await API.get('/auth/profile/');

      const userInfo: UserInfo = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        role: res.data.role,
      };

      localStorage.setItem('user_info', JSON.stringify(userInfo));
      return userInfo;
    } catch (err: any) {
      console.error("Failed to fetch user profile:", err);
      throw err.response?.data || { message: 'Failed to fetch user profile' };
    }
  }
};

export { patientService, doctorService, authService };
