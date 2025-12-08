// adminStatsService.js - Service for fetching admin statistics
import axiosClient from '../api/axiosClient';

const adminStatsService = {
  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await axiosClient.get('/admin/stats/users');
      return response.data;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error.response?.data?.message || 'Failed to fetch user statistics';
    }
  },

  // Get product statistics
  getProductStats: async () => {
    try {
      const response = await axiosClient.get('/admin/stats/products');
      return response.data;
    } catch (error) {
      console.error("Error fetching product stats:", error);
      throw error.response?.data?.message || 'Failed to fetch product statistics';
    }
  },

  // Get transaction statistics
  getTransactionStats: async () => {
    try {
      const response = await axiosClient.get('/admin/stats/transactions');
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction stats:", error);
      throw error.response?.data?.message || 'Failed to fetch transaction statistics';
    }
  },

  // Get activity logs
  getActivityLogs: async () => {
    try {
      const response = await axiosClient.get('/admin/stats/activity');
      return response.data;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      throw error.response?.data?.message || 'Failed to fetch activity logs';
    }
  },

  // Get platform statistics
  getPlatformStats: async () => {
    try {
      const response = await axiosClient.get('/admin/stats/platform');
      return response.data;
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      throw error.response?.data?.message || 'Failed to fetch platform statistics';
    }
  },

  // Get all dashboard data
  getDashboardData: async () => {
    try {
      const response = await axiosClient.get('/admin/stats/dashboard');
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error.response?.data?.message || 'Failed to fetch dashboard data';
    }
  },
};

export default adminStatsService;
