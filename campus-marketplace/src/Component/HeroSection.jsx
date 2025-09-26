 

// Layout-only hero/banner section using Bootstrap utilities.
function HeroSection() {
  return (
    <section className="container-fluid py-4">
      <div className="mx-5" style={{ maxWidth: '1140px' }}>
        <div className="position-relative mx-auto" style={{ borderRadius: 50, overflow: 'hidden', minHeight: 420, backgroundImage: "url('/src/assets/images/images.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {/* dark overlay */}
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.35)' }}></div>

          <div className="position-relative" style={{ zIndex: 2 }}>
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 420, padding: '36px 20px' }}>
              <div className="w-100 text-center" style={{ maxWidth: 920, margin: '0 auto' }}>
                <h1 className="display-5 fw-bold text-white">Buy & Sell with Your Campus Community</h1>
                <p className="lead text-white-50">Find affordable books, gadgets, and supplies from fellow students.</p>

                <form className="mt-4 d-flex justify-content-center">
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
