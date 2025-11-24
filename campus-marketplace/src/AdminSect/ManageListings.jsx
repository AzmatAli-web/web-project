import React, { useState, useEffect } from 'react';
import './Stylng.css';
import productService from '../services/productService'; // ✅ Use product service

const ManageListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all'); // all, available, sold, pending

  // Load products from backend on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use productService to fetch all products from backend
      const productsData = await productService.getAllProducts();
      setProducts(productsData || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    setActionLoading(productId);
    try {
      // Update product status to approved
      await productService.updateProduct(productId, { status: 'available' });
      setProducts(prev => prev.map(product => 
        product._id === productId ? { ...product, status: 'available' } : product
      ));
      alert('Product approved successfully!');
    } catch (err) {
      console.error("Error approving product:", err);
      alert("Failed to approve product: " + (err.message || 'Please try again'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    setActionLoading(productId);
    try {
      await productService.deleteProduct(productId);
      setProducts(prev => prev.filter(product => product._id !== productId));
      alert('Product deleted successfully!');
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product: " + (err.message || 'Please try again'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (product) => {
    alert(`Edit feature for "${product.name}" coming soon`);
  };

  // Filter products based on status
  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { class: 'bg-success', text: 'Available' },
      sold: { class: 'bg-secondary', text: 'Sold' },
      pending: { class: 'bg-warning', text: 'Pending' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge ${config.class} text-white`}>{config.text}</span>;
  };

  const getCategoryBadge = (category) => {
    return <span className="badge bg-info text-white text-capitalize">{category}</span>;
  };

  if (loading) return (
    <div className="admin-page">
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading products...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="admin-page">
      <div className="alert alert-danger" role="alert">
        {error}
        <div className="mt-2">
          <button className="btn btn-sm btn-outline-danger" onClick={fetchProducts}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏠 Manage Products</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchProducts}>
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h6 className="mb-2">Filter by Status:</h6>
              <div className="btn-group btn-group-sm">
                <button 
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`btn ${filter === 'available' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilter('available')}
                >
                  Available
                </button>
                <button 
                  className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
                <button 
                  className={`btn ${filter === 'sold' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter('sold')}
                >
                  Sold
                </button>
              </div>
            </div>
            <div className="col-md-6 text-end">
              <small className="text-muted">
                Showing {filteredProducts.length} of {products.length} products
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {filteredProducts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Seller</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img 
                          src={product.image || '/images/default-product.jpg'} 
                          alt={product.name}
                          className="rounded"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                        <br />
                        <small className="text-muted">{product.description?.substring(0, 50)}...</small>
                      </td>
                      <td>{getCategoryBadge(product.category)}</td>
                      <td>
                        <strong className="text-primary">Rs. {product.price}</strong>
                      </td>
                      <td>{getStatusBadge(product.status)}</td>
                      <td>
                        {product.seller?.name || 'Unknown'}
                        <br />
                        <small className="text-muted">{product.seller?.email}</small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {product.status === 'pending' && (
                            <button 
                              className="btn btn-success"
                              onClick={() => handleApprove(product._id)}
                              disabled={actionLoading === product._id}
                              title="Approve Product"
                            >
                              {actionLoading === product._id ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                '✓ Approve'
                              )}
                            </button>
                          )}
                          
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(product)}
                            title="Edit Product"
                          >
                            Edit
                          </button>
                          
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(product._id)}
                            disabled={actionLoading === product._id}
                            title="Delete Product"
                          >
                            {actionLoading === product._id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">
                {products.length === 0 ? 'No products found in the system.' : 'No products match the selected filter.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4>{products.length}</h4>
              <small>Total Products</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4>{products.filter(p => p.status === 'available').length}</h4>
              <small>Available</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h4>{products.filter(p => p.status === 'pending').length}</h4>
              <small>Pending</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-secondary text-white">
            <div className="card-body text-center">
              <h4>{products.filter(p => p.status === 'sold').length}</h4>
              <small>Sold</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageListings;