 

// Layout-only footer. Fill in links and content later.
function Footer() {
  return (
    <footer className="bg-secondary text-white mt-4 mt-md-5 footer-section">
      <div className="container-fluid py-4 py-md-5">
        <div className="row g-3 g-md-0">
          <div className="col-12 col-md-4 mb-2 mb-md-0">
            <h6 className="fw-bold mb-2" style={{ fontSize: '0.95rem' }}>CampusMarketplace</h6>
            <p className="small text-white-50" style={{ lineHeight: '1.6' }}>A student-first marketplace to buy and sell textbooks, gadgets and campus essentials.</p>
          </div>

          <div className="col-6 col-md-4">
            <h6 className="fw-bold mb-2" style={{ fontSize: '0.95rem' }}>Quick Links</h6>
            <ul className="list-unstyled small">
              <li style={{ marginBottom: '8px' }}><a href="#" className="text-white-50 text-decoration-none" style={{ transition: 'opacity 0.2s' }}>Home</a></li>
              <li style={{ marginBottom: '8px' }}><a href="./Sell" className="text-white-50 text-decoration-none" style={{ transition: 'opacity 0.2s' }}>Post an Item</a></li>
              <li style={{ marginBottom: '8px' }}><a href="#" className="text-white-50 text-decoration-none" style={{ transition: 'opacity 0.2s' }}>Help</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <h6 className="fw-bold mb-2" style={{ fontSize: '0.95rem' }}>Contact</h6>
            <p className="small mb-1 text-white-50">email@campusmarketplace.edu</p>
            <p className="small text-white-50">+92 300 0000000</p>
          </div>
        </div>
        <div className="text-center mt-3 mt-md-4 small text-white-50" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>© 2025 CampusMarketplace</div>
      </div>
    </footer>
  );
}

export default Footer;
