import NavigationBar from "./Component/NavigationBar.jsx";
import HeroSection from "./Component/HeroSection.jsx";
import CategoryGrid from "./Component/CategoryGrid.jsx";
import LatestListings from "./Component/LatestListings.jsx";
import CallToAction from "./Component/CallToAction.jsx";
import Footer from "./Component/Footer.jsx";

function LandingPage() {
  return (
    <div className="container-fluid " style ={{minWidth:'800px'}}>
    
      <NavigationBar />
      <main>
        <HeroSection />
        <CategoryGrid />
        <LatestListings />
        <CallToAction />
      </main>
      <Footer />
    
  </div>);
}

export default LandingPage;