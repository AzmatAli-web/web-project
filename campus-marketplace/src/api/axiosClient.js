import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// ✅ SIMPLE: Redirect to landing page only when needed
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we're on a protected page
      // Let users stay on public pages (landing, login, signup)
      const protectedPaths = ['/profile', '/cart', '/sell', '/admin'];
      const currentPath = window.location.pathname;
      
      if (protectedPaths.some(path => currentPath.includes(path))) {
        setTimeout(() => {
          window.location.href = '/'; // Landing page
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;