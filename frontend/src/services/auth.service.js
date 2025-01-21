import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Request new access token using refresh token
      const response = await axios.post(
        `${API_URL}/refresh-token`,
        {},
        { withCredentials: true }
      );

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);

      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axios(originalRequest);
    } catch (refreshError) {
      // If refresh token is invalid, logout user
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      return { success: true, user: response.data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      return { success: true, user: response.data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  verifyToken: async () => {
    try {
      const response = await api.get('/verify-token');
      return { success: true, user: response.data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Token verification failed' 
      };
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/verify-email/${token}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Email verification failed' 
      };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Password reset request failed' 
      };
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/reset-password/${token}`, { password });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Password reset failed' 
      };
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('accessToken');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Logout failed' 
      };
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/refresh-token');
      localStorage.setItem('accessToken', response.data.accessToken);
      return { success: true };
    } catch (error) {
      localStorage.removeItem('accessToken');
      return {
        success: false,
        error: error.response?.data?.message || 'Token refresh failed'
      };
    }
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Check if token is expired
      if (payload.exp * 1000 < Date.now()) {
        // Try to refresh the token
        authService.refreshToken().catch(() => {
          localStorage.removeItem('accessToken');
        });
        return null;
      }
      
      return payload;
    } catch (error) {
      console.error('Error parsing token:', error);
      localStorage.removeItem('accessToken');
      return null;
    }
  }
};

export default authService;