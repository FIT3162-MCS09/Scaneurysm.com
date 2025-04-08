import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

// Create an axios instance with base configuration
const API: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});



// Skip token for public routes
const publicRoutes = ["/auth/signup/doctor/", "/auth/signup/patient/", "/auth/signin/"];

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
