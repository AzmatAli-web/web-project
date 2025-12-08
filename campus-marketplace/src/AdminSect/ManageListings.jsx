import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Stylng.css';
import productService from '../services/productService';

const ManageListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
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
    if (!window.confirm("Are you sure you want to approve this product?")) return;
    
    setActionLoading(productId);
    try {
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

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/50';
    }
    
    // Handle different image path formats
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Handle Windows backslashes and ensure correct path
    const cleanPath = imagePath.replace(/\\/g, '/');
    
    // Remove leading slash if present to avoid double slashes
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
    
    return `http://localhost:5000/${normalizedPath}`;
  };

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { class: 'bg-success', text: 'Available' },
      sold: { class: 'bg-secondary', text: 'Sold' },
      pending: { class: 'bg-warning', text: 'Pending' },
      rejected: { class: 'bg-danger', text: 'Rejected' }
    };
    const config = statusConfig[status] || { class: 'bg-dark', text: 'Unknown' };
    return <span className={`badge ${config.class} text-white`}>{config.text}</span>;
  };

  const getCategoryBadge = (category) => {
    return <span className="badge bg-info text-white text-capitalize">{category || 'Uncategorized'}</span>;
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

      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h6 className="mb-2">Filter by Status:</h6>
              <div className="btn-group btn-group-sm">
                {['all', 'available', 'pending', 'sold', 'rejected'].map(statusFilter => (
                  <button
                    key={statusFilter}
                    className={`btn ${filter === statusFilter ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter(statusFilter)}
                  >
                    {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </button>
                ))}
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
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="rounded"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/50';
                          }}
                        />
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                        <br />
                        <small className="text-muted">
                          {product.description?.substring(0, 50) || 'No description'}...
                        </small>
                      </td>
                      <td>{getCategoryBadge(product.category)}</td>
                      <td><strong className="text-primary">Rs. {product.price || '0.00'}</strong></td>
                      <td>{getStatusBadge(product.status)}</td>
                      <td>
                        {product.seller?.name || 'Unknown'}
                        <br />
                        <small className="text-muted">{product.seller?.email || 'No email'}</small>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApprove(product._id)}
                            disabled={actionLoading === product._id}
                            title="Approve Product (Change status to Available)"
                          >
                            {actionLoading === product._id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              'Approve'
                            )}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(product._id)}
                            disabled={actionLoading === product._id}
                            title="Delete Product"
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleViewDetails(product._id)}
                            title="View Product Details"
                          >
                            View Details
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
    </div>
  );
};

export default ManageListings;