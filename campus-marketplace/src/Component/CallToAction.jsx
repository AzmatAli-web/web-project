 

// Layout-only call-to-action section.
function CallToAction() {
  return (
    <section className="container-fluid my-4 my-md-5 cta-section" style={{ padding: '0 10px' }}>
      <div className="card bg-primary text-white cta-card" style={{ border: 'none', borderRadius: '12px' }}>
        <div className="card-body text-center py-4 py-md-5">
          <h3 className="mb-2 mb-md-3" style={{ fontWeight: '700', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}>Ready to sell your item?</h3>
          <p className="mb-3 mb-md-4" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', opacity: 0.95 }}>Reach thousands of students on campus — it's quick and easy to post an item.</p>
          <div className="cta-buttons d-flex flex-column flex-md-row justify-content-center gap-2">
            {/* Link to the Sell page */}
            <a href="/sell" style={{ minWidth: 'fit-content', flex: '1 1 auto', maxWidth: '200px' }}><button className="btn btn-outline-light w-100">post an item</button></a>
            <button className="btn btn-outline-light w-100" style={{ maxWidth: '200px' }}>Learn more</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
