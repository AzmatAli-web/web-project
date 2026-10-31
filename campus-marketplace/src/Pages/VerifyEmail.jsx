import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import client from "../api/axiosClient";
import authService from "../services/authService";
import AuthLayout from "../Component/AuthLayout";
import Icon from "../Component/Icon";
export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState({
    loading: !!token,
    message: "",
    error: false,
  });
  const [email, setEmail] = useState(
    () => authService.getCurrentUser()?.email || "",
  );
  useEffect(() => {
    if (!token) return;
    let active = true;
    client
      .post("/auth/verify-email", { token })
      .then(() => {
        if (active)
          setState({
            loading: false,
            message:
              "Your email is verified. You can continue to your account.",
            error: false,
          });
      })
      .catch((err) => {
        if (active)
          setState({ loading: false, message: err.message, error: true });
      });
    return () => {
      active = false;
    };
  }, [token]);
  const resend = async (e) => {
    e.preventDefault();
    setState({ loading: true, message: "", error: false });
    try {
      await client.post("/auth/resend-verification", { email });
      setState({
        loading: false,
        message: "Verification email sent. Please check your inbox.",
        error: false,
      });
    } catch (err) {
      setState({ loading: false, message: err.message, error: true });
    }
  };
  return (
    <AuthLayout title="One last little step.">
      <p className="auth-subtitle">
        Verify your email to complete your account.
      </p>
      {state.loading && <p role="status">Please wait…</p>}
      {state.message && (
        <div
          className={`alert ${state.error ? "alert-danger" : "alert-success"}`}
          role="status"
        >
          {state.message}
        </div>
      )}
      <form onSubmit={resend}>
        <label className="field-label" htmlFor="verify-email">
          Need a new verification link?
        </label>
        <input
          id="verify-email"
          className="form-control"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <button
          className="button button-dark w-100 auth-submit"
          disabled={state.loading}
        >
          Resend verification email <Icon name="arrow" />
        </button>
      </form>
      <p className="auth-switch">
        <Link to="/login">Back to login</Link>
      </p>
    </AuthLayout>
  );
}
