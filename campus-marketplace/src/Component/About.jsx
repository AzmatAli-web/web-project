import { Link } from "react-router-dom";
import Icon from "./Icon";
export default function About() {
  return (
    <main className="site-width editorial-page">
      <span className="eyebrow">OUR STORY</span>
      <h1>
        Great things.
        <br />
        <em>Second chapters.</em>
      </h1>
      <div className="editorial-grid">
        <p className="lead-copy">
          Campus life comes with enough expenses. Finding what you need
          shouldn't be another one.
        </p>
        <div>
          <p>
            Campus Marketplace brings buying and selling a little closer to
            home. Find textbooks, gadgets, stationery, and everyday accessories
            from other people in your campus community.
          </p>
          <p>
            Finished a course? Upgraded your setup? Pass something useful on to
            the next person. You clear some space, they get a good find, and a
            perfectly good item gets a longer life.
          </p>
          <Link to="/browse" className="button button-dark">
            Find your next chapter <Icon name="arrow" />
          </Link>
        </div>
      </div>
      <div className="story-values">
        <div>
          <Icon name="bag" size={30} />
          <h2>Student budgets.</h2>
          <p>
            Discover pre-loved essentials and compare prices before you buy.
          </p>
        </div>
        <div>
          <Icon name="pin" size={30} />
          <h2>Closer connections.</h2>
          <p>
            Talk directly with sellers and agree on a convenient place to meet.
          </p>
        </div>
        <div>
          <Icon name="leaf" size={30} />
          <h2>Longer lives.</h2>
          <p>Help useful things stay useful, one new owner at a time.</p>
        </div>
      </div>
    </main>
  );
}
