import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useLocation } from 'react-router-dom';
import cartService from '../services/cartService';

function Cart() {
  const { cart, loading, error, removeFromCart, clearCart, getCartTotal } = useCart();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('payment_success') === 'true') {
      alert('Payment Successful');
      clearCart();
    }
  }, [location]);

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    try {
      const { url } = await cartService.createCheckoutSession();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Ensure cart and cart.items are not null/undefined before rendering
  if (!cart || !cart.items) {
    return (
        <div className="text-center py-5">
            <div className="mb-4">
                <span style={{ fontSize: '4rem' }}>🛒</span>
            </div>
            <h3 className="text-muted">Your cart is empty</h3>
            <p className="text-muted mb-4">
                Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/" className="btn btn-primary btn-lg">
                Continue Shopping
            </Link>
        </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🛒 Shopping Cart</h1>
        {cart.items.length > 0 && (
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <span style={{ fontSize: '4rem' }}>🛒</span>
          </div>
          <h3 className="text-muted">Your cart is empty</h3>
          <p className="text-muted mb-4">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                {cart.items
                  .filter(item => item && item.product) // Filter out items with no product
                  .map((item) => (
                  // Use a fallback key in case product._id is missing
                  <div key={item.product?._id || item.productId} className="row align-items-center mb-4 pb-4 border-bottom">
                    <div className="col-md-2">
                      <img
                        src={item.product.image || '/images/default-product.jpg'}
                        alt={item.product.name}
                        className="img-fluid rounded"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-4">
                      <h6 className="mb-1">{item.product.name}</h6>
                      <p className="text-primary fw-bold mb-0">Rs. {item.product.price}</p>
                    </div>
                    <div className="col-md-2">
                      <p className="mb-0">Qty: {item.quantity}</p>
                    </div>
                    <div className="col-md-3 text-end">
                      <h6 className="text-primary mb-0">Rs. {(item.product.price * item.quantity).toFixed(2)}</h6>
                    </div>
                    <div className="col-md-1 text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveItem(item.product._id)}
                        title="Remove item"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({cart.items.reduce((total, item) => total + item.quantity, 0)})</span>
                  <span>Rs. {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong className="text-primary">Rs. {getCartTotal().toFixed(2)}</strong>
                </div>
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={handleCheckout}
                >
                  Pay with Stripe
                </button>
                <Link to="/" className="btn btn-outline-secondary w-100">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
