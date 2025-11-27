import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService'; // Assuming you have this service

function UserProducts({ userId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch products if we have a userId
    if (userId) {
      fetchUserProducts();
    } else {
      // If no userId is present after a moment, stop loading and show a message.
      setLoading(false);
    }
  }, [userId]); // Keep userId as dependency to trigger fetch when user is loaded

  const fetchUserProducts = async () => {
    try {
      setError(''); // Clear previous errors
      setLoading(true);
      // This service function should call GET /api/users/my-products
      // It will use the token from localStorage, so no userId is needed as an argument.
      const productsData = await productService.getMyProducts(); 
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching user's products:", error); // Add console log for debugging
      setError('Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        // Refresh the product list after deletion
        setProducts(products.filter(p => p._id !== productId));
        alert('Product deleted successfully!');
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert(err.message || 'Failed to delete product.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">My Products</h4>
        <Link to="/sell" className="btn btn-primary btn-sm">
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <span style={{ fontSize: '3rem' }}>📦</span>
          </div>
          <h5 className="text-muted">No products yet</h5>
          <p className="text-muted mb-3">
            You haven't listed any products for sale. Start selling today!
          </p>
          <Link to="/sell" className="btn btn-primary">
            List Your First Product
          </Link>
        </div>
      ) : (
        <div className="row">
          {products.map(product => (
            <div key={product._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100 shadow-sm">
                <img 
                  // Use the correct endpoint for images
                  src={product.hasImage ? `/api/products/${product._id}/image` : '/images/default-product.jpg'} 
                  className="card-img-top" 
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text flex-grow-1">{product.description}</p>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 text-primary mb-0">Rs. {product.price}</span>
                      <span className={`badge ${
                        product.status === 'available' ? 'bg-success' : 
                        product.status === 'sold' ? 'bg-secondary' : 'bg-warning'
                      }`}>
                        {product.status || 'Available'}
                      </span>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <Link to={`/sell?edit=${product._id}`} className="btn btn-outline-primary btn-sm flex-fill">
                        Edit                      
                      </Link>
                      <button 
                        className="btn btn-outline-danger btn-sm flex-fill"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default UserProducts;