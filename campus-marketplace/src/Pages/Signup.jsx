import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import authService from "../services/authService";
import AuthLayout from "../Component/AuthLayout";
import Icon from "../Component/Icon";
const schema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name."),
    email: z.email("Please enter a valid email."),
    password: z.string().min(6, "Use at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((x) => x.password === x.confirmPassword, {
    message: "Your passwords do not match.",
    path: ["confirmPassword"],
  });
export default function Signup() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((x) => [x.path[0], x.message]),
        ),
      );
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const result = await authService.register({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      });
      setSuccess({
        email: parsed.data.email,
        sent: result.verificationEmailSent !== false,
      });
    } catch (err) {
      setErrors({ submit: typeof err === "string" ? err : err.message });
    } finally {
      setLoading(false);
    }
  };
  if (success)
    return (
      <AuthLayout title="You're part of the community.">
        <div className="alert alert-success" role="status">
          Your account has been created.
        </div>
        <p>
          {success.sent
            ? `Check ${success.email} for your verification link.`
            : "We created your account, but could not deliver the verification email. Please try resending it."}
        </p>
        <Link to="/verify-email" className="button button-dark">
          Verify or resend email <Icon name="arrow" />
        </Link>
        <p className="auth-switch">
          <Link to="/login">Continue to login</Link>
        </p>
      </AuthLayout>
    );
  return (
    <AuthLayout title="Good things start here.">
      <p className="auth-subtitle">Join your campus marketplace.</p>
      <form onSubmit={submit}>
        {errors.submit && (
          <div role="alert" className="alert alert-danger">
            {errors.submit}
          </div>
        )}
        {[
          ["name", "Full name", "text", "name"],
          ["email", "Email address", "email", "email"],
          ["password", "Password", "password", "new-password"],
          ["confirmPassword", "Confirm password", "password", "new-password"],
        ].map(([name, label, type, auto]) => (
          <div key={name}>
            <label htmlFor={name} className="field-label">
              {label}
            </label>
            <input
              className="form-control"
              id={name}
              name={name}
              type={type}
              autoComplete={auto}
              required
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
            />
            {errors[name] && (
              <small className="text-danger" role="alert" id={`${name}-error`}>
                {errors[name]}
              </small>
            )}
          </div>
        ))}
        <p className="small text-muted mt-3">
          Meet in public, inspect items before paying, and respect your campus
          community.
        </p>
        <button className="button button-dark w-100" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
          <Icon name="arrow" />
        </button>
      </form>
      <p className="auth-switch">
        Already a member? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
