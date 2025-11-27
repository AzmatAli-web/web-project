import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService'; // For delete
import authService from '../services/authService'; // For profile updates and user data
import userService from '../services/userService'; // ✅ NEW: For fetching user listings
import ProductCard from '../Component/ProductCard'; // Corrected path

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // ✅ CHANGED: Fetch products using the new userService endpoint
        const fetchedProducts = await userService.getUserListings();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data.');
      }
    };

    fetchProducts();
    fetchUser();
  }, []);

  const handleUpdateProfile = async (updatedProfile) => {
    try {
      await authService.updateProfile(updatedProfile);
      // Update local user state or refresh user data
      setUser(updatedProfile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        // Update product list after deletion
        setProducts(products.filter(product => product._id !== productId));
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  // ✅ NEW: Function to handle navigation to the edit page
  const handleEditProduct = (productId) => {
    navigate(`/sell?edit=${productId}`);
  };


  return (
    <div className="container py-5">
      <h1>Profile</h1>

      <nav>
        <button
          className={`btn btn-link ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Edit Profile
        </button>
        <button
          className={`btn btn-link ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          My Listings
        </button>
      </nav>

      {error && <div className="alert alert-danger">{error}</div>}

      {activeTab === 'profile' && user && (
        <div>
          <h2>Edit Profile</h2>
          {/* Basic form for updating profile */}
          <form onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.name.value;
            const email = e.target.email.value;
            handleUpdateProfile({ name, email });
          }}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" defaultValue={user.name} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" defaultValue={user.email} />
            </div>
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </div>
      )}

      {activeTab === 'listings' && (
        <div>
          <h2>My Listings</h2>
          {loading && <div>Loading products...</div>}
          {!loading && (
            <div className="row g-3">
              {products.map(product => (
                <div className="col-6 col-md-3" key={product._id}>
                  <ProductCard 
                    product={product} 
                    onDelete={() => handleDeleteProduct(product._id)}
                    onEdit={() => handleEditProduct(product._id)} // ✅ NEW: Pass edit handler
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

}

export default Profile;