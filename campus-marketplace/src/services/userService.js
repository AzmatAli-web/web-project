// userService.js - Using consistent axiosClient approach
import axiosClient from "../api/axiosClient";
// Import your configured client

const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await axiosClient.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch profile';
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await axiosClient.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  },

  // Get user's products
  getUserProducts: async (userId) => {
    try {
      const response = await axiosClient.get(`/products/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user products';
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await axiosClient.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch users';
    }
  },

  // Approve user (admin only)
  approveUser: async (userId) => {
    try {
      const response = await axiosClient.put(`/users/${userId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to approve user';
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    try {
      const response = await axiosClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete user';
    }
  },

  // ✅ ADDED: Update user role (admin only)
  updateUserRole: async (userId, role) => {
    try {
      const response = await axiosClient.put(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update user role';
    }
  },

  // ✅ ADDED: Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axiosClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user';
    }
  }
};

export default userService;