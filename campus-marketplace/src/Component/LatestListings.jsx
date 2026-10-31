import { useState } from "react";
import { Link } from "react-router-dom";
import ListingCollection from "./ListingCollection";
import productService from "../services/productService";
import Icon from "./Icon";
const load = () => productService.getAllProducts();
export default function LatestListings() {
  const [category, setCategory] = useState("all");
  return (
    <section id="latest" className="site-width section-space">
      <div className="section-heading">
        <div>
          <span className="eyebrow">FRESH FINDS, FRESH POSSIBILITIES</span>
          <h2>Just landed on campus.</h2>
        </div>
        <Link className="text-link" to="/browse">
          View all listings <Icon name="arrow" />
        </Link>
      </div>
      <div className="filter-tabs" aria-label="Filter latest listings">
        {["all", "books", "gadgets", "stationery", "accessories"].map((c) => (
          <button
            key={c}
            className={category === c ? "active" : ""}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c === "all" ? "All finds" : c}
          </button>
        ))}
      </div>
      <ListingCollection load={load} limit={8} category={category} />
    </section>
  );
}
