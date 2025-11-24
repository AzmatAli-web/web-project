import { createContext, useContext, useReducer, useEffect } from 'react';
import cartService from '../services/cartService';

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
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
    
    case CART_ACTIONS.ADD_ITEM:
      return {
        ...state,
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
    
    case CART_ACTIONS.CLEAR_CART:
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

  // Load cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const cart = await cartService.getCart();
      dispatch({ type: CART_ACTIONS.SET_CART, payload: cart });
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      await cartService.addToCart(productId, quantity);
      // Refresh cart after adding item
      await fetchCart();
      dispatch({ type: CART_ACTIONS.ADD_ITEM });
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await cartService.updateCartItem(productId, quantity);
      await fetchCart();
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      await fetchCart();
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const getCartCount = () => {
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return state.cart.totalAmount;
  };

  const value = {
    cart: state.cart,
    loading: state.loading,
    error: state.error,
    addToCart,
    updateQuantity,
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