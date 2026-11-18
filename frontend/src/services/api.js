import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from localStorage if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('iem_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response payload or error message
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred.',
      errorCode: error.response?.data?.errorCode || 'NETWORK_ERROR',
      errors: error.response?.data?.errors || null,
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

export default api;
