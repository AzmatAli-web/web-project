import { useState, useEffect } from 'react';

function ProfileForm({ user, onUpdate, onDeleteAccount, isDeleting }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await onUpdate(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4">Edit Profile</h4>
      
      {/* Message Alert */}
      {message.text && (
        <div 
          className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}
          role="alert"
        >
          {message.text}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage({ type: '', text: '' })}
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name *
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Account Status</label>
          <div>
            <span className={`badge ${user?.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>
              {user?.status?.toUpperCase() || 'PENDING'}
            </span>
            <small className="text-muted ms-2">
              {user?.status === 'approved' 
                ? 'Your account is active' 
                : 'Waiting for admin approval'
              }
            </small>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Member Since</label>
          <div>
            <span className="text-muted">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </button>
          
          <button
            type="button"
            className="btn btn-danger"
            onClick={onDeleteAccount}
            disabled={loading || isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </button>
        </div>
      </form>

      {/* Profile Info Tips */}
      <div className="mt-4 p-3 bg-light rounded">
        <h6 className="mb-2">💡 Profile Tips</h6>
        <ul className="small mb-0">
          <li>Use your real name for better trust with buyers/sellers</li>
          <li>Keep your email updated to receive important notifications</li>
          <li>Your email will be used for account verification</li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileForm;