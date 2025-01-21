import { useCallback } from 'react';
import useApi from './useApi';

const useUser = () => {
  const { makeRequest, isLoading, error } = useApi();

  const updateProfile = useCallback(async (userData) => {
    return await makeRequest({
      method: 'PUT',
      url: '/users/profile',
      data: userData
    });
  }, [makeRequest]);

  const getActivity = useCallback(async () => {
    return await makeRequest({
      method: 'GET',
      url: '/users/activity'
    });
  }, [makeRequest]);

  const changePassword = useCallback(async (passwordData) => {
    return await makeRequest({
      method: 'POST',
      url: '/users/change-password',
      data: passwordData
    });
  }, [makeRequest]);

  return {
    updateProfile,
    getActivity,
    changePassword,
    isLoading,
    error
  };
};

export default useUser;