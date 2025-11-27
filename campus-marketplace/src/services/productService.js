// productService.js - Using your existing axiosClient
import axiosClient from '../api/axiosClient'; // Import your configured client

const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await axiosClient.get('/products');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch products';
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await axiosClient.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch product';
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryName) => {
    try {
      const response = await axiosClient.get(`/products/category/${categoryName}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch products by category';
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      console.log('🟡 productService - Sending FormData...');
      
      const response = await axiosClient.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('✅ productService - Success:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ productService error:', error);
      throw error.response?.data?.message || error.message || 'Failed to create product';
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      console.log('🟡 productService - Updating product...');
      
      const response = await axiosClient.put(`/products/${productId}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('✅ productService - Update Success:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ productService update error:', error);
      throw error.response?.data?.message || error.message || 'Failed to update product';
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await axiosClient.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete product';
    }
  },

  // Get products for the currently authenticated user
  getMyProducts: async () => {
    try {
      const response = await axiosClient.get('/users/my-products');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch your products';
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
  }
};

export default productService;