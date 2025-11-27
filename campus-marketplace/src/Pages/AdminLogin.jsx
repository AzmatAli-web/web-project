import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      console.log('🟡 Attempting admin login...');
      
      const result = await authService.login({
        email: formData.email,
        password: formData.password
      });

      console.log('✅ Login successful:', result.user);
      
      // ✅ FIXED: Check for 'admin' role
      if (result.user.role === 'admin') {
        console.log('🎉 Admin access granted! Redirecting to admin dashboard...');
        navigate('/admin');
      } else {
        alert('❌ Admin privileges required. Your role: ' + result.user.role);
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      alert('Login failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">🔐 Admin Login</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Admin Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@campus.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Use real password"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-warning w-100"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login as Admin'}
                </button>
              </form>

              <div className="mt-3 p-3 bg-light rounded">
                <h6>📋 Setup Instructions:</h6>
                <ol className="small mb-0">
                  <li>First, register with <strong>admin@campus.com</strong></li>
                  <li>Then login here with same credentials</li>
                  <li>You'll get automatic admin role</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;