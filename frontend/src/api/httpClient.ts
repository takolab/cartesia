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
    return Promise.reject(error);
  },
);

export default httpClient;
