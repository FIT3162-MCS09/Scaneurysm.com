import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

console.log("Base API URL:", process.env.REACT_APP_API_URL);
// Create an axios instance with base configuration
const API: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Add this for CORS with credentials
  headers: {
    'Content-Type': 'application/json',
  }
});




// Skip token for public routes
const publicRoutes = ["/auth/signup/doctor/", "/auth/signup/patient/", "/auth/signin/"];

// Add interceptor to include JWT token in requests

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const requiresAuth = !publicRoutes.some(route => config.url?.includes(route));
    
    if (requiresAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

export default API;
