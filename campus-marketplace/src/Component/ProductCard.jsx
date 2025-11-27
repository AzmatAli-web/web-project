import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from './Cart/AddToCartButton';

// Updated to accept full product object
function ProductCard({ product }) {
  const navigate = useNavigate();

  // Handle view details
  const handleViewDetails = () => {
    if (product && product._id) {
      navigate(`/product/${product._id}`);
    }
  };

  const productForCart = {
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    status: product.status || 'available'
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '/images/default-product.jpg'; // Fallback image
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${baseUrl}${imagePath}`;
  };
  
  const imageUrl = getImageUrl(product.image);

  return (
    <article className="card h-100 shadow-sm">
      <img 
        src={imageUrl} 
        alt={product.name} 
        className="card-img-top" 
        style={{ height: '180px', objectFit: 'cover' }} 
        onError={(e) => { e.target.onerror = null; e.target.src='/images/default-product.jpg'; }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title" style={{ minHeight: '48px' }}>{product.name}</h5>
        <p className="card-text text-primary fw-bold mb-3">Rs. {product.price}</p>
        
        <div className="mt-auto">
          {/* ✅ ADDED: Add to Cart Button */}
          <div className="mb-3">
            <AddToCartButton 
              product={productForCart}
              size="sm"
              showQuantity={false}
            />
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={handleViewDetails}
              >
                View Details
              </button>
              <button className="btn btn-sm btn-primary">Contact</button>
            </div>
            <small className="text-muted">Just now</small>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;