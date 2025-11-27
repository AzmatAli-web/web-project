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
  
  const getImageUrl = (prod) => { // Renamed 'image' to 'prod' for clarity and consistency
    // Add defensive null check for prod
    if (!prod) {
      return '/images/default-product.jpg'; // Use a consistent default fallback
    }

    // If prod has an image stored in the database, use the image route
    if (prod.hasImage) {
      return `/api/products/${String(prod._id)}/image`;
    }
    // If prod has image URL (placeholder), use it
    if (prod.image && typeof prod.image === 'string') {
      if (prod.image.startsWith('http')) {
        return prod.image;
      }
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
      return `${baseUrl}${prod.image}`;
    }
    // Fallback
    return '/images/default-product.jpg'; // Use a consistent default fallback
  };

  if (loading) { /* ... */ }

  if (error || !product) { /* ... */ }

  const productForCart = { /* ... */ };

  const imageUrl = getImageUrl(product); // Pass the whole product object

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
                alt={product?.name} // Use optional chaining
                className="img-fluid rounded-start h-100"
                style={{ objectFit: 'cover', minHeight: '500px' }}
                loading="lazy"
                onError={(e) => { 
                  if (e.target.src !== '/images/default-product.jpg') { // Prevent endless loop if default also fails
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src='/images/default-product.jpg'; 
                  }
                }}
              />
            </div>
            
            <div className="col-md-6">
              <div className="card-body p-4">
                <h1 className="h2 fw-bold text-dark mb-3">{product?.name}</h1> {/* Use optional chaining */}
                <p className="h3 text-primary mb-4">Rs. {product?.price}</p> {/* Use optional chaining */}
                
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
                      <span className="text-capitalize"> {product?.category}</span> {/* Use optional chaining */}
                    </div>
                    <div className="col-6 mb-2">
                      <strong>Seller:</strong> {product?.seller?.name || 'N/A'} {/* Already has optional chaining for seller */}
                    </div>
                    <div className="col-6 mb-2">
                      <strong>Contact:</strong> {product?.contact || 'N/A'} {/* Use optional chaining */}
                    </div>
                    <div className="col-6 mb-2">
                      <strong>Location:</strong> {product?.location || 'N/A'} {/* Use optional chaining */}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Description</h5>
                  <p className="text-muted">{product?.description}</p> {/* Use optional chaining */}
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