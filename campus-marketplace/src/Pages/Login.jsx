import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// ZOD SCHEMA
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Zod validation
    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const formErrors = {};
      validation.error.errors.forEach((err) => {
        formErrors[err.path[0]] = err.message;
      });
      setErrors(formErrors);
      return;
    }

    // Backend login request
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Login successful!");
      navigate("/");
    } catch (error) {
      alert("Server error. Make sure backend is running!");
      console.error(error);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('/src/assets/images/loginimg3.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card position-relative"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: "15px",
        }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h1 className="fw-bold mb-1" style={{ fontSize: "30px", color: "#1a1a1a" }}>
              WELCOME
            </h1>
            <h2 className="h5 text-muted" style={{ fontSize: "24px", color: "#333" }}>
              BACK!
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                style={{ borderRadius: "8px", padding: "12px" }}
              />
              {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                style={{ borderRadius: "8px", padding: "12px" }}
              />
              {errors.password && (
                <div className="invalid-feedback d-block">{errors.password}</div>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-end mb-4">
              <a href="/forgot-password" className="text-decoration-none text-primary">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn w-100 mb-3 text-white fw-bold border-0"
              style={{
                padding: "12px",
                backgroundColor: "#5cb85c",
                borderRadius: "8px",
                fontSize: "18px",
              }}
            >
              LOG IN
            </button>

            {/* Signup Redirect */}
            <div className="text-center">
              <p className="text-muted mb-0">
                Don't have an account?{" "}
                <a href="/signup" className="text-decoration-none text-primary">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
