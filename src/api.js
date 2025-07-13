import axios from 'axios';
import config from './config.js';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const taskApi = {
  // Get all tasks
  getTasks: () => api.get(config.API_ENDPOINTS.TASKS),
  
  // Create a new task
  createTask: (task) => api.post(config.API_ENDPOINTS.TASKS, task),
  
  // Update an existing task
  updateTask: (id, task) => api.put(`${config.API_ENDPOINTS.TASKS}/${id}`, task),
  
  // Delete a task
  deleteTask: (id) => api.delete(`${config.API_ENDPOINTS.TASKS}/${id}`),
};

export default api;
