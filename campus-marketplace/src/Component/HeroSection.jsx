import React from 'react';

// Layout-only hero/banner section using Bootstrap utilities.
function HeroSection() {
  return (
    <section className="container my-5">
      <div className="row align-items-center" style={{ minHeight: '420px' }}>
        <div className="col-12 col-md-7">
          <div className="p-4" style={{
            backgroundImage: "url('/src/assets/images/images.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px'
          }}>
            <h1 className="display-5 fw-bold text-white">Buy & Sell with Your Campus Community</h1>
            <p className="lead text-white-50">Find affordable books, gadgets, and supplies from fellow students.</p>
            <div className="d-flex gap-2">
              <button className="btn btn-primary">Start Exploring</button>
              <button className="btn btn-outline-light">How it works</button>
            </div>
            <form className="mt-4 d-flex">
              <input className="form-control me-2" type="search" placeholder="Search for books, gadgets..." aria-label="Search" style={{ background: 'rgba(255,255,255,0.75)', border: 'none' }} />
              <button className="btn btn-info" type="submit">Search</button>
            </form>
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div className="row g-2">
            <div className="col-6">
              <img src="/src/assets/images/pic4.jpeg" alt="hero-1" className="img-fluid rounded shadow-sm" style={{ height: '180px', objectFit: 'cover', width: '100%' }} />
            </div>
            <div className="col-6">
              <img src="/src/assets/images/pict6.jpeg" alt="hero-2" className="img-fluid rounded shadow-sm" style={{ height: '180px', objectFit: 'cover', width: '100%' }} />
            </div>
            <div className="col-6">
              <img src="/src/assets/images/pict1.jpeg" alt="hero-3" className="img-fluid rounded shadow-sm" style={{ height: '180px', objectFit: 'cover', width: '100%' }} />
            </div>
            <div className="col-6">
              <img src="/src/assets/images/pict5.jpeg" alt="hero-4" className="img-fluid rounded shadow-sm" style={{ height: '180px', objectFit: 'cover', width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
