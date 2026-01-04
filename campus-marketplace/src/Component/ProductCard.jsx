import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from './Cart/AddToCartButton';

const ProductCard = React.memo(({ product }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(product?.imageUrl || '/images/default-product.jpg');

  const handleViewDetails = () => {
    if (product && product._id) {
      navigate(`/product/${product._id}`);
    }
  };

  const handleImageError = (event) => {
    // ✅ FIXED: Handle relative URLs from backend
    const defaultImage = '/images/default-product.jpg';
    if (event.target.src !== defaultImage) {
      console.warn('🟡 Image failed to load:', event.target.src);
      event.target.src = defaultImage;
    }
  };

  return (
    <article className="product-card card shadow-sm h-100 transition-all">
      {/* Product Image with improved aspect ratio for mobile */}
      <div className="product-image-wrapper" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
        <img 
          src={imageSrc} 
          alt={product.name} 
          className="product-image card-img-top" 
          style={{ 
            height: '200px', 
            objectFit: 'cover',
            width: '100%'
          }} 
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      
      <div className="card-body d-flex flex-column p-3 p-md-4">
        {/* Product Title with improved line-height */}
        <h5 className="product-title card-title mb-2" style={{ 
          minHeight: '48px',
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          lineHeight: '1.4'
        }}>
          {product.name}
        </h5>
        
        {/* Product Price - Enhanced visibility */}
        <p className="product-price card-text text-primary fw-bold mb-2" style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.35rem)'
        }}>
          Rs. {product.price}
        </p>
        
        {/* Seller Info - Optional */}
        {product.seller && (
          <p className="text-muted small mb-3">
            Seller: <strong>{typeof product.seller === 'string' ? product.seller : product.seller?.name || 'Unknown'}</strong>
          </p>
        )}
        
        {/* Action Buttons */}
        <div className="mt-auto">
          {/* Add to Cart Button - Full width on mobile */}
          <div className="mb-2">
            <AddToCartButton 
              product={product}
              size="sm"
              showQuantity={false}
              className="w-100"
            />
          </div>
          
          {/* Details & Contact - Responsive layout */}
          <div className="d-grid gap-2 gap-md-0 mb-2">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={handleViewDetails}
              style={{ minHeight: '40px' }}
            >
              View Details
            </button>
          </div>
          
          {/* Timestamp - Optional, shown on desktop */}
          <div className="hidden-mobile text-end">
            <small className="text-muted">Just now</small>
          </div>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;