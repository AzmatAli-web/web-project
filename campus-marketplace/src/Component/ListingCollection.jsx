import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import Icon from "./Icon";

export default function ListingCollection({
  load,
  limit,
  category = "all",
  sort = "newest",
}) {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: "",
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setState({ products: [], loading: true, error: "" });
    load()
      .then((products) => {
        if (active) setState({ products, loading: false, error: "" });
      })
      .catch((err) => {
        if (active)
          setState({
            products: [],
            loading: false,
            error:
              typeof err === "string"
                ? err
                : err.message || "Could not load listings.",
          });
      });
    return () => {
      active = false;
    };
  }, [load, attempt]);
  let products = state.products.filter(
    (p) => category === "all" || p.category?.toLowerCase() === category,
  );
  if (sort === "price-low")
    products = [...products].sort((a, b) => a.price - b.price);
  else if (sort === "price-high")
    products = [...products].sort((a, b) => b.price - a.price);
  else
    products = [...products].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
  if (limit) products = products.slice(0, limit);
  if (state.loading)
    return (
      <div className="listing-grid" aria-label="Loading listings" role="status">
        {[0, 1, 2, 3].map((i) => (
          <div className="listing-skeleton" key={i}>
            <div />
            <span />
            <span />
          </div>
        ))}
        <span className="visually-hidden">Loading listings…</span>
      </div>
    );
  if (state.error)
    return (
      <div className="collection-message" role="alert">
        <span className="message-icon">
          <Icon name="bag" size={30} />
        </span>
        <h3>We couldn't load the listings.</h3>
        <p>{state.error}</p>
        <button
          className="button button-dark"
          onClick={() => setAttempt((n) => n + 1)}
        >
          Try again <Icon name="arrow" />
        </button>
      </div>
    );
  if (!products.length)
    return (
      <div className="collection-message">
        <span className="message-icon">
          <Icon name="search" size={30} />
        </span>
        <h3>No finds here just yet.</h3>
        <p>Try another category, or be the first to share something great.</p>
        <Link to="/sell" className="button button-dark">
          List an item <Icon name="plus" />
        </Link>
      </div>
    );
  return (
    <div className="listing-grid">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
