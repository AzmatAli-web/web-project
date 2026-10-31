import HeroSection from "./Component/HeroSection";
import CategoryGrid from "./Component/CategoryGrid";
import LatestListings from "./Component/LatestListings";
import CallToAction from "./Component/CallToAction";
import Icon from "./Component/Icon";
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <div className="value-strip">
        <div className="site-width">
          <span>
            <Icon name="bag" />
            Buy better, spend less
          </span>
          <span>
            <Icon name="pin" />
            Find it close to campus
          </span>
          <span>
            <Icon name="leaf" />
            Give good things a second life
          </span>
        </div>
      </div>
      <CategoryGrid />
      <LatestListings />
      <section className="site-width section-space how-it-works">
        <div>
          <span className="eyebrow">LESS HASSLE. MORE CAMPUS LIFE.</span>
          <h2>
            A good deal.
            <br />
            In three simple steps.
          </h2>
        </div>
        <div className="steps">
          {[
            [
              "01",
              "Find your thing",
              "Browse the essentials or search for something specific.",
            ],
            [
              "02",
              "Make a connection",
              "Check the details and contact the seller directly.",
            ],
            [
              "03",
              "Meet. Check. Enjoy.",
              "Meet on campus, inspect the item, and agree on a handover.",
            ],
          ].map(([n, t, p]) => (
            <div key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <CallToAction />
    </>
  );
}
