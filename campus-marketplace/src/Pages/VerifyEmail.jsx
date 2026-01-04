import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    } else {
      setStatus('error');
      setMessage('No verification token provided');
    }
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      setStatus('verifying');
      setMessage('Verifying your email...');
      
      const response = await axiosClient.post('/auth/verify-email', { token });
      
      setStatus('success');
      setMessage('✅ Email verified successfully! You can now access all features.');
      
      // Store verified status and redirect after 3 seconds
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (error) {
      setStatus('error');
      const errorMsg = error.response?.data?.message || error.message || 'Verification failed';
      setMessage(errorMsg);
      
      // Try to extract email from localStorage or token
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setEmail(user.email || '');
      } catch (e) {
        // Ignore
      }
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    try {
      setResendLoading(true);
      await axiosClient.post('/auth/resend-verification', { email });
      
      setMessage('✅ Verification email sent! Please check your inbox.');
      setStatus('success');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to resend email';
      setMessage('❌ ' + errorMsg);
      setStatus('error');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
        <div className="card-body p-4 p-md-5 text-center">
          {/* Header */}
          <div className="mb-4">
            <h1 className="h2 fw-bold text-primary mb-2">📧 Email Verification</h1>
            <p className="text-muted">Verifying your email address...</p>
          </div>

          {/* Status Messages */}
          {status === 'verifying' && (
            <div className="mb-4">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="mb-4">
              <div className="alert alert-success mb-3" role="alert">
                <h4 className="alert-heading">Success! 🎉</h4>
                <p className="mb-0">{message}</p>
              </div>
              <p className="text-muted small">Redirecting to login...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-4">
              <div className="alert alert-danger mb-3" role="alert">
                <h4 className="alert-heading">Verification Failed</h4>
                <p className="mb-0">{message}</p>
              </div>

              {/* Resend Email Section */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-3">Didn't receive the email?</h6>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={resendLoading}
                  />
                </div>
                <button
                  className="btn btn-primary w-100 mb-3"
                  onClick={handleResendEmail}
                  disabled={resendLoading || !email}
                >
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="mt-4 pt-3 border-top">
            <p className="text-muted">
              <Link to="/login" className="text-decoration-none">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
