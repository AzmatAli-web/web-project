import { Link } from "react-router-dom";
import Icon from "./Icon";
export default function CallToAction() {
  return (
    <section className="site-width section-space">
      <div className="sell-banner">
        <div>
          <span className="eyebrow">CLEAR SOME SPACE. MAKE SOMEONE'S DAY.</span>
          <h2>
            Your old favourite.
            <br />
            Their new favourite.
          </h2>
          <p>
            That textbook you finished. Those headphones you upgraded.
            <br />
            Give them a new home, right here on campus.
          </p>
          <Link to="/sell" className="button button-cream">
            Let's list it <Icon name="arrow" />
          </Link>
        </div>
        <div className="banner-graphic" aria-hidden="true">
          <span>↗</span>
          <div>
            PASS IT
            <br />
            <em>forward.</em>
          </div>
        </div>
      </div>
    </section>
  );
}
