import { useState, useCallback } from 'react';
import axiosService from '../services/axios.service';

const useApi = () => {
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: false
  });

  const makeRequest = useCallback(async (config) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await axiosService(config);
      setState(prev => ({
        ...prev,
        data: response.data,
        isLoading: false
      }));
      return { success: true, data: response.data };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || 'Request failed',
        isLoading: false
      }));
      return { success: false, error: error.message };
    }
  }, []);

  return { ...state, makeRequest };
};

export default useApi;