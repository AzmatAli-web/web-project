import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from './Cart/AddToCartButton';

const ProductCard = React.memo(({ product }) => {
  const navigate = useNavigate();
  const imageSrc = product?.imageUrl || '/images/default-product.jpg';

  const handleViewDetails = () => {
    if (product && product._id) {
      navigate(`/product/${product._id}`);
    }
  };

  const handleImageError = () => {
    // This function is now simpler. If an image fails, we can try to force a default.
    // However, the initial `imageSrc` logic should handle most cases.
    const defaultImage = '/images/default-product.jpg';
    if (event.target.src !== defaultImage) {
      event.target.src = defaultImage;
    }
  };

  return (
    <article className="card h-100 shadow-sm">
      <img 
        src={imageSrc} 
        alt={product.name} 
        className="card-img-top" 
        style={{ height: '180px', objectFit: 'cover' }} 
        loading="lazy" // Add lazy loading
        onError={handleImageError}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title" style={{ minHeight: '48px' }}>{product.name}</h5>
        <p className="card-text text-primary fw-bold mb-3">Rs. {product.price}</p>
        
        <div className="mt-auto">
          <div className="mb-3">
            <AddToCartButton 
              product={product}
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