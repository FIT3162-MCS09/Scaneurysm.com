import axios from 'axios';

// Create an axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add interceptor to include JWT token in requests
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Authentication services
const authService = {
  // Login function
  login: async (username, password) => {
    try {
      const response = await API.post('/auth/signin/', { username, password });
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_info', JSON.stringify({
        id: response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role
      }));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout function
  logout: async () => {
    try {
      await API.post('/logout/');
      // Clean up local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      return { message: 'Logout successful' };
    } catch (error) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  // Register as patient
  registerPatient: async (userData) => {
    try {
      const response = await API.post('/patient/signup/', userData);
      // Store tokens after successful registration
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_info', JSON.stringify({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: 'patient'
      }));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Register as doctor
  registerDoctor: async (userData) => {
    try {
      const response = await API.post('/doctor/signup/', userData);
      // Store tokens after successful registration
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_info', JSON.stringify({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: 'doctor'
      }));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Get current user info from localStorage
  getCurrentUser: () => {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};

export default authService;