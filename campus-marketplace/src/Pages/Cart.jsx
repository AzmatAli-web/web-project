import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, loading, error, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

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

  const handleCheckout = () => {
    // For now, just show an alert. We'll implement real checkout later.
    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Checkout functionality will be implemented soon!');
    // navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              Error: {error}
            </div>
            <div className="text-center">
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
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
                {/* Cart Items List */}
                <div className="card">
                  <div className="card-body">
                    {cart.items.map((item) => (
                      <div key={item.product._id} className="row align-items-center mb-4 pb-4 border-bottom">
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
                          <p className="text-muted small mb-0">{item.product.category}</p>
                          <p className="text-primary fw-bold mb-0">${item.price}</p>
                        </div>
                        
                        <div className="col-md-3">
                          <div className="input-group input-group-sm" style={{ maxWidth: '120px' }}>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="form-control text-center"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value) || 1)}
                              min="1"
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div className="col-md-2 text-center">
                          <h6 className="text-primary">${(item.price * item.quantity).toFixed(2)}</h6>
                        </div>
                        
                        <div className="col-md-1 text-end">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRemoveItem(item.product._id)}
                            title="Remove item"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Order Summary</h5>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Items ({cart.items.reduce((total, item) => total + item.quantity, 0)})</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping</span>
                      <span className="text-success">Free</span>
                    </div>
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between mb-3">
                      <strong>Total</strong>
                      <strong className="text-primary">${getCartTotal().toFixed(2)}</strong>
                    </div>
                    
                    <button
                      className="btn btn-primary w-100 mb-2"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
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
      </div>
    </div>
  );
}

export default Cart;