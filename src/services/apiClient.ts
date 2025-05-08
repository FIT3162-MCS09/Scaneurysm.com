import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";

const API: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const publicRoutes = ["/auth/signup/doctor/", "/auth/signup/patient/", "/auth/signin/"];

API.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const requiresAuth = !publicRoutes.some((route) => config.url?.includes(route));

        if (requiresAuth) {
            const token = localStorage.getItem("access_token");
            if (token) {
                config.headers.set("Authorization", `Bearer ${token}`);
            }
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

export default API;