import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://accurate-compassion-production.up.railway.app/api';

// Create axios instance with common config
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch profile';
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  },

  // Get user's products (we'll create this backend route later)
  getUserProducts: async (userId) => {
    try {
      const response = await api.get(`/products/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user products';
    }
  },

  // ✅ ADDED: Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch users';
    }
  },

  // ✅ ADDED: Approve user (admin only)
  approveUser: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to approve user';
    }
  },

  // ✅ ADDED: Delete user (admin only)
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete user';
    }
  }
};

export default userService;