import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    // Reset submission message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
            <p className="lead text-muted">Have questions? We're here to help!</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body p-4">
                  <h3 className="fw-bold mb-4">📞 Contact Information</h3>
                  
                  <div className="mb-4">
                    <div className="d-flex align-items-start mb-3">
                      <div className="bg-primary rounded-circle p-2 me-3">
                        <span className="text-white">📍</span>
                      </div>
                      <div>
                        <h5 className="fw-bold">Campus Address</h5>
                        <p className="text-muted mb-0">Student Center Building, Room 205</p>
                        <p className="text-muted">University Campus</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-3">
                      <div className="bg-success rounded-circle p-2 me-3">
                        <span className="text-white">✉️</span>
                      </div>
                      <div>
                        <h5 className="fw-bold">Email Us</h5>
                        <p className="text-muted mb-0">support@campusmarketplace.edu</p>
                        <p className="text-muted">help@campusmarketplace.edu</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start">
                      <div className="bg-info rounded-circle p-2 me-3">
                        <span className="text-white">📱</span>
                      </div>
                      <div>
                        <h5 className="fw-bold">Call Us</h5>
                        <p className="text-muted mb-0">+1 (555) 123-4567</p>
                        <p className="text-muted">Mon-Fri: 9am-5pm</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="fw-bold mb-3">📍 Campus Locations</h5>
                    <ul className="list-unstyled">
                      <li className="mb-2">🏫 Main Campus Center</li>
                      <li className="mb-2">📚 Library Help Desk</li>
                      <li className="mb-2">🏢 Student Affairs Office</li>
                      <li>💻 Online Support 24/7</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h3 className="fw-bold mb-4">📝 Send us a Message</h3>
                  
                  {submitted && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      <strong>Thank you!</strong> Your message has been sent. We'll get back to you within 24 hours.
                      <button type="button" className="btn-close" onClick={() => setSubmitted(false)}></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label fw-bold">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label fw-bold">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter your campus email"
                        />
                      </div>
                      
                      <div className="col-12">
                        <label htmlFor="subject" className="form-label fw-bold">Subject</label>
                        <select
                          className="form-select"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="technical">Technical Support</option>
                          <option value="account">Account Issues</option>
                          <option value="report">Report a Problem</option>
                          <option value="suggestion">Suggestion</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="col-12">
                        <label htmlFor="message" className="form-label fw-bold">Message</label>
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="Please describe your inquiry in detail..."
                          style={{ resize: 'none' }}
                        ></textarea>
                      </div>
                      
                      <div className="col-12">
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="terms"
                            required
                          />
                          <label className="form-check-label" htmlFor="terms">
                            I agree to the terms and conditions
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <button type="submit" className="btn btn-primary btn-lg px-4">
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card shadow-sm mt-4">
                <div className="card-body p-4">
                  <h3 className="fw-bold mb-3">❓ Frequently Asked Questions</h3>
                  
                  <div className="accordion" id="faqAccordion">
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                          How do I verify my campus status?
                        </button>
                      </h2>
                      <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                          Use your campus email address (.edu) to sign up. We'll send a verification link to confirm your identity.
                        </div>
                      </div>
                    </div>
                    
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                          Is there a fee for using CampusMarketplace?
                        </button>
                      </h2>
                      <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                          No! CampusMarketplace is completely free for students. We're funded by the university to support student needs.
                        </div>
                      </div>
                    </div>
                    
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                          How do I report a suspicious listing?
                        </button>
                      </h2>
                      <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body">
                          Click the "Report" button on any listing, or contact us directly through this form. Our moderation team reviews all reports within 24 hours.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;