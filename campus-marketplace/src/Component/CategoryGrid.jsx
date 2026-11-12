import { Link } from "react-router-dom";
import Icon from "./Icon";
import { categories } from "../categories";
export default function CategoryGrid() {
  return (
    <section
      id="categories"
      className="site-width section-space categories-section"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">BROWSE BY CATEGORY</span>
          <h2>What’s on your list?</h2>
        </div>
        <Link className="text-link" to="/browse">
          Explore all items <Icon name="arrow" />
        </Link>
      </div>
      <div className="category-grid">
        {categories.map((c, i) => (
          <Link
            to={`/category/${c.id}`}
            className={`category-tile ${c.color}`}
            key={c.id}
          >
            <span className="category-index">0{i + 1}</span>
            <span className="category-icon">
              <Icon name={c.icon} size={38} />
            </span>
            <div>
              <h3>{c.name}</h3>
              <p>{c.description}</p>
            </div>
            <span className="category-arrow">
              <Icon name="arrow" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

