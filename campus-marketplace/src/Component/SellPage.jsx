import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SellPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    price: '',
    description: '',
    contact: '',
    location: ''
     
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.productName || !formData.category || !formData.price || !formData.contact) {
      alert('Please fill all required fields');
      return;
    }

    // Show success message
    alert('✅ Product listed successfully!');
    
    // Reset form
    setFormData({
      productName: '',
      category: '',
      price: '',
      description: '',
      contact: '',
      location: ''
    });
    
    // Go back to home
    navigate('/');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary">Sell Your Item</h1>
            <p className="text-muted">Quick and easy - reach students in minutes</p>
          </div>

          {/* Simple Form */}
          <div className="card shadow">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                {/* Product Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="What are you selling?"
                    required
                  />
                </div>

                {/* Category and Price Row */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Category *</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose category</option>
                      <option value="books">Books</option>
                      <option value="gadgets">Gadgets</option>
                      <option value="stationery">Stationery</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Price (Rs.) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="500"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your item..."
                  ></textarea>
                </div>

                {/* Contact Info */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Your Contact *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Your city/area"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg">
                    List My Product
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="fw-semibold">💡 Quick Tips:</h6>
            <ul className="small mb-0">
              <li>Add clear photos when you contact buyers</li>
              <li>Be ready to negotiate price</li>
              <li>Meet in safe public places</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SellPage;