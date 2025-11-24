import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

function SellPage() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'books',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await productService.createProduct({
        ...formData,
        price: Number(formData.price),
        id: Date.now() // Simple ID for practice
      });
      
      alert('Product listed successfully!');
      navigate('/'); // Go to homepage after success
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2>➕ Sell Your Item</h2>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Price (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="books">Books</option>
                    <option value="gadgets">Gadgets</option>
                    <option value="stationery">Stationery</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="/images2/product.jpg"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Listing...' : 'List Item for Sale'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellPage;