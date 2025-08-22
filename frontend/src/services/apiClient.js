import axios from 'axios';
import { API_BASE_URL } from '../constants';

// Create axios instance với config cơ bản
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - có thể thêm auth token sau
apiClient.interceptors.request.use(
  (config) => {
    // Có thể thêm authorization header ở đây
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
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
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Xử lý các loại error phổ biến
    if (error.response?.status === 401) {
      // Unauthorized - có thể redirect về login
      console.error('Unauthorized access');
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status === 500) {
      // Server error
      console.error('Internal server error');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
