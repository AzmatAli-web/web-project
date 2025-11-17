import { useState } from "react";
import { z } from "zod";
import FormInput from "../Component/FormInput";
import Button from "../Component/Button";

// ------------------ Field-level Zod schemas ------------------
const fullNameSchema = z.string().min(3, "Full name must be at least 3 characters");
const emailSchema = z.string().email("Invalid email address");
const studentIdSchema = z.string().min(1, "Student ID is required");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters");
const agreeToTermsSchema = z.boolean().refine(val => val === true, "You must agree to the terms");

// Form-level schema for cross-field validation (password match)
const formSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    studentId: studentIdSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    agreeToTerms: agreeToTermsSchema
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const formErrors = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) formErrors[err.path[0]] = err.message;
      });
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          studentId: formData.studentId,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        alert("Account created successfully!");
        setFormData({
          fullName: "",
          email: "",
          studentId: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false
        });
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-300 d-flex align-items-center justify-content-center bg-light p-3 p-md-5">
      <div className="card shadow-lg overflow-hidden" style={{ width: "100%", borderRadius: "15px" }}>
        <div className="row g-0">
          {/* Left Image */}
          <div className="col-lg-6 d-none d-lg-block">
            <div
              className="h-700"
              style={{
                backgroundImage: "url('/src/assets/images/signup3.png')",
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
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h1 className="h3 fw-bold text-primary">Campus Marketplace</h1>
                <h2 className="h5 text-muted mt-2">Join Campus Marketplace</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  zodSchema={fullNameSchema}
                  setError={(field, message) => setErrors(prev => ({ ...prev, [field]: message }))}
                />

                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@campus.edu"
                  zodSchema={emailSchema}
                  setError={(field, message) => setErrors(prev => ({ ...prev, [field]: message }))}
                />

                <FormInput
                  label="Student ID"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter your student ID"
                  zodSchema={studentIdSchema}
                  setError={(field, message) => setErrors(prev => ({ ...prev, [field]: message }))}
                />

                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  zodSchema={passwordSchema}
                  setError={(field, message) => setErrors(prev => ({ ...prev, [field]: message }))}
                />

                <FormInput
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
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
                      I agree to the <a href="/terms" className="text-decoration-none">Terms & Conditions</a>
                    </label>
                  </div>
                  {errors.agreeToTerms && <div className="invalid-feedback d-block">{errors.agreeToTerms}</div>}
                </div>

                <Button type="submit" loading={loading} disabled={loading} className="w-100 mb-3" size="lg">
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
