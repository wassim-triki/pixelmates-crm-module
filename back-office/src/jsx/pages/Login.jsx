// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo-officiel-menufy.png';
import axiosInstance from '../../config/axios';
import { login } from '../../services/AuthService';
import { useAuth } from '../../context/authContext';

export default function Login() {
  const [email, setEmail] = useState('superadmin@themenufy.com');
  const [password, setPassword] = useState('superadmin');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const onLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setServerError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setServerError(err || 'Login error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-bx ">
      <div className="container-fluid px-3 px-md-5 px-lg-7">
        <div className="row">
          {/* Left side */}
          <div className="col-lg-6 col-md-7 box-skew d-flex">
            <div className="authincation-content  w-100">
              <div className="mb-4 text-center">
                <h1 className="mb-1 font-w800">Sign In</h1>
                <p>Enter your email and password to access your account.</p>
              </div>

              {/* Server error placeholder */}
              {serverError && (
                <div className="alert alert-danger" role="alert">
                  {serverError}
                </div>
              )}

              <form onSubmit={onLogin} noValidate>
                <div className="form-group mb-3">
                  <label className="mb-2 form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="mb-2 form-label">
                    Password <span className="required">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      className={`show-pass eye ${
                        showPassword ? 'active' : ''
                      }`}
                      onClick={() => setShowPassword((v) => !v)}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fa fa-eye-slash" />
                      <i className="fa fa-eye" />
                    </span>
                  </div>
                </div>

                <div className="new-account mt-2">
                  <p className="mb-0">
                    Forgot password?{' '}
                    <Link className="text-primary" to="/forgot-password">
                      Reset it here
                    </Link>
                  </p>
                </div>

                <div className="form-row d-flex justify-content-between mt-4 mb-2">
                  <div className="form-group mb-3">
                    <div className="custom-control custom-checkbox ms-1">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="basic_checkbox_1"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="basic_checkbox_1"
                      >
                        Remember my preference
                      </label>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={!isFormValid || loading}
                  >
                    {loading && (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    Sign In
                  </button>
                </div>
              </form>

              <div className="new-account mt-2">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link className="text-primary" to="/admin/register">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="col-lg-6 col-md-5 d-flex box-skew1">
            <div className="inner-content align-self-center w-100 text-center">
              <div
                className="rounded-circle bg-white shadow-1-strong d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{ width: '150px', height: '150px' }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{ height: '21px', objectFit: 'contain' }}
                  loading="lazy"
                />
              </div>
              <ul className="social-icons mt-4 list-inline">
                <li className="list-inline-item">
                  <Link to="#">
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#">
                    <i className="fab fa-twitter"></i>
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#">
                    <i className="fab fa-linkedin-in"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
