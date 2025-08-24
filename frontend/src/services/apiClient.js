import axios from 'axios';
import { API_BASE_URL } from '../constants';

// Create axios instance với config cơ bản
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Giảm timeout từ 10s xuống 5s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm auth token
apiClient.interceptors.request.use(
  (config) => {
    // Thêm authorization header
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý error response
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.response?.data);
    
    // Xử lý 401 Unauthorized - redirect về login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
