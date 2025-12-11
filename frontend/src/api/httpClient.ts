// src/api/httpClient.ts
import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
});

// Optional: request/response interceptors for logging, auth, etc.
httpClient.interceptors.request.use((config) => {
  // e.g. attach auth token here later
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Central place to handle errors
    console.error('API error:', error);

    // Add user-friendly error messages
    if (error.response) {
      // Server responded with error status
      error.userMessage = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request made but no response
      error.userMessage = 'Network error: Unable to reach the server. Please check your connection.';
    } else {
      // Something else happened
      error.userMessage = error.message || 'An unexpected error occurred';
    }

    return Promise.reject(error);
  },
);

export default httpClient;
