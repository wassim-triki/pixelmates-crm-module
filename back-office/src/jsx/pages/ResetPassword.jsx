import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  resetPasswordAction,
  loadingToggleAction,
} from '../../store/actions/AuthActions';
import Spinner from './WidgetBasic/Spinner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });

  const dispatch = useDispatch();
  const { errorMessage, successMessage, showLoading } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token'); // Get token value
  const email = searchParams.get('email'); // Get token value

  useEffect(() => {
    dispatch({
      type: 'CLEAR_MESSAGES',
    }); // ✅ Properly clear messages on page load
  }, [dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    let errorObj = { password: '', confirmPassword: '' };
    let hasError = false;

    // ✅ Validate password
    if (!password.trim()) {
      errorObj.password = 'Password is required';
      hasError = true;
    } else if (password.length < 6) {
      errorObj.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    // ✅ Validate confirm password
    if (!confirmPassword.trim()) {
      errorObj.confirmPassword = 'Please confirm your password';
      hasError = true;
    } else if (confirmPassword !== password) {
      errorObj.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    setErrors(errorObj);

    if (hasError) {
      dispatch(loadingToggleAction(false)); // ✅ Ensure loading is turned off
      return;
    }
    console.log(token);
    if (!token) {
      dispatch({
        type: 'RESET_PASSWORD_FAILURE',
        payload: 'Invalid or expired reset link.',
      });
      return;
    }

    dispatch(
      resetPasswordAction({ token, email, newPassword: password }, navigate)
    );
  };

  return (
    <div className="login-form-bx">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 col-md-7 box-skew d-flex">
            <div className="authincation-content">
              <div className="mb-4">
                <h3 className="mb-1 font-w600">Reset Password</h3>
                <p>Enter your new password below</p>
              </div>

              {/* ✅ Display error message from Redux */}
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              {/* ✅ Display success message if any */}
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              <form onSubmit={onSubmit}>
                <div className="form-group mb-3">
                  <label className="mb-2 form-label">
                    New Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={showLoading}
                  />
                  {errors.password && (
                    <div className="text-danger fs-12">{errors.password}</div>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label className="mb-2 form-label">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={showLoading}
                  />
                  {errors.confirmPassword && (
                    <div className="text-danger fs-12">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={showLoading}
                  >
                    {showLoading ? <Spinner /> : 'Reset Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-6 col-md-5 d-flex box-skew1">
            <div className="inner-content align-self-center">
              <h2 className="m-b10">Secure Your Account</h2>
              <p className="m-b40">
                Enter a new password to secure your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
