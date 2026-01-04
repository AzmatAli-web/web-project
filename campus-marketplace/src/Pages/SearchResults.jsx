import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavigationBar from '../Component/NavigationBar';
import Footer from '../Component/Footer';
import AddToCartButton from '../Component/Cart/AddToCartButton';
import productService from '../services/productService';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔵 Searching for:', query);
        
        // Call search endpoint
        const results = await productService.searchProducts(query);
        console.log('✅ Search results:', results);
        
        setProducts(results);
      } catch (err) {
        console.error('❌ Search error:', err);
        setError(err.message || 'Failed to search products');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <NavigationBar />
      <main className="container py-5">
        <div className="mb-4">
          <h1 className="h2 fw-bold">Search Results for "{query}"</h1>
          {!error && (
            <p className="text-muted">
              {loading ? 'Searching...' : `Found ${products.length} products.`}
            </p>
          )}
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="alert alert-info" role="alert">
            No products found matching your search. Try different keywords or <a href="/">browse all products</a>.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="row g-4">
            {products.map(product => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img 
                    src={product.imageUrl || '/images/default-product.jpg'}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleProductClick(product._id)}
                    onError={(e) => {
                      e.target.src = '/images/default-product.jpg';
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title" onClick={() => handleProductClick(product._id)} style={{ cursor: 'pointer' }}>{product.name}</h5>
                    <p className="card-text text-muted small">{product.description?.substring(0, 50)}...</p>
                    <div className="mt-auto">
                      <p className="h5 text-primary mb-3">Rs. {product.price}</p>
                      <div className="mb-2">
                        <AddToCartButton 
                          product={product}
                          size="sm"
                          showQuantity={false}
                        />
                      </div>
                      <button 
                        className="btn btn-outline-secondary w-100 btn-sm"
                        onClick={() => handleProductClick(product._id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default SearchResults;
