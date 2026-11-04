import { useCallback, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import productService from "../services/productService";
import ListingCollection from "../Component/ListingCollection";
import { categories } from "../Component/CategoryGrid";
import Icon from "../Component/Icon";
export default function Browse() {
  const { categoryId } = useParams();
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [sort, setSort] = useState("newest");
  const navigate = useNavigate();
  const load = useCallback(
    () =>
      categoryId
        ? productService.getProductsByCategory(categoryId)
        : query.trim()
          ? productService.searchProducts(query)
          : productService.getAllProducts(),
    [categoryId, query],
  );
  const title = categoryId
    ? categories.find((c) => c.id === categoryId)?.name || categoryId
    : query
      ? `Finds for “${query}”`
      : "Your next good find.";
  return (
    <main className="site-width browse-page">
      <div className="page-intro">
        <span className="eyebrow">THE CAMPUS EDIT</span>
        <h1>{title}</h1>
        <p>Good things, fair prices, and a community close to you.</p>
      </div>
      <form
        className="search-box browse-search"
        onSubmit={(e) => {
          e.preventDefault();
          const q = new FormData(e.currentTarget).get("q");
          navigate(
            q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/browse",
          );
        }}
      >
        <Icon name="search" />
        <input
          key={query}
          defaultValue={query}
          name="q"
          placeholder="Search books, gadgets, and more"
          aria-label="Search products"
        />
        <button className="button button-dark">
          Search <Icon name="arrow" />
        </button>
      </form>
      <div className="browse-toolbar">
        <div className="filter-tabs">
          <Link className={!categoryId ? "active" : ""} to="/browse">
            All finds
          </Link>
          {categories.map((c) => (
            <Link
              className={categoryId === c.id ? "active" : ""}
              to={`/category/${c.id}`}
              key={c.id}
            >
              {c.name}
            </Link>
          ))}
        </div>
        <label className="sort-control">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>
      <ListingCollection load={load} sort={sort} />
    </main>
  );
}
