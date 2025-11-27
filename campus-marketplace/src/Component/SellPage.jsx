import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import productService from '../services/productService';

function SellPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    contact: '',
    location: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null); // To store URL of existing product image
  const [removeImageFlag, setRemoveImageFlag] = useState(false); // Flag to tell backend to remove image

  // Effect to clean up object URL when imagePreview changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Check authentication and load product data for edit mode
  useEffect(() => {
    const checkAuthAndLoadProduct = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        alert('Please login to sell items');
        navigate('/login');
        return;
      }
      
      try {
        setUser(JSON.parse(userData));
        setAuthChecked(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      // Check if in edit mode
      const editId = searchParams.get('edit');
      if (editId) {
        setIsEditMode(true);
        setEditingProductId(editId);
        setLoading(true);
        try {
          const productToEdit = await productService.getProductById(editId);
          if (productToEdit) {
            setFormData({
              name: productToEdit.name || '',
              category: productToEdit.category || '',
              price: productToEdit.price || '',
              description: productToEdit.description || '',
              contact: productToEdit.contact || '',
              location: productToEdit.location || ''
            });
            // Set current image URL for preview if available
            if (productToEdit.hasImage) {
              // ✅ FIXED: Use the correct relative path for the image preview
              setCurrentImageUrl(`/api/products/${productToEdit._id}/image`);
            }
          }
        } catch (error) {
          console.error('Error fetching product for edit:', error);
          alert('Failed to load product for editing. Please try again.');
          navigate('/sell'); // Go back to create mode
        } finally {
          setLoading(false);
        }
      } else {
        setIsEditMode(false);
        setEditingProductId(null);
        setCurrentImageUrl(null);
      }
    };

    checkAuthAndLoadProduct();
  }, [navigate, searchParams, location.search]); // Depend on searchParams and location.search for re-evaluation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WebP)');
        e.target.value = null; // Clear the input
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Image size should be less than 5MB');
        e.target.value = null; // Clear the input
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImageFlag(false); // If new image is uploaded, don't remove existing one
      setCurrentImageUrl(null); // Clear current image preview if new file is selected
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    if (window.confirm('Are you sure you want to remove the current image?')) {
      setImageFile(null);
      setImagePreview(null);
      setCurrentImageUrl(null);
      setRemoveImageFlag(true); // Set flag to remove image on backend
      // Clear file input if it exists
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication again before submission
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      alert('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    setLoading(true);
    
    if (!formData.name || !formData.category || !formData.price) {
      alert('Please fill all required fields.');
      setLoading(false);
      return;
    }

    if (!isEditMode && !imageFile) { // Image is required only for new product creation
      alert('Please upload an image for the new product.');
      setLoading(false);
      return;
    }

    try {
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('price', Number(formData.price));
      productData.append('description', formData.description);
      productData.append('category', formData.category);
      productData.append('contact', formData.contact);
      productData.append('location', formData.location);

      if (imageFile) {
        productData.append('image', imageFile);
      } else if (isEditMode && removeImageFlag) {
        productData.append('removeImage', 'true'); // Tell backend to remove image
      }

      // Get user data for backend (if needed, though auth middleware should handle seller ID)
      // const currentUser = JSON.parse(userData);
      // productData.append('userId', currentUser.id);

      console.log('🟡 Sending to backend...');
      
      let result;
      if (isEditMode) {
        result = await productService.updateProduct(editingProductId, productData);
        alert('✅ Product updated successfully!');
      } else {
        result = await productService.createProduct(productData);
        alert('✅ Product listed successfully!');
      }
      
      console.log('✅ SUCCESS! Product operation:', result);
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
        contact: '',
        location: ''
      });
      setImageFile(null);
      setImagePreview(null);
      setCurrentImageUrl(null);
      setRemoveImageFlag(false);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      navigate('/');
      
    } catch (error) {
      console.error('❌ ERROR product operation:', error);
      alert('❌ Failed to ' + (isEditMode ? 'update' : 'list') + ' product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Don't render until auth check and initial product loading for edit mode is complete
  if (!authChecked || (isEditMode && loading)) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          
          {/* User Info Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 fw-bold text-primary">{isEditMode ? 'Edit Your Product' : 'Sell Your Item'}</h1>
              <p className="text-muted">Quick and easy - reach students in minutes</p>
            </div>
            {user && (
              <div className="text-end">
                <small className="text-muted">Logged in as</small>
                <br />
                <strong>{user.name || user.email}</strong>
              </div>
            )}
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
                  <label className="form-label fw-semibold">Product Image {isEditMode && !currentImageUrl && !imagePreview ? '*' : ''}</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageChange}
                    required={!isEditMode || (!currentImageUrl && !imagePreview)} // Required for new products or if no image exists in edit mode
                  />
                  
                  {(imagePreview || currentImageUrl) && (
                    <div className="mt-3">
                      <p className="small text-muted mb-2">Image Preview:</p>
                      <img 
                        src={imagePreview || currentImageUrl} 
                        alt="Preview" 
                        className="img-thumbnail"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                      />
                      {isEditMode && ( // Show remove button only in edit mode
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={handleRemoveImage}
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  )}
                  
                  <div className="form-text">
                    Supported formats: JPEG, PNG, WebP (Max 5MB)
                  </div>
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
                    disabled={loading || !user}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {isEditMode ? 'Updating...' : 'Listing...'}
                      </>
                    ) : (
                      isEditMode ? 'Update Product' : 'List My Product'
                    )}
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
              <li>Add clear photos for better visibility</li>
              <li>Set a reasonable price for quick sale</li>
              <li>Be ready to negotiate</li>
              <li>Meet in safe public places on campus</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SellPage;