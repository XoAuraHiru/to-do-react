import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000/api';

const useApi = () => {
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: false
  });
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  // Request interceptor
  api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await axios.post(
            `${BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          navigate('/login');
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  const makeRequest = useCallback(async (config) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await api(config);
      setState(prev => ({
        ...prev,
        data: response.data,
        isLoading: false
      }));
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      return { success: false, error: errorMessage };
    }
  }, [navigate]);

  const clearState = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false
    });
  }, []);

  return {
    ...state,
    makeRequest,
    clearState
  };
};

export default useApi;