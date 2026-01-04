// cartService.js
import axiosClient from '../api/axiosClient'; // Import shared client

const cartService = {
  getCart: async () => {
    try {
      const response = await axiosClient.get('/cart');
      return response.data;
    } catch (error) {
      // ✅ Better error handling
      if (error.response?.status === 401) {
        // User not authenticated
        console.log('User not authenticated, returning empty cart');
        return { items: [], totalAmount: 0 };
      }
      throw error.response?.data?.message || 'Failed to fetch cart';
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await axiosClient.post('/cart/add', {
        productId,
        quantity: parseInt(quantity)
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add item to cart';
    }
  },

  removeFromCart: async (productId) => {
    try {
      const response = await axiosClient.delete(`/cart/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to remove item from cart';
    }
  },

  clearCart: async () => {
    try {
      const response = await axiosClient.delete('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to clear cart';
    }
  },

  createCheckoutSession: async () => {
    try {
      const response = await axiosClient.post('/cart/create-checkout-session');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create checkout session';
    }
  }
};

export default cartService;