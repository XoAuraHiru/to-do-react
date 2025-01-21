import { useState, useCallback } from 'react';
import useApi from './useApi';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { makeRequest, isLoading, error } = useApi();

  const fetchTasks = useCallback(async () => {
    const result = await makeRequest({
      method: 'GET',
      url: '/tasks'
    });

    if (result.success) {
      setTasks(result.data);
    }
    return result;
  }, [makeRequest]);

  const createTask = useCallback(async (taskData) => {
    const result = await makeRequest({
      method: 'POST',
      url: '/tasks',
      data: taskData
    });

    if (result.success) {
      setTasks(prev => [result.data, ...prev]);
    }
    return result;
  }, [makeRequest]);

  const updateTask = useCallback(async (taskId, taskData) => {
    const result = await makeRequest({
      method: 'PUT',
      url: `/tasks/${taskId}`,
      data: taskData
    });

    if (result.success) {
      setTasks(prev => prev.map(task => 
        task._id === taskId ? result.data : task
      ));
    }
    return result;
  }, [makeRequest]);

  const deleteTask = useCallback(async (taskId) => {
    const result = await makeRequest({
      method: 'DELETE',
      url: `/tasks/${taskId}`
    });

    if (result.success) {
      setTasks(prev => prev.filter(task => task._id !== taskId));
    }
    return result;
  }, [makeRequest]);

  const toggleTaskComplete = useCallback(async (taskId, completed) => {
    const result = await makeRequest({
      method: 'PATCH',
      url: `/tasks/${taskId}/complete`,
      data: { completed }
    });

    if (result.success) {
      setTasks(prev => prev.map(task =>
        task._id === taskId ? { ...task, completed: result.data.completed } : task
      ));
    }
    return result;
  }, [makeRequest]);

  const sortTasks = useCallback((sortOrder) => {
    setTasks(prev => [...prev].sort((a, b) => {
      if (a.completed === b.completed) {
        const dateA = new Date(a.scheduledFor);
        const dateB = new Date(b.scheduledFor);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return a.completed ? 1 : -1;
    }));
  }, []);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    sortTasks
  };
};

export default useTasks;