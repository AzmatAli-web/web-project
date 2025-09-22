 

import React from 'react';

// Navbar for CampusMarketplace. Uses logo from assets.
const NavigationBar = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center">
          <a className="navbar-brand d-flex align-items-center me-4" href="#">
            <img src="/src/assets/images/picture3.png" alt="logo" width="36" height="36" className="me-2" />
            <span className="fw-bold">CampusMarketplace</span>
          </a>

          <ul className="nav d-none d-lg-flex">
            <li className="nav-item"><a className="nav-link px-3" href="#books">Books</a></li>
            <li className="nav-item"><a className="nav-link px-3" href="#gadgets">Gadgets</a></li>
            <li className="nav-item"><a className="nav-link px-3" href="#stationery">Stationery</a></li>
            <li className="nav-item"><a className="nav-link px-3" href="#accessories">Accessories</a></li>
          </ul>
        </div>

        <div className="d-flex align-items-center">
          <form className="d-none d-md-flex align-items-center">
            <input className="form-control form-control-sm me-2" type="search" placeholder="Search items, e.g. calculus" aria-label="Search" />
            <button className="btn btn-outline-secondary btn-sm" type="submit">Search</button>
          </form>

          <div className="ms-3 d-flex gap-2">
            <button className="btn btn-outline-primary btn-sm">Login</button>
            <button className="btn btn-primary btn-sm">Sell</button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavigationBar;