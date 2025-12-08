import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Added useState
import CartIcon from './Cart/CartIcon';

// Read current user from localStorage to show admin link when appropriate
const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    const token = localStorage.getItem('token');
    return token && user ? user : null; // Only return user if token also exists
  } catch (e) {
    return null;
  }
};

function NavigationBar() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isNavOpen, setIsNavOpen] = useState(false); // State for navbar toggle

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // We use window.location.href to force a full refresh, which re-evaluates getCurrentUser()
    window.location.href = '/login'; 
  };

  // Function to close navbar when a link is clicked (for mobile)
  const closeNavbar = () => {
    setIsNavOpen(false);
  };

  return (
    <header className="shadow-sm" style={{ backgroundColor: '#b1b4b8e0' }}>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeNavbar}>
            <img
              src="/images/logo.png"  
              alt="logo"
              width="40"
              height="40"
              className="me-2"
              style={{ borderRadius: '40%' }}
            />
            <span className="fw-bold mb-0">CampusMarketplace</span>
          </Link>
          
          {/* Toggle Button - Fixed with manual state control */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          {/* Navbar Collapse - Controlled by state */}
          <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={closeNavbar}>Home</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#categories" onClick={closeNavbar}>Categories</a>
              </li>
              {/* Fixed: Changed from anchor tags to Link components */}
              <li className="nav-item">
                <Link className="nav-link" to="/about" onClick={closeNavbar}>About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={closeNavbar}>Contact</Link>
              </li>
            </ul>
            
            <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 ms-lg-3">
              <div className="mb-2 mb-lg-0 me-lg-2">
                <CartIcon />
              </div>
              
              <Link to="/sell" className="btn btn-success mb-2 mb-lg-0 me-lg-2" onClick={closeNavbar}>
                ➕ Sell Item
              </Link>
              
              {user ? (
                <div className="d-flex flex-column flex-lg-row gap-2">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="btn btn-warning" onClick={closeNavbar}>Admin</Link>
                  )}
                  <Link to="/profile" className="btn btn-info" onClick={closeNavbar}>Profile</Link>
                  <button onClick={() => { handleLogout(); closeNavbar(); }} className="btn btn-outline-danger">Logout</button>
                </div>
              ) : (
                <div className="d-flex flex-column flex-lg-row gap-2">
                  <Link to="/login" className="btn btn-primary" onClick={closeNavbar}>Login</Link>
                  <Link to="/signup" className="btn btn-primary" onClick={closeNavbar}>Sign up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavigationBar;