import { Link } from 'react-router-dom';
import CartIcon from './Cart/CartIcon';

// Read current user from localStorage to show admin link when appropriate
const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

function NavigationBar() {
  return (
    <header className="shadow-sm" style={{ backgroundColor: '#b1b4b8e0' }}>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand align-items-center" to="/">
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
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#categories">Categories</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
            </ul>
            
            <div className="d-flex align-items-center ms-lg-3">
              <div className="me-2">
                <CartIcon />
              </div>
              
              <Link to="/sell" className="btn btn-success me-2">
                ➕ Sell Item
              </Link>
              
              {/* Show Admin link when user.role === 'admin' */}
              {(() => {
                const user = getCurrentUser();
                if (user && user.role === 'admin') {
                  return (
                    <Link to="/Admin" className="btn btn-warning me-2">Admin</Link>
                  );
                }
                return null;
              })()}

              <Link to="/Login" className="btn btn-primary me-2 text-decoration-none">Login</Link>
              <Link to="/signup" className="btn btn-primary me-2">Sign up</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavigationBar;