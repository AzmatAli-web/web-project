import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import productService from "../services/productService";
import authService from "../services/authService";
import AddToCartButton from "./Cart/AddToCartButton";
import Icon from "./Icon";
import { FALLBACK_IMAGE } from "../api/config";
export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    loading: true,
    product: null,
    error: "",
  });
  const [attempt, setAttempt] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    let active = true;
    setState({ loading: true, product: null, error: "" });
    productService
      .getProductById(productId)
      .then((product) => {
        if (active) setState({ loading: false, product, error: "" });
      })
      .catch((err) => {
        if (active)
          setState({ loading: false, product: null, error: err.message });
      });
    return () => {
      active = false;
    };
  }, [productId, attempt]);
  if (state.loading)
    return (
      <main className="site-width detail-page">
        <div className="listing-skeleton detail-skeleton" role="status">
          <div />
          <span>Loading item…</span>
        </div>
      </main>
    );
  if (!state.product)
    return (
      <main className="site-width collection-message" role="alert">
        <h1>This find isn't available right now.</h1>
        <p>{state.error}</p>
        <button
          className="button button-dark"
          onClick={() => setAttempt((x) => x + 1)}
        >
          Try again
        </button>
        <Link className="text-link ms-3" to="/browse">
          Explore other finds
        </Link>
      </main>
    );
  const product = state.product;
  const user = authService.getCurrentUser();
  const owner =
    String(product.seller?._id || product.seller) ===
    String(user?.id || user?._id);
  const remove = async () => {
    if (!window.confirm("Delete this listing permanently?")) return;
    setDeleting(true);
    try {
      await productService.deleteProduct(productId);
      navigate("/profile");
    } catch (err) {
      setState((s) => ({ ...s, error: err.message }));
    } finally {
      setDeleting(false);
    }
  };
  return (
    <main className="site-width detail-page">
      <div className="breadcrumbs">
        <Link to="/browse">All finds</Link>
        <span>/</span>
        <Link to={`/category/${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <div className="detail-grid">
        <div className="detail-image">
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </div>
        <section className="detail-copy">
          <span className="eyebrow">A GOOD FIND, A NEW CHAPTER</span>
          <h1>{product.name}</h1>
          <p className="detail-price">
            Rs. {Number(product.price).toLocaleString("en-PK")}
          </p>
          <p className="detail-description">
            {product.description ||
              "Ask the seller for more details about this item."}
          </p>
          <div className="seller-box">
            <span className="seller-avatar">
              <Icon name="user" size={25} />
            </span>
            <div>
              <small>LISTED BY</small>
              <strong>{product.seller?.name || "Campus seller"}</strong>
              {product.location && (
                <span>
                  <Icon name="pin" size={14} /> {product.location}
                </span>
              )}
            </div>
          </div>
          {state.error && (
            <div role="alert" className="alert alert-danger">
              {state.error}
            </div>
          )}
          <AddToCartButton product={product} showQuantity size="lg" />
          <details className="seller-contact">
            <summary>
              Contact the seller <Icon name="arrow" />
            </summary>
            <p>{product.contact || "No phone number provided."}</p>
            {product.seller?.email && (
              <a href={`mailto:${product.seller.email}`}>
                {product.seller.email}
              </a>
            )}
          </details>
          {owner && (
            <div className="owner-actions">
              <Link
                className="button button-outline"
                to={`/sell?edit=${productId}`}
              >
                Edit listing
              </Link>
              <button
                className="text-button text-danger"
                disabled={deleting}
                onClick={remove}
              >
                {deleting ? "Deleting…" : "Delete listing"}
              </button>
            </div>
          )}
          <p className="safety-note">
            <Icon name="shield" size={20} /> Meet in a public campus space.
            Inspect the item before making a payment.
          </p>
        </section>
      </div>
    </main>
  );
}
