import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://accurate-compassion-production.up.railway.app/api';

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

const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch products';
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch product';
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create product';
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update product';
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete product';
    }
  },

  // Get user's products
  getUserProducts: async (userId) => {
    try {
      const response = await api.get(`/products/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user products';
    }
  }
};

export default productService;