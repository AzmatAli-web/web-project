import NavigationBar from "./Component/NavigationBar.jsx";
import HeroSection from "./Component/HeroSection.jsx";
import CategoryGrid from "./Component/CategoryGrid.jsx";
import LatestListings from "./Component/LatestListings.jsx";
import CallToAction from "./Component/CallToAction.jsx";
import Footer from "./Component/Footer.jsx";

function LandingPage() {
  const bgStyle = {
    minWidth: '800px',
    minHeight: '100vh',
    backgroundImage: `url('/images/backgroundimg.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="container-fluid " >

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