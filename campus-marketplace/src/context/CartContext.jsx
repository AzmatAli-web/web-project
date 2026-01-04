import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_CART_LOCAL: 'CLEAR_CART_LOCAL'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        cart: action.payload,
        loading: false,
        error: null
      };
    
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case CART_ACTIONS.CLEAR_CART_LOCAL:
      return {
        ...state,
        cart: { items: [], totalAmount: 0 },
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

const initialState = {
  cart: { items: [], totalAmount: 0 },
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // ✅ FIXED: Only fetch cart if user is authenticated
  const fetchCart = useCallback(async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // No token, don't fetch cart
      dispatch({ type: CART_ACTIONS.CLEAR_CART_LOCAL });
      return;
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const cart = await cartService.getCart();
      dispatch({ type: CART_ACTIONS.SET_CART, payload: cart });
    } catch (error) {
      console.error('Cart fetch error:', error);
      // If 401, user is not authenticated
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: CART_ACTIONS.CLEAR_CART_LOCAL });
      } else {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      }
    }
  }, []);

  // ✅ FIXED: Load cart only once on mount, and only if authenticated
  useEffect(() => {
    // Check if token exists before fetching
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []); // Empty dependency array - run only once

  // Memoize addToCart
  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const updatedCart = await cartService.addToCart(productId, quantity);
      dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Memoize removeFromCart
  const removeFromCart = useCallback(async (productId) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const updatedCart = await cartService.removeFromCart(productId);
      dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []); // Empty dependency array means this function is created once

  // Memoize clearCart
  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      dispatch({ type: CART_ACTIONS.CLEAR_CART_LOCAL }); // Dispatch local clear
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []); // Empty dependency array means this function is created once

  const getCartCount = () => {
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    if (!state.cart || !state.cart.items) {
      return 0;
    }
    return state.cart.items.reduce((total, item) => {
      // Ensure product and price exist to prevent errors
      if (item.product && typeof item.product.price === 'number') {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const value = {
    cart: state.cart,
    loading: state.loading,
    error: state.error,
    addToCart,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};