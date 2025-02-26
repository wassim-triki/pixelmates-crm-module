import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { forgotPasswordAction } from '../../store/actions/AuthActions';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: '' });

  const dispatch = useDispatch();
  const { errorMessage, successMessage, showLoading } = useSelector(
    (state) => state.auth
  );

  const onSubmit = (e) => {
    e.preventDefault();
    let errorObj = { email: '' };
    let hasError = false;

    if (!email.trim()) {
      errorObj.email = 'Email is required';
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorObj.email = 'Invalid email format';
      hasError = true;
    }

    setErrors(errorObj);
    if (hasError) return;

    dispatch(forgotPasswordAction(email));
  };

  return (
    <div className="login-form-bx">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 col-md-7 box-skew d-flex">
            <div className="authincation-content">
              <div className="mb-4">
                <h3 className="mb-1 font-w600">Forgot Password</h3>
                <p className="">Enter your email to reset your password</p>
              </div>

              {/* Display error message from Redux */}
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              {/* Display success message if any */}
              {successMessage && (
                <div className="alert alert-info" role="alert">
                  {successMessage}
                </div>
              )}

              <form onSubmit={onSubmit}>
                <div className="form-group mb-3">
                  <label className="mb-2 form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={showLoading}
                  />
                  {errors.email && (
                    <div className="text-danger fs-12">{errors.email}</div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={showLoading}
                  >
                    {showLoading ? 'Processing...' : 'Submit'}
                  </button>
                </div>
              </form>

              <div className="new-account mt-2">
                <p className="mb-0">
                  Remembered your password?{' '}
                  <Link className="text-primary" to="/login">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-5 d-flex box-skew1">
            <div className="inner-content align-self-center">
              <h2 className="m-b10">Reset Your Password</h2>
              <p className="m-b40">
                Enter your email and we will send a link to reset your password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
