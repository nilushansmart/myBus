import axios from 'axios';

// Dynamically resolve base API URL: prefer Vite env variable, fallback to default port 8080
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mybus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('mybus_token');
        localStorage.removeItem('mybus_user');
      }
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const customError = new Error(message);
    customError.response = error.response;
    customError.validationErrors = error.response?.data?.data || {};
    return Promise.reject(customError);
  }
);

export default api;
