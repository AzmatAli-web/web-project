import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from './Cart/AddToCartButton';

const ProductCard = React.memo(({ product }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState('/images/default-product.jpg'); // Initialize with default image

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

  useEffect(() => {
    // Function to determine the image URL
    const getImageUrl = (prod) => {
      if (prod && prod.hasImage && prod._id) {
        return `/api/products/${String(prod._id)}/image`;
      }
      return '/images/default-product.jpg'; // Fallback to default image
    };
    setImageSrc(getImageUrl(product));
  }, [product]);

  const handleImageError = () => {
    // If the current source is not already the default one, set it to the default.
    // This prevents an infinite loop if the default image itself is broken.
    if (imageSrc !== '/images/default-product.jpg') {
      setImageSrc('/images/default-product.jpg');
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