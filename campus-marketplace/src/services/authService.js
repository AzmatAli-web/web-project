// authService.js
import axiosClient from '../api/axiosClient'; // ✅ Use your configured client

// Use environment variable for API URL with localhost fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  register: async (userData) => {
    try {
      console.log('Sending registration request...', userData);
      
      // ✅ Use axiosClient instead of raw axios
      const response = await axiosClient.post('/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Registration successful:', response.data);
      
      // ✅ TOKEN STORAGE
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // ✅ Update axiosClient header manually
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      // ✅ Better error message extraction
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
      throw errorMsg;
    }
  },

  login: async (credentials) => {
    try {
      console.log('Sending login request...', credentials);
      
      // ✅ Use axiosClient instead of raw axios
      const response = await axiosClient.post('/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login successful:', response.data);
      
      // ✅ TOKEN STORAGE - UNCHANGED
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // ✅ Update axiosClient header manually
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  },

  // ✅ UPDATED LOGOUT - Clear axios header too
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // ✅ Remove Authorization header from axiosClient
    delete axiosClient.defaults.headers.common['Authorization'];
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // ✅ NEW: Get token for manual use if needed
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;