import axios from 'axios';

// ✅ IMPROVED: Use environment variable, then try relative paths for dev/production
let API_URL;

// Check environment variable first
if (import.meta.env.VITE_API_URL) {
  API_URL = import.meta.env.VITE_API_URL;
} 
// In development (Vite with proxy), use relative path /api
else if (import.meta.env.DEV) {
  API_URL = '/api';
}
// In production, use relative path /api (server should serve both frontend and API)
else {
  API_URL = '/api';
}

console.log('🔵 API_URL configured as:', API_URL);

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ IMPORTANT: Allow cookies if needed
});

// Request interceptor - Add token to every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔵 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('🔴 Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and redirects
axiosClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('🔴 Response error:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we're on a protected page
      const protectedPaths = ['/profile', '/cart', '/sell', '/admin'];
      const currentPath = window.location.pathname;
      
      if (protectedPaths.some(path => currentPath.includes(path))) {
        setTimeout(() => {
          window.location.href = '/'; 
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;