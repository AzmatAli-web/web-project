import './Herosection.css';
function HeroSection() {
  return (
    <section className="container-fluid py-4">
       
      <div className="mx-5 mx-xl-auto" style={{minWidth:'430px', maxWidth: '1700px'}}>
        <div className="position-relative mx-auto" style={{ 
          borderRadius: 50, 
          overflow: 'hidden', 
          minHeight: 600,
          backgroundImage: "url('/images/backgroundimg.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }}>
          {/* dark overlay */}
          <div className="position-absolute top-3 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.35)' }}></div>

          <div className="position-relative" style={{ zIndex: 4 }}>
            <div className="d-flex align-items-end justify-content-center" style={{ minHeight: 420, padding: '36px 20px' }}>
              <div className="w-100 text-center" style={{ maxWidth: 920, margin: '0 auto' }}>
                {/* Larger heading only on xl+ screens */}
                <h1 className="display-3 display-xl-4 fw-bold text-white">Buy & Sell with Your Campus Community</h1>
                
                {/* Larger paragraph only on xl+ screens */}
                <p className="lead  ext-white-50 lead-xl-4"style={{}}>Find affordable books, gadgets, and supplies from fellow students.</p>

                <form className="mt-4 ms-5 justify-content-center">
                  {/* Wider search bar only on xl+ screens */}
                  <div className="input-group input-group-lg shadow-sm" style={{ maxWidth: '720px' }}>
                    <input type="text" className="form-control rounded-start" placeholder="Search for books, gadgets, stationery..." aria-label="Search" />
                    <button className="btn btn-primary rounded-end" type="submit">Search</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;