import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import AddToCartButton from '../Component/Cart/AddToCartButton';

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await productService.getProductById(productId);
        setProduct(fetchedProduct);
        setError(null);
      } catch (err) {
        setError('Failed to load product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleContactSeller = () => {
    if(!product) return;
    alert(`Contacting seller: ${product.seller?.name || 'N/A'}\nEmail: ${product.seller?.email || 'N/A'}\nContact: ${product.contact || 'N/A'}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  
  const getImageUrl = (image, productId) => {
    // If image is an object with data (database storage)
    if (image && image.data) {
      return `/api/products/${productId}/image`;
    }
    // If image is a string URL
    if (typeof image === 'string') {
      if (image.startsWith('http')) {
        return image;
      }
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
      return `${baseUrl}${image}`;
    }
    // Fallback
    return '/images/default-product.jpg';
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading Product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-fluid py-5">
        <div className="container text-center">
          <h2>Product Not Found</h2>
          <p className="text-danger">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary mt-3"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const productForCart = {
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    status: product.status || 'available'
  };

  const imageUrl = getImageUrl(product.image, product._id);

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="container">
        <button 
          onClick={handleGoBack}
          className="btn btn-outline-secondary mb-4"
        >
          ← Back
        </button>

        <div className="card shadow-lg">
          <div className="row g-0">
            <div className="col-md-6">
              <img 
                src={imageUrl} 
                alt={product.name}
                className="img-fluid rounded-start h-100"
                style={{ objectFit: 'cover', minHeight: '500px' }}
                loading="lazy"
                onError={(e) => { e.target.onerror = null; e.target.src='/images/default-product.jpg'; }}
              />
            </div>
            
            <div className="col-md-6">
              <div className="card-body p-4">
                <h1 className="h2 fw-bold text-dark mb-3">{product.name}</h1>
                <p className="h3 text-primary mb-4">Rs. {product.price}</p>
                
                <div className="mb-4">
                  <AddToCartButton 
                    product={productForCart}
                    size="lg"
                    showQuantity={true}
                  />
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Product Details</h5>
                  <div className="row">
                    <div className="col-6 mb-2">
                      <strong>Category:</strong> 
                      <span className="text-capitalize"> {product.category}</span>
                    </div>
                    <div className="col-6 mb-2">
                      <strong>Seller:</strong> {product.seller?.name || 'N/A'}
                    </div>
                    <div className="col-6 mb-2">
                      <strong>Contact:</strong> {product.contact || 'N/A'}
                    </div>
                    <div className="col-6 mb-2">
                      <strong>Location:</strong> {product.location || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Description</h5>
                  <p className="text-muted">{product.description}</p>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    onClick={handleContactSeller}
                    className="btn btn-primary btn-lg py-3"
                  >
                    📞 Contact Seller
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;