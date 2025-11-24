import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

function AddToCartButton({ product, size = 'md', showQuantity = false }) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { addToCart, getCartCount } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!product || !product._id) {
      setMessage('Invalid product');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await addToCart(product._id, quantity);
      setMessage('✅ Added to cart!');
      
      // Clear message after 2 seconds
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      if (error.includes('auth') || error.includes('token')) {
        setMessage('Please login to add to cart');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(`❌ ${error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const buttonSizes = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  const buttonClass = `btn btn-primary ${buttonSizes[size]} ${loading ? 'disabled' : ''}`;

  return (
    <div className="add-to-cart-wrapper">
      {showQuantity && (
        <div className="mb-2">
          <label className="form-label small">Quantity:</label>
          <div className="input-group input-group-sm" style={{ maxWidth: '120px' }}>
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              className="form-control text-center"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
      )}

      <button
        className={buttonClass}
        onClick={handleAddToCart}
        disabled={loading || product?.status !== 'available'}
        style={{ minWidth: '140px' }}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Adding...
          </>
        ) : (
          <>
            🛒 Add to Cart
            {!showQuantity && quantity > 1 && ` (${quantity})`}
          </>
        )}
      </button>

      {product?.status !== 'available' && (
        <div className="mt-1">
          <small className="text-muted">Not available</small>
        </div>
      )}

      {message && (
        <div className={`mt-2 small ${message.includes('✅') ? 'text-success' : 'text-danger'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default AddToCartButton;