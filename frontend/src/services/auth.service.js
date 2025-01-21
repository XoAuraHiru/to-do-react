import axiosService from './axios.service';

const authService = {
  register: async (userData) => {
    try {
      const response = await axiosService.post('/auth/register', userData);
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
      const response = await axiosService.post('/auth/login', { email, password });
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
      const response = await axiosService.get('/auth/verify-token');
      return { success: true, user: response.data.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Token verification failed' 
      };
    }
  },

  logout: async () => {
    try {
      await axiosService.post('/auth/logout');
      localStorage.removeItem('accessToken');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Logout failed' 
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
      
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('accessToken');
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