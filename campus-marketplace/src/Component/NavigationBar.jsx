import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import authService from "../services/authService";
import Icon from "./Icon";

export default function NavigationBar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const { getCartCount } = useCart();
  useEffect(() => {
    const sync = () => setUser(authService.getCurrentUser());
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="site-width nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">
            <Icon name="bag" size={23} />
          </span>
          <span>
            campus<span className="brand-light">market.</span>
          </span>
        </Link>
        <button
          className="icon-button mobile-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-controls="main-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
        <nav
          id="main-navigation"
          className={`main-navigation ${open ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          <div className="nav-links">
            <NavLink to="/browse" onClick={close}>
              Explore
            </NavLink>
            <Link to="/#categories" onClick={close}>
              Categories
            </Link>
            <NavLink to="/about" onClick={close}>
              Our story
            </NavLink>
          </div>
          <div className="nav-actions">
            <Link
              className="icon-button cart-link"
              to="/cart"
              aria-label={`Shopping bag, ${getCartCount()} items`}
              onClick={close}
            >
              <Icon name="bag" />
              {getCartCount() > 0 && (
                <span className="cart-count">{getCartCount()}</span>
              )}
            </Link>
            {user ? (
              <>
                <Link className="nav-account" to="/profile" onClick={close}>
                  <Icon name="user" />
                  {user.name?.split(" ")[0] || "Profile"}
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={close}>
                    Admin
                  </Link>
                )}
                <button
                  className="text-button"
                  onClick={() => {
                    authService.logout();
                    close();
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link className="nav-account" to="/login" onClick={close}>
                Log in
              </Link>
            )}
            <Link
              className="button button-dark button-small"
              to="/sell"
              onClick={close}
            >
              <Icon name="plus" size={17} /> Sell an item
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
