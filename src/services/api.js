import axios from 'axios';

// Backend API base URL - adjust this to match your backend server
const API_BASE_URL = 'https://mad-backend-5ijo.onrender.com/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  getSessions: () => api.get('/auth/sessions'),
  logout: () => api.post('/auth/logout'),
};

// Menu API
export const menuAPI = {
  getAllMenus: () => api.get('/menu/all'),
  getMenuByDay: (day) => api.get(`/menu/${day}`),
  uploadMenu: (menuData) => api.post('/menu/item', menuData),
  uploadMenuFile: (file) => {
    const formData = new FormData();
    formData.append('menuFile', file);
    return api.post('/menu/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  testUpload: (file) => {
    const formData = new FormData();
    formData.append('testFile', file);
    return api.post('/menu/test-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Shuttle API
export const shuttleAPI = {
  // Add shuttle-related API calls here based on your backend routes
  getDrivers: () => api.get('/shuttle'), // Updated to match actual backend endpoint
};

// Feedback API
export const feedbackAPI = {
  // Add feedback-related API calls here based on your backend routes
  submitFeedback: (feedbackData) => api.post('/feedback', feedbackData),
};

export default api;
