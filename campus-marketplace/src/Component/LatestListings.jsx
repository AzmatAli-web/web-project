import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import productService from '../services/productService';

function LatestListings() {
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
    <section className="container-fluid my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h1 mb-0">Listed recently</h2>
        <a href="#" className="small">View all</a>
      </div>

      {loading && <div className="text-center">Loading products...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row g-3">
        {!loading && !error && products.map((product) => (
          <div className="col-6 col-md-3" key={product._id}>
            <div className="rounded">
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LatestListings;
