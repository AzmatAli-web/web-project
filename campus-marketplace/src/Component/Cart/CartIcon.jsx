import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartIcon() {
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <button 
      className="btn btn-outline-primary position-relative"
      onClick={handleCartClick}
      style={{ border: 'none' }}
    >
      🛒
      {cartCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  );
}

export default CartIcon;