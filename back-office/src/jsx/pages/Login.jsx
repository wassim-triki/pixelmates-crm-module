import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  loadingToggleAction,
  loginAction,
} from '../../store/actions/AuthActions';

import logo from '../../assets/images/logo-officiel-menufy.png';

function Login(props) {
  const [email, setEmail] = useState('superadmin@themenufy.com');
  let errorsObj = { email: '', password: '' };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState('superadmin');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch({
      type: 'CLEAR_MESSAGES',
    });
  }, [dispatch]);

  function onLogin(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (email === '') {
      errorObj.email = 'Email is Required';
      error = true;
    }
    if (password === '') {
      errorObj.password = 'Password is Required';
      error = true;
    }
    setErrors(errorObj);
    if (error) {
      return;
    }
    dispatch(loadingToggleAction(true));
    dispatch(loginAction(email, password, navigate));
  }
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="login-form-bx">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 col-md-7 box-skew d-flex">
            <div className="authincation-content">
            <div className="mb-4 text-center">
                <h1 className="mb-1 font-w800">Sign In</h1>
                <p>Enter your email and password to access your account.</p>
              </div>
              {/* ✅ Display error message from Redux */}
              {props.errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {props.errorMessage}
                </div>
              )}

              {/* ✅ Display success message if any */}
              {props.successMessage && (
                <div className="alert alert-success" role="alert">
                  {props.successMessage}
                </div>
              )}
              <form onSubmit={onLogin}>
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
                  {errors.email && (
                    <div className="text-danger fs-12">{errors.email}</div>
                  )}
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
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className="fa fa-eye-slash" />
                      <i className="fa fa-eye" />
                    </span>
                  </div>
                  {errors.password && (
                    <div className="text-danger fs-12">{errors.password}</div>
                  )}
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
                    <div className="custom-control custom-checkbox ms-1 ">
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
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
              </form>
              <div className="new-account mt-2">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link className="text-primary" to="/client/register">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-5 d-flex box-skew1">
            <div className="inner-content align-self-center">
              <div
                className="rounded-circle bg-white shadow-1-strong d-flex align-items-center justify-content-center mb-4 mx-auto"
                style={{ width: '150px', height: '150px' }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{ height: '21px', objectFit: 'contain' }}
                  loading="lazy"
                />
              </div>

              <ul className="social-icons mt-4">
                <li>
                  <Link to={'#'}>
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                </li>
                <li>
                  <Link to={'#'}>
                    <i className="fab fa-twitter"></i>
                  </Link>
                </li>
                <li>
                  <Link to={'#'}>
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

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};
export default connect(mapStateToProps)(Login);
