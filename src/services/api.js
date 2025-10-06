import axios from 'axios';
const API_BASE_URL = 'https://mad-backend-5ijo.onrender.com/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  getSessions: () => api.get('/auth/sessions'),
  logout: () => api.post('/auth/logout'),
};
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
export const shuttleAPI = {
  getDrivers: () => api.get('/shuttle'),
};
export const feedbackAPI = {
  submitFeedback: (feedbackData) => api.post('/feedback', feedbackData),
};

export default api;
