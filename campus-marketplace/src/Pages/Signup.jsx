import { useState } from "react";
import FormInput from "../Component/FormInput";
import Button from "../Component/Button";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
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

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      
        alert('Account created successfully!');
        // Redirect to login or dashboard
       
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="container-fluid min-vh-300 d-flex align-items-center justify-content-center bg-light p-3 p-md-5">
      {/* Main Card Container for both Image and Form */}
      <div 
        className="card shadow-lg overflow-hidden" 
        style={{ 
          width: '100%', 
          // maxWidth: '',
          borderRadius: '15px'
        }}
      >
        <div className="row g-0">
          
          {/* Left Column for the Image (Hidden on small screens) */}
          <div className="col-lg-6 d-none d-lg-block">
            <div 
              className="h-700" 
              style={{
                 
                backgroundImage: "url('/src/assets/images/signup3.png')", 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '1200px'
                }}
            >
              {/* Optional content or overlay here */}
              <div className=" align-items-center justify-content-center h-100 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                  <div className="text-white text-center">
                    <h1 className="display-3 text-center fw-bold" style={{marginTop:"18pc", padding:"5pc"}}>Welcome Future Scholar</h1>
                    <p className="lead text-center" style={{textSizeAdjust:"89px"}}>Create your account to start buying and selling on the campus marketplace.</p>
                  </div>
              </div>
            </div>
          </div>

          {/* Right Column for the Signup Form */}
          <div className="col-lg-6">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h1 className="h3 fw-bold text-primary">Campus Marketplace</h1>
                <h2 className="h5 text-muted mt-2">Join Campus Marketplace</h2>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Full Name Field - Now in its own line */}
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder="Enter your full name"
                  required
                />

                {/* Email Address Field - Now in its own line */}
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="student@campus.edu"
                  required
                />

                {/* Student ID Field - Now in its own line */}
                <FormInput
                  label="Student ID"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  error={errors.studentId}
                  placeholder="Enter your student ID"
                  required
                />

                {/* Password Field - Now in its own line */}
                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Create a password"
                  required
                />

                {/* Confirm Password - Now in its own line */}
                <FormInput
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  required
                />

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
                      id="agreeToTerms"
                    />
                    <label className="form-check-label" htmlFor="agreeToTerms">
                      I agree to the <a href="/terms" className="text-decoration-none">Terms & Conditions</a>
                    </label>
                  </div>
                  {errors.agreeToTerms && <div className="invalid-feedback d-block">{errors.agreeToTerms}</div>}
                </div>

                <Button 
                  type="submit" 
                  loading={loading}
                  disabled={loading}
                  className="w-100 mb-3"
                  size="lg"
                >
                  Create Account
                </Button>

                <div className="text-center">
                  <p className="text-muted">
                    Already have an account? <a href="/login" className="text-decoration-none">Login here</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;