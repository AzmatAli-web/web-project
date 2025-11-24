import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function UserProducts({ userId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserProducts();
    }
  }, [userId]);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      // For now, we'll show a message since we haven't created the backend route
      // const productsData = await userService.getUserProducts(userId);
      // setProducts(productsData);
      
      // Temporary: Simulate loading then show empty state
      setTimeout(() => {
        setProducts([]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError('Failed to load your products');
      setLoading(false);
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
        <Link to="/add-product" className="btn btn-primary btn-sm">
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
          <Link to="/add-product" className="btn btn-primary">
            List Your First Product
          </Link>
        </div>
      ) : (
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <img 
                  src={product.image || '/images/default-product.jpg'} 
                  className="card-img-top" 
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text flex-grow-1">{product.description}</p>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 text-primary mb-0">${product.price}</span>
                      <span className={`badge ${
                        product.status === 'available' ? 'bg-success' : 
                        product.status === 'sold' ? 'bg-secondary' : 'bg-warning'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-outline-primary btn-sm flex-fill">
                        Edit
                      </button>
                      <button className="btn btn-outline-danger btn-sm flex-fill">
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

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4>{products.filter(p => p.status === 'available').length}</h4>
              <small>Available</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4>{products.filter(p => p.status === 'sold').length}</h4>
              <small>Sold</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h4>{products.length}</h4>
              <small>Total</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProducts;