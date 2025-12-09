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
    // Use React Router navigation instead of window.location.href to avoid 404 on Vercel
    navigate('/login');
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
            <span className="fw-bold mb-0" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>CampusMarketplace</span>
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
              <li className="nav-item">
                <Link className="nav-link" to="/about" onClick={closeNavbar}>About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={closeNavbar}>Contact</Link>
              </li>
            </ul>
            
            <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 ms-lg-3 mt-2 mt-lg-0 nav-button-group">
              <div className="w-100 w-lg-auto">
                <CartIcon />
              </div>
              
              <Link to="/sell" className="btn btn-success w-100 w-lg-auto mb-2 mb-lg-0" onClick={closeNavbar} style={{ minHeight: '44px' }}>
                ➕ Sell Item
              </Link>
              
              {user ? (
                <div className="d-flex flex-column flex-lg-row gap-2 w-100 w-lg-auto">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="btn btn-warning w-100 w-lg-auto" onClick={closeNavbar} style={{ minHeight: '44px' }}>Admin</Link>
                  )}
                  <Link to="/profile" className="btn btn-info w-100 w-lg-auto" onClick={closeNavbar} style={{ minHeight: '44px' }}>Profile</Link>
                  <button onClick={() => { handleLogout(); closeNavbar(); }} className="btn btn-outline-danger w-100 w-lg-auto" style={{ minHeight: '44px' }}>Logout</button>
                </div>
              ) : (
                <div className="d-flex flex-column flex-lg-row gap-2 w-100 w-lg-auto">
                  <Link to="/login" className="btn btn-primary w-100 w-lg-auto" onClick={closeNavbar} style={{ minHeight: '44px' }}>Login</Link>
                  <Link to="/signup" className="btn btn-primary w-100 w-lg-auto" onClick={closeNavbar} style={{ minHeight: '44px' }}>Sign up</Link>
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