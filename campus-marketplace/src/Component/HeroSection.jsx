import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
export default function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  return (
    <section className="hero site-width">
      <div className="hero-copy">
        <span className="eyebrow">
          <span className="live-dot" /> YOUR CAMPUS. YOUR MARKETPLACE.
        </span>
        <h1>
          Good finds.
          <br />
          Better prices.
          <br />
          <span>Right on campus.</span>
        </h1>
        <p>
          From your next textbook to your next favourite gadget. Buy, sell, and
          give great things a second chapter.
        </p>
        <form
          className="search-box"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(
              query.trim()
                ? `/search?q=${encodeURIComponent(query.trim())}`
                : "/browse",
            );
          }}
        >
          <Icon name="search" size={22} />
          <input
            aria-label="Search campus marketplace"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="button button-dark" type="submit">
            <span>Find it</span>
            <Icon name="arrow" size={19} />
          </button>
        </form>
        <div className="popular-searches">
          <span>Popular:</span>
          {["Books", "Gadgets", "Stationery"].map((x) => (
            <Link key={x} to={`/category/${x.toLowerCase()}`}>
              {x}
              <span>↗</span>
            </Link>
          ))}
        </div>
        <div className="hero-footnote">
          <span className="mini-icon">
            <Icon name="leaf" size={17} />
          </span>
          Less spending. Less waste. More possibilities.
        </div>
      </div>
      <div
        className="hero-art"
        aria-label="Discover books, gadgets and campus essentials"
      >
        <div className="art-orbit" />
        <span className="art-spark spark-one">✳</span>
        <span className="art-caption">
          PRE-LOVED.
          <br />
          RE-DISCOVERED.
        </span>
        <Link to="/category/gadgets" className="showcase showcase-gadget">
          <div className="showcase-image">
            <img src="/images/laptop.jpeg" alt="Explore laptops and gadgets" />
          </div>
          <div className="showcase-info">
            <div>
              <small>UPGRADE YOUR EVERYDAY</small>
              <strong>Gadgets with potential.</strong>
            </div>
            <span className="round-arrow">↗</span>
          </div>
        </Link>
        <Link to="/category/books" className="showcase showcase-book">
          <span className="showcase-tag">A new chapter</span>
          <img src="/images/books.jpeg" alt="Explore second-hand textbooks" />
          <div className="showcase-info">
            <strong>Big ideas. Small prices.</strong>
            <span>↗</span>
          </div>
        </Link>
        <div className="circle-note">
          <Icon name="leaf" size={25} />
          <span>
            Good for you.
            <br />
            Better for the planet.
          </span>
        </div>
        <Link to="/sell" className="floating-note">
          <span className="note-icon">
            <Icon name="plus" />
          </span>
          <span>
            Someone needs
            <br />
            <strong>what you don't.</strong>
          </span>
          <Icon name="arrow" />
        </Link>
        <span className="art-spark spark-two">✳</span>
      </div>
    </section>
  );
}
