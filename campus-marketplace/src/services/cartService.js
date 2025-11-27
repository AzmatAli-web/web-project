import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://accurate-compassion-production.up.railway.app/api';

// Create axios instance with auth header
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

const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch cart';
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', {
        productId,
        quantity: parseInt(quantity)
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add item to cart';
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to remove item from cart';
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to clear cart';
    }
  }
};

export default cartService;