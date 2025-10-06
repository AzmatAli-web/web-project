import { useState } from "react";
import Button from "../Component/Button"; // Assuming Button component is used for the login button

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        alert('Login successful!');
        // Redirect to dashboard
      }, 2000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div 
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('/src/assets/images/loginimg3.png')", // Ensure this path is correct for your project
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // maxWidth:'1500px',
        // marginBlockEnd:'12px',
        position: 'relative'
      }}
    >
      {/* The main container from your image which holds the form */}
      <div 
        className="card position-relative" 
        style={{ 
          width: '100%', 
          maxWidth: '700px', // Adjusted to better match the visual width in the image
          backgroundColor: 'rgba(255, 255, 255, 0.3)', // Slightly more opaque for readability
          borderRadius: '15px', // Rounded corners as in the image
          
          
          }}
      >
        <div className="card-body">
          {/* Welcome Section - matching the image's text */}
          <div className="text-center mb-4">
            <h1 className="fw-bold mb-1" style={{ fontSize: '30px', color: '#1a1a1a' }}>
              WELCOME
            </h1>
            <h2 className="h5 text-muted" style={{ fontSize: '24px', color: '#333' }}>BACK!</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              {/* Labels are removed as per the image's design */}
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email" // Placeholder matches the image
                style={{ borderRadius: '8px', padding: '12px' }}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Password Field */}
            <div className="mb-4"> {/* Increased margin-bottom for spacing */}
              {/* Labels are removed as per the image's design */}
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password" // Placeholder matches the image
                style={{ borderRadius: '8px', padding: '12px' }}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            {/* Forgot Password link - Remember Me checkbox is not in the image */}
            <div className="text-end mb-4"> {/* Aligned to end as per image */}
              <a href="/forgot-password" className="text-decoration-none" style={{ color: '#007bff' }}>Forgot password?</a>
            </div>

            {/* Login Button - using your Button component */}
            <Button 
              type="submit" 
              loading={loading}
              disabled={loading}
              className="w-100 mb-3"
              style={{ 
                padding: '12px', 
                backgroundColor: '#5cb85c', // Green color from the image
                borderColor: '#5cb85c', 
                borderRadius: '8px', // Rounded button
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              {loading ? 'LOGGING IN...' : 'LOG IN'}
            </Button>

            {/* Sign Up Link - not explicitly in the image but good to keep for navigation */}
            {/* You can remove this div if you strictly want to match the image's content */}
            <div className="text-center mt-3">
              <p className="text-muted mb-0">
                Don't have an account? <a href="/signup" className="text-decoration-none" style={{ color: '#007bff' }}>Sign up</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;