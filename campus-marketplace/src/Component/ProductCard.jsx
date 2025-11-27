import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from './Cart/AddToCartButton';

const ProductCard = React.memo(({ product }) => {
  const navigate = useNavigate();

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

  const getImageUrl = (prod) => {
    // If prod has image data in database, use the image route
    if (prod.image && prod.image.data) {
      return `/api/products/${prod._id}/image`;
    }
    // If prod has image URL (placeholder), use it
    if (prod.image && typeof prod.image === 'string') {
      if (prod.image.startsWith('http')) {
        return prod.image;
      }
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
      return `${baseUrl}${prod.image}`;
    }
    // Fallback image
    return '/images/default-product.jpg';
  };
  
  const imageUrl = getImageUrl(product);

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
});

export default ProductCard;