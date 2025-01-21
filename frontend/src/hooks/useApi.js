import { useState, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const useApi = () => {
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: false
  });

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add token to requests
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

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
  }, []);

  return {
    ...state,
    makeRequest
  };
};

export default useApi;