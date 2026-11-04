import { Link } from "react-router-dom";
import Icon from "./Icon";
const faqs = [
  [
    "How do I buy an item?",
    "Explore the listings, open an item, and use “Contact the seller” to see the available contact details. Agree on the price, condition, and handover directly with the seller.",
  ],
  [
    "How do I sell something?",
    "Create an account, log in, and choose “Sell an item”. Add a clear photo, an accurate description, your price, and contact details. You can manage your listings from your profile.",
  ],
  [
    "Where should we meet?",
    "Choose a busy public place on campus, preferably during daylight. Tell someone where you are going. Check the item carefully before paying, and avoid advance transfers to strangers.",
  ],
  [
    "Why are listings not loading?",
    "Use “Try again” on the listings panel. If the issue continues, the marketplace service may be temporarily unavailable. Your account and existing listings are not replaced with sample data.",
  ],
  [
    "Does the marketplace arrange delivery?",
    "Coordinate collection or delivery directly with the seller. Confirm any costs and arrangements before agreeing to a purchase.",
  ],
];
export default function Contact() {
  return (
    <main className="site-width help-page">
      <div className="page-intro">
        <span className="eyebrow">A LITTLE HELP GOES A LONG WAY</span>
        <h1>
          Good questions.
          <br />
          Straightforward answers.
        </h1>
        <p>Everything you need for a better campus exchange.</p>
      </div>
      <div className="help-grid">
        <aside className="help-note">
          <Icon name="shield" size={38} />
          <h2>
            Keep it local.
            <br />
            Keep it safe.
          </h2>
          <p>
            Meet in public. Check before paying. Never share your account
            password or verification codes.
          </p>
          <Link to="/browse" className="text-link">
            Back to the good finds <Icon name="arrow" />
          </Link>
        </aside>
        <div className="faq-list">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Icon name="plus" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
