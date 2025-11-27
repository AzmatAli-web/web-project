import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddToCartButton from './Cart/AddToCartButton';
import productService from '../services/productService';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProducts = await productService.getProductsByCategory(categoryId);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error(`Error loading products for category ${categoryId}:`, err);
        setError(err.toString() || 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const categoryTitles = {
    books: "Books",
    gadgets: "Gadgets", 
    stationery: "Stationery",
    accessories: "Accessories"
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <NavigationBar />
      <main className="container py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="h2 fw-bold">{categoryTitles[categoryId] || categoryId}</h1>
              {!error && (
                <p className="text-muted">
                  {loading ? 'Loading products...' : `Found ${products.length} products in this category.`}
                </p>
              )}
            </div>
          </div>
          
          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="col-12 text-center py-5">
                <div className="alert alert-danger">Failed to load products. Please try again later.</div>
              </div>
            ) : products.length > 0 ? (
              products.map(product => (
                <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card h-100 shadow-sm">
                    <img 
                      // ✅ FIXED: Use the correct image URL logic
                      src={product.hasImage ? `/api/products/${product._id}/image` : '/images/default-product.jpg'}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => handleProductClick(product._id)}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title" onClick={() => handleProductClick(product._id)} style={{ cursor: 'pointer' }}>{product.name}</h5>
                      <div className="mt-auto">
                        <p className="h5 text-primary mb-3">Rs. {product.price}</p>
                        <div className="mb-2">
                          <AddToCartButton 
                            product={product} // Pass the full product object
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
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h3 className="text-muted">No products found</h3>
                <p>There are currently no products listed in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default CategoryPage;
