import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService'; // Adjust path as needed based on your component's location

const Header = () => {
  const isLoggedIn = authService.isAuthenticated();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #eee' }}>
      <div>
        <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
        <Link to="/products" style={{ marginRight: '15px' }}>Products</Link>
        {/* Add other general navigation links here */}
      </div>
      <div>
        {isLoggedIn ? (
          <Link to="/add-product">
            <button>Create Product</button>
          </Link>
        ) : (
          <p style={{ margin: 0 }}>Please <Link to="/login">log in</Link> to create a product.</p>
        )}
      </div>
    </nav>
  );
};

export default Header;