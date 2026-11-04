import { Link } from "react-router-dom";
import AddToCartButton from "./Cart/AddToCartButton";
import Icon from "./Icon";
import { FALLBACK_IMAGE } from "../api/config";
export default function ProductCard({ product }) {
  const seller =
    typeof product.seller === "object" ? product.seller?.name : null;
  return (
    <article className="listing-card">
      <Link to={`/product/${product._id}`} className="listing-image">
        <img
          src={product.imageUrl || FALLBACK_IMAGE}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        <span className="listing-category">
          {product.category || "Campus find"}
        </span>
        <span className="listing-open">
          <Icon name="arrow" />
        </span>
      </Link>
      <div className="listing-body">
        <div className="listing-meta">
          <span>{seller || "Campus seller"}</span>
          {product.createdAt && (
            <time dateTime={product.createdAt}>
              {new Date(product.createdAt).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "short",
              })}
            </time>
          )}
        </div>
        <h3>
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="listing-price">
          Rs. {Number(product.price).toLocaleString("en-PK")}
        </div>
        {product.location && (
          <p className="listing-location">
            <Icon name="pin" size={14} />
            {product.location}
          </p>
        )}
        <div className="listing-actions">
          <AddToCartButton product={product} size="sm" />
          <Link
            to={`/product/${product._id}`}
            className="details-link"
            aria-label={`View ${product.name}`}
          >
            <Icon name="arrow" size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
