import { Link } from "react-router-dom";
import Icon from "./Icon";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-width">
        <div className="footer-top">
          <div>
            <Link to="/" className="brand">
              <span className="brand-mark">
                <Icon name="bag" size={23} />
              </span>
              <span>
                campus<span className="brand-light">market.</span>
              </span>
            </Link>
            <p>
              Good things deserve another chapter.
              <br />A marketplace made for campus life.
            </p>
          </div>
          <div>
            <span className="eyebrow">THE MARKETPLACE</span>
            <Link to="/browse">Explore all finds</Link>
            <Link to="/sell">Sell an item</Link>
            <Link to="/profile">Your account</Link>
          </div>
          <div>
            <span className="eyebrow">GOOD TO KNOW</span>
            <Link to="/about">Our story</Link>
            <Link to="/contact">Help & safe trading</Link>
            <Link to="/signup">Join the community</Link>
          </div>
          <span className="footer-message">
            Less waste.
            <br />
            More <em>possibility.</em>
          </span>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Campus Marketplace</span>
          <span>
            Made for students. Made for a second chapter.{" "}
            <Icon name="leaf" size={16} />
          </span>
        </div>
      </div>
    </footer>
  );
}
