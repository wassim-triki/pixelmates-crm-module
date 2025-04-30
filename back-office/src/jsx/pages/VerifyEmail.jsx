// src/components/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../config/axios';

function VerifyEmail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || '';

  useEffect(() => {
    if (!email) {
      // If accessed directly without email, redirect to signup
      navigate('/register');
    }
  }, [email, navigate]);

  const [code, setCode] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  // Countdown for resend button
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const extractError = (err) => {
    const msg = err?.response?.data?.message;
    return typeof msg === 'string'
      ? msg
      : 'An error occurred. Please try again.';
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await axiosInstance.post('/auth/verify-email', { email, code });
      setMessage({
        type: 'success',
        text: 'Email verified! Redirecting...',
      });
      setTimeout(() => navigate('/admin/my-restaurant'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: extractError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await axiosInstance.post('/auth/resend-verification', { email });
      setMessage({
        type: 'info',
        text: 'Verification code resent to your email.',
      });
      setResendDisabled(true);
      setTimer(60);
    } catch (err) {
      setMessage({ type: 'error', text: extractError(err) });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="authincation">
      <div className="container">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-8 col-lg-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <h4 className="text-center mb-2">Verify Your Email</h4>
                    <p className="text-center text-muted mb-4">
                      We sent a verification code to <strong>{email}</strong>
                    </p>

                    {message.text && (
                      <div
                        className={`alert alert-${
                          message.type === 'success'
                            ? 'success'
                            : message.type === 'error'
                            ? 'danger'
                            : 'info'
                        }`}
                        role="alert"
                      >
                        {message.text}
                      </div>
                    )}

                    <form onSubmit={handleVerify} noValidate>
                      <div className="form-group mb-3">
                        <label>Verification Code</label>
                        <input
                          type="text"
                          name="code"
                          className="form-control"
                          placeholder="Enter the code sent to your email"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                        />
                      </div>

                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          disabled={!code.trim() || loading}
                        >
                          {loading ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            'Verify Code'
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Inline Resend Section */}
                    <p className="text-center mt-3 mb-0">
                      Didn't receive the code?{' '}
                      <button
                        type="button"
                        className="btn btn-link p-0 align-baseline"
                        onClick={handleResend}
                        disabled={!email || resendLoading || resendDisabled}
                      >
                        {resendLoading
                          ? 'Resending...'
                          : resendDisabled
                          ? `Resend in ${timer}s`
                          : 'Resend Code'}
                      </button>
                    </p>

                    <div className="new-account mt-3 text-center">
                      <p className="mb-0">
                        Back to{' '}
                        <Link className="text-primary" to="/login">
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
