import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <header className="shadow-sm" style={{ backgroundColor: '#b1b4b8e0' }}>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand align-items-center" to="/">
            <img
              src="/src/assets/images/logo.png"
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
            // data-bs-toggle="collapse"
            // data-bs-target="#mainNav"
            // aria-controls="mainNav"
            // aria-expanded="false"
            // aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
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
            <div className="d-flex ms-lg-3">
              {/* Add Sell Button Here */}
              <Link to="/sell" className="btn btn-success me-2">
                ➕ Sell Item
              </Link>
              <Link to="/Login" className="btn btn-primary me-2 text-decoration-none">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign up</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavigationBar;