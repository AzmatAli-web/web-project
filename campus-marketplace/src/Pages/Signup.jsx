import { useState } from "react";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import FormInput from "../Component/FormInput";
import Button from "../Component/Button";
import { authService } from "../services/authService";

// Updated schema to match formData field names
const formSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked");
    console.log("Form data:", formData);

    const result = formSchema.safeParse(formData);

    if (!result.success) {
      console.log("Validation failed:", result.error);
      const formErrors = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) formErrors[err.path[0]] = err.message;
      });
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({}); // Clear previous errors
      console.log("Sending registration request...");
      
      // Send the data that matches your backend structure
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      console.log("Registration successful:", response);
      
      // Show success message with verification notice
      setSuccess(true);
      setSuccessEmail(formData.email);
      
      // Redirect to login after 5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 5000);
      
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle both string errors and error objects
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Registration failed';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
        <div className="card shadow-lg" style={{ width: "100%", maxWidth: "500px", borderRadius: "15px" }}>
          <div className="card-body p-4 p-md-5 text-center">
            <div className="mb-4">
              <h1 className="h2 fw-bold text-success mb-3">🎉 Account Created!</h1>
              <p className="text-muted mb-4">
                Welcome to Campus Marketplace! We've sent a verification email to:
              </p>
              <p className="fw-bold text-primary mb-4">{successEmail}</p>
            </div>

            <div className="alert alert-info mb-4" role="alert">
              <h5 className="alert-heading mb-2">📧 Verify Your Email</h5>
              <p className="mb-0 small">
                Please check your email (including spam folder) and click the verification link to activate your account. 
                You'll have full access to Campus Marketplace once verified!
              </p>
            </div>

            <div className="alert alert-warning mb-4" role="alert">
              <small>
                <strong>Didn't receive the email?</strong> You can resend it from the verification page.
              </small>
            </div>

            <p className="text-muted small mb-4">
              Redirecting to login in 5 seconds...
            </p>

            <Link to="/login" className="btn btn-primary">
              Go to Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3 p-md-5">
      <div className="card shadow-lg overflow-hidden" style={{ width: "100%", maxWidth: "900px", borderRadius: "15px" }}>
        <div className="row g-0">
          {/* Left Image - Hidden on mobile */}
          <div className="col-lg-6 d-none d-lg-block">
            <div
              className="h-700"
              style={{
                backgroundImage: "url('/images/signup3.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "1200px"
              }}
            >
              <div className="align-items-center justify-content-center h-100 p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
                <div className="text-white text-center">
                  <h1 className="display-3 text-center fw-bold" style={{ marginTop: "18pc", padding: "5pc" }}>Welcome Future Scholar</h1>
                  <p className="lead text-center">Create your account to start buying and selling on the campus marketplace.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <div className="col-lg-6">
            <div className="card-body p-3 p-sm-4 p-md-5">
              <div className="text-center mb-4">
                <h1 className="h3 fw-bold text-primary">Campus Marketplace</h1>
                <h2 className="h5 text-muted mt-2">Join Campus Marketplace</h2>
              </div>

              {/* Show backend error message */}
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  error={errors.name}
                />

                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@campus.edu"
                  error={errors.email}
                />

                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 characters)"
                  error={errors.password}
                />

                <FormInput
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  error={errors.confirmPassword}
                />

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className={`form-check-input ${errors.agreeToTerms ? "is-invalid" : ""}`}
                      id="agreeToTerms"
                    />
                    <label className="form-check-label" htmlFor="agreeToTerms">
                      I agree to the <Link to="/terms" className="text-decoration-none">Terms & Conditions</Link>
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
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <p className="text-muted small">
                    Already have an account? <Link to="/login" className="text-decoration-none">Login here</Link>
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