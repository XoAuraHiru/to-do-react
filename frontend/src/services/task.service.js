// src/services/task.service.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const taskService = {
  getAllTasks: async () => {
    try {
      const response = await api.get('/');
      return { success: true, tasks: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch tasks'
      };
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await api.post('/', taskData);
      return { success: true, task: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create task'
      };
    }
  },

  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/${id}`, taskData);
      return { success: true, task: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update task'
      };
    }
  },

  toggleComplete: async (id, completed) => {
    try {
      const response = await api.patch(`/${id}/complete`, { completed });
      return { success: true, task: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update task status'
      };
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete task'
      };
    }
  }
};

export default taskService;