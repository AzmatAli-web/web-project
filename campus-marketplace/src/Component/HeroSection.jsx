import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  function search(event) {
    event.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/browse");
  }
  return (
    <section className="market-hero site-width" aria-labelledby="hero-title">
      <div className="hero-editorial">
        <div className="hero-kicker"><span className="edition-dot" /> THE STUDENT-TO-STUDENT MARKETPLACE</div>
        <h1 id="hero-title">Big campus<br />energy.<br /><span>Small prices.</span><span className="hero-asterisk" aria-hidden="true">✳</span></h1>
        <p>The stuff you need. From the people around you.<br className="desktop-break" /> Buy, sell, and make room for what’s next.</p>
        <form className="search-box hero-search" onSubmit={search} role="search">
          <Icon name="search" size={22} />
          <input aria-label="Search campus marketplace" placeholder="Textbooks, laptops, your next find…" value={query} onChange={(event) => setQuery(event.target.value)} />
          <button className="button button-dark" type="submit"><span>Find it</span><Icon name="arrow" size={19} /></button>
        </form>
        <div className="hero-quick-links"><span>START WITH</span>{["Books", "Gadgets", "Stationery"].map(name => <Link key={name} to={`/category/${name.toLowerCase()}`}>{name} ↗</Link>)}</div>
        <div className="hero-bottom-note"><Icon name="pin" size={17} /><span>Close to campus. Closer to a good deal.</span></div>
      </div>
      <div className="editorial-board">
        <div className="board-heading"><span>THE CAMPUS EDIT</span><span>GOOD FINDS, ON REPEAT ↗</span></div>
        <Link to="/category/gadgets" className="edit-feature">
          <div className="edit-feature-top"><span className="edit-pill">THE EVERYDAY UPGRADE</span><span className="edit-circle"><Icon name="arrow" size={25} /></span></div>
          <img src="/images/laptop.jpeg" alt="A laptop from the gadgets collection" fetchPriority="high" />
          <div className="edit-feature-bottom"><h2>New semester.<br />Next-level setup.</h2><span>EXPLORE GADGETS</span></div>
        </Link>
        <div className="edit-bottom-grid">
          <Link to="/category/books" className="edit-books"><div><span className="eyebrow">MORE KNOWLEDGE.<br />LESS SPENDING.</span><h3>Turn a<br />new page.</h3><span className="edit-book-link">Shop books ↗</span></div><img src="/images/books.jpeg" alt="A stack of pre-loved books" /></Link>
          <Link to="/sell" className="edit-sell"><Icon name="plus" size={30} /><h3>Not using it?<br />Pass it on.</h3><span>List your first item <Icon name="arrow" size={18} /></span></Link>
        </div>
        <div className="board-footnote"><Icon name="leaf" size={15} /><span>A second life looks good on everything.</span></div>
      </div>
    </section>
  );
}
