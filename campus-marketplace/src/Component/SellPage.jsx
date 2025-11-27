import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

function SellPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    contact: '',
    location: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.name || !formData.category || !formData.price || !imageFile) {
      alert('Please fill all required fields and upload an image.');
      setLoading(false);
      return;
    }

    try {
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('price', Number(formData.price));
      productData.append('description', formData.description);
      productData.append('category', formData.category);
      productData.append('image', imageFile);
      productData.append('contact', formData.contact);
      productData.append('location', formData.location);

      console.log('🟡 Sending to backend...');
      
      const result = await productService.createProduct(productData);
      console.log('✅ SUCCESS! Product created:', result);
      
      alert('✅ Product listed successfully!');
      
      navigate('/');
      
    } catch (error) {
      console.error('❌ ERROR creating product:', error);
      alert('❌ Failed to list product: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary">Sell Your Item</h1>
            <p className="text-muted">Quick and easy - reach students in minutes</p>
          </div>

          <div className="card shadow">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="What are you selling?"
                    required
                  />
                </div>

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

                <div className="mb-3">
                  <label className="form-label fw-semibold">Product Image *</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                    required
                  />
                </div>

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

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? 'Listing...' : 'List My Product'}
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

          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="fw-semibold">💡 Quick Tips:</h6>
            <ul className="small mb-0">
              <li>Add clear photos</li>
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