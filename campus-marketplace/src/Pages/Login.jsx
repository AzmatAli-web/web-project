import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert('Please fill in both email and password');
      return;
    }

    alert('Login successful!');
    navigate('/');
  };

  return (
    <div 
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('/src/assets/images/loginimg3.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Transparent Card - Same as before */}
      <div 
        className="card position-relative" 
        style={{ 
          width: '100%', 
          maxWidth: '400px',  
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '15px',
        }}
      >
        <div className="card-body p-4">
          {/* Welcome Section - Same styling */}
          <div className="text-center mb-4">
            <h1 className="fw-bold mb-1" style={{ fontSize: '30px', color: '#1a1a1a' }}>
              WELCOME
            </h1>
            <h2 className="h5 text-muted" style={{ fontSize: '24px', color: '#333' }}>BACK!</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                style={{ borderRadius: '8px', padding: '12px' }}
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                style={{ borderRadius: '8px', padding: '12px' }}
                required
              />
            </div>

            {/* Forgot Password link */}
            <div className="text-end mb-4">
              <a href="/forgot-password" className="text-decoration-none text-primary">
                Forgot password?
              </a>
            </div>

            {/* Login Button - Same green color */}
            <button 
              type="submit" 
              className="btn w-100 mb-3 text-white fw-bold border-0"
              style={{ 
                padding: '12px', 
                backgroundColor: '#5cb85c', 
                borderRadius: '8px',
                fontSize: '18px'
              }}
            >
              LOG IN
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-muted mb-0">
                Don't have an account? <a href="/signup" className="text-decoration-none text-primary">Sign up</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;