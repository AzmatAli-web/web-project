import './Herosection.css';
function HeroSection() {
  return (
    <section className="container-fluid py-3 py-md-4 hero-section">
      <div className="mx-auto" style={{ padding: '0 15px', maxWidth: '1700px' }}>
        <div className="position-relative mx-auto" style={{ 
          borderRadius: '15px',
          overflow: 'hidden', 
          minHeight: '300px',
          maxHeight: '600px',
          backgroundImage: "url('/images/backgroundimg.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }}>
          {/* dark overlay */}
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.35)' }}></div>

          <div className="position-relative" style={{ zIndex: 4, height: '100%' }}>
            <div className="d-flex align-items-center justify-content-center h-100" style={{ padding: '20px' }}>
              <div className="w-100 text-center hero-content" style={{ maxWidth: '600px' }}>
                <h1 className="display-5 display-md-4 display-lg-3 fw-bold text-white mb-2 mb-md-3">Buy & Sell with Your Campus Community</h1>
                <p className="text-white-50 mb-3 mb-md-4" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.1rem)' }}>Find affordable books, gadgets, and supplies from fellow students.</p>

                <form className="mt-3 mt-md-4 d-flex justify-content-center search-form" style={{ padding: '0 10px' }}>
                  <div className="input-group shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
                    <input type="text" className="form-control" placeholder="Search items..." aria-label="Search" />
                    <button className="btn btn-primary" type="submit">Search</button>
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