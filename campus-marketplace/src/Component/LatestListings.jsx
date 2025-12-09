import React, { useState, useEffect, memo } from 'react';
import ProductCard from './ProductCard';
import productService from '../services/productService';

const LatestListings = memo(() => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await productService.getAllProducts();
        // We only need a few for the landing page
        setProducts(fetchedProducts.slice(0, 4));
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="container-fluid my-4 my-md-5 products-section" style={{ padding: '0 10px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
        <h2 className="h4 h-md-3 mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>Listed recently</h2>
        <a href="#" className="small text-decoration-none" style={{ color: '#667eea' }}>View all →</a>
      </div>

      {loading && <div className="text-center py-4"><span className="spinner-border spinner-border-sm text-primary me-2"></span>Loading...</div>}
      {error && <div className="alert alert-danger m-0">{error}</div>}
      
      <div className="row g-2 g-md-3 g-lg-4">
        {!loading && !error && products.map((product) => (
          <div className="col-6 col-md-4 col-lg-3" key={product._id}>
            <div className="product-card">
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default LatestListings;
