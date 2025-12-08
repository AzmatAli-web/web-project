import React from 'react';

const About = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">About CampusMarketplace</h1>
            <p className="lead text-muted">Connecting students through a trusted campus trading platform</p>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-3">🎓 Our Mission</h2>
              <p className="fs-5">
                CampusMarketplace is designed to create a safe, convenient, and sustainable ecosystem 
                where students can buy, sell, and exchange items within their campus community. 
                We aim to reduce waste, save students money, and build a stronger campus community.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary rounded-circle p-3 me-3">
                      <span className="text-white fs-4">🛒</span>
                    </div>
                    <h3 className="fw-bold mb-0">For Students</h3>
                  </div>
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Buy affordable textbooks and supplies</li>
                    <li className="mb-2">✓ Sell items you no longer need</li>
                    <li className="mb-2">✓ Find dorm essentials and furniture</li>
                    <li className="mb-2">✓ Trade with trusted campus peers</li>
                    <li className="mb-2">✓ Save money and reduce waste</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success rounded-circle p-3 me-3">
                      <span className="text-white fs-4">🏛️</span>
                    </div>
                    <h3 className="fw-bold mb-0">For Campus</h3>
                  </div>
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Promote sustainable practices</li>
                    <li className="mb-2">✓ Reduce campus waste</li>
                    <li className="mb-2">✓ Support student entrepreneurship</li>
                    <li className="mb-2">✓ Build stronger campus community</li>
                    <li className="mb-2">✓ Provide safe trading environment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-3">📊 How It Works</h2>
              <div className="row text-center">
                <div className="col-md-3 mb-3">
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <span className="fs-2">1️⃣</span>
                  </div>
                  <h5>Sign Up</h5>
                  <p className="text-muted">Create account with campus email</p>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <span className="fs-2">2️⃣</span>
                  </div>
                  <h5>List Items</h5>
                  <p className="text-muted">Post items with photos & prices</p>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <span className="fs-2">3️⃣</span>
                  </div>
                  <h5>Connect</h5>
                  <p className="text-muted">Message buyers/sellers securely</p>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <span className="fs-2">4️⃣</span>
                  </div>
                  <h5>Trade</h5>
                  <p className="text-muted">Meet safely on campus</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-3">🛡️ Safety Features</h2>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-start">
                    <span className="text-success fs-4 me-2">✓</span>
                    <div>
                      <h5>Campus Verification</h5>
                      <p className="text-muted">All users verified with campus credentials</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-start">
                    <span className="text-success fs-4 me-2">✓</span>
                    <div>
                      <h5>Secure Messaging</h5>
                      <p className="text-muted">Built-in chat for safe communication</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-start">
                    <span className="text-success fs-4 me-2">✓</span>
                    <div>
                      <h5>Rating System</h5>
                      <p className="text-muted">Rate buyers and sellers for trust</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <div className="bg-light rounded p-4">
              <h3 className="fw-bold mb-3">Join Our Community</h3>
              <p className="fs-5 mb-4">
                Thousands of students are already buying, selling, and saving on CampusMarketplace.
              </p>
              <a href="/signup" className="btn btn-primary btn-lg px-4">Get Started</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;