import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import AuthLayout from "../Component/AuthLayout";
import Icon from "../Component/Icon";
export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const result = await authService.login({
        email: form.get("email").trim(),
        password: form.get("password"),
      });
      navigate(result.user?.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(typeof err === "string" ? err : err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout title="Good to see you again.">
      <p className="auth-subtitle">Log in and pick up where you left off.</p>
      <form onSubmit={submit}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <label className="field-label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="form-control"
          placeholder="you@example.com"
          required
        />
        <label className="field-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="form-control"
          placeholder="Your password"
          required
        />
        <button
          className="button button-dark w-100 auth-submit"
          disabled={loading}
        >
          {loading ? "Logging in…" : "Log in"}
          <Icon name="arrow" />
        </button>
      </form>
      <p className="auth-switch">
        New around here? <Link to="/signup">Create an account</Link>
      </p>
      <Link to="/verify-email" className="text-link small">
        Need to verify your email?
      </Link>
    </AuthLayout>
  );
}
