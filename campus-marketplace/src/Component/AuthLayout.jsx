import { Link } from "react-router-dom";
import Icon from "./Icon";
export default function AuthLayout({ children, title }) {
  return (
    <main className="site-width auth-layout">
      <aside className="auth-story">
        <span className="eyebrow">A LITTLE MORE COMMUNITY.</span>
        <h1>
          Your campus.
          <br />
          Full of
          <br />
          <em>possibility.</em>
        </h1>
        <p>
          A good find, a fresh start, a second chapter.
          <br />
          It all starts here.
        </p>
        <span className="auth-flower" aria-hidden="true">
          ✳
        </span>
        <Link to="/browse" className="text-link">
          Take a look around <Icon name="arrow" />
        </Link>
      </aside>
      <section className="auth-form">
        <span className="eyebrow">WELCOME TO CAMPUSMARKET</span>
        <h2>{title}</h2>
        {children}
      </section>
    </main>
  );
}
