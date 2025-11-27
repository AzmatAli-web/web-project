import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  // Get products by category
  getProductsByCategory: async (categoryName) => {
    try {
      const response = await api.get(`/products/category/${categoryName}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch products by category';
    }
  },

  // Create new product - FIXED FOR FORMDATA
  createProduct: async (productData) => {
    try {
      console.log('🟡 productService - Sending FormData...');
      
      const token = localStorage.getItem('token');
      
      // Use fetch instead of axios for FormData to avoid Content-Type issues
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        body: productData, // Pass FormData directly
        headers: {
          'Authorization': `Bearer ${token}`,
          // Let browser set Content-Type automatically for FormData
        }
      });

      console.log('🟡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ productService - Success:', result);
      return result;
      
    } catch (error) {
      console.error('❌ productService error:', error);
      throw error.message || 'Failed to create product';
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      console.log('🟡 productService - Sending FormData for update...');
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        body: productData, // Pass FormData directly
        headers: {
          'Authorization': `Bearer ${token}`,
          // Let browser set Content-Type automatically for FormData
        }
      });

      console.log('🟡 Response status for update:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ productService - Update Success:', result);
      return result;
      
    } catch (error) {
      console.error('❌ productService update error:', error);
      throw error.message || 'Failed to update product';
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

  // Get products for the currently authenticated user (My Products page)
  getMyProducts: async () => {
    try {
      // This endpoint uses the auth token to identify the user on the backend.
      const response = await api.get('/users/my-products');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch your products';
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

export default {
  ...productService,
  getAllProducts: productService.getAllProducts,
  getProductById: productService.getProductById,
  getProductsByCategory: productService.getProductsByCategory,
  createProduct: productService.createProduct,
  updateProduct: productService.updateProduct,
  deleteProduct: productService.deleteProduct,
  getMyProducts: productService.getMyProducts,
  getUserProducts: productService.getUserProducts,
};