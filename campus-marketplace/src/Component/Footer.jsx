 

// Layout-only footer. Fill in links and content later.
function Footer() {
  return (
    <footer className="bg-secondary text-white mt-5">
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12 col-md-4 mb-3 mb-md-0">
            <h6 className="fw-bold">CampusMarketplace</h6>
            <p className="small text-white-50">A student-first marketplace to buy and sell textbooks, gadgets and campus essentials.</p>
          </div>

          <div className="col-6 col-md-4">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><a href="#" className="text-white-50">Home</a></li>
              <li><a href="./Sell" className="text-white-50">Post an Item</a></li>
              <li><a href="#" className="text-white-50">Help</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <h6 className="fw-bold">Contact</h6>
            <p className="small mb-1 text-white-50">email@campusmarketplace.edu</p>
            <p className="small text-white-50">+92 300 0000000</p>
          </div>
        </div>
        <div className="text-center mt-3 small text-white-50">© 2025 CampusMarketplace</div>
      </div>
    </footer>
  );
}

export default Footer;
