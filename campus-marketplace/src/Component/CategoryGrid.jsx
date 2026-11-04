import { Link } from "react-router-dom";
import Icon from "./Icon";
export const categories = [
  {
    id: "books",
    name: "Books",
    description: "Your next chapter",
    icon: "book",
    color: "mint",
  },
  {
    id: "gadgets",
    name: "Gadgets",
    description: "A smarter upgrade",
    icon: "laptop",
    color: "lavender",
  },
  {
    id: "stationery",
    name: "Stationery",
    description: "Make your mark",
    icon: "pen",
    color: "peach",
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "The little essentials",
    icon: "headphones",
    color: "yellow",
  },
];
export default function CategoryGrid() {
  return (
    <section
      id="categories"
      className="site-width section-space categories-section"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">FIND YOUR KIND OF GOOD</span>
          <h2>A little of everything.</h2>
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
