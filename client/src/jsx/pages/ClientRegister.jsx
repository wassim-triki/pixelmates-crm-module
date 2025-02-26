import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import logo from '../../assets/images/logo-full-dark.png';
import {
  loadingToggleAction,
  signupAction,
} from '../../store/actions/AuthActions';

function Register(props) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSignUp(e) {
    e.preventDefault();
    let errorObj = {};
    let error = false;

    if (!formData.firstName.trim()) {
      errorObj.firstName = 'First Name is required';
      error = true;
    }
    if (!formData.lastName.trim()) {
      errorObj.lastName = 'Last Name is required';
      error = true;
    }
    if (!formData.phone.trim()) {
      errorObj.phone = 'Phone Number is required';
      error = true;
    } else if (!/^\d{8}$/.test(formData.phone)) {
      errorObj.phone = 'Enter a valid 8-digit phone number';
      error = true;
    }
    if (!formData.email.trim()) {
      errorObj.email = 'Email is required';
      error = true;
    }
    if (!formData.password.trim()) {
      errorObj.password = 'Password is required';
      error = true;
    } else if (formData.password.length < 6) {
      errorObj.password = 'Password must be at least 6 characters long';
      error = true;
    }
    if (formData.confirmPassword !== formData.password) {
      errorObj.confirmPassword = 'Passwords do not match';
      error = true;
    }

    setErrors(errorObj);
    if (error) return;

    const { confirmPassword, ...postData } = formData;
    postData.role = 'Client';

    dispatch(loadingToggleAction(true));
    dispatch(signupAction(postData, navigate));
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function togglePassword(field) {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  return (
    <div className="authincation">
      <div className="container ">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-8 col-lg-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <div className="text-center mb-3">
                      <img src={logo} alt="" />
                    </div>
                    <h4 className="text-center mb-4">Sign Up Your Account</h4>
                    {props.errorMessage && (
                      <div className="alert alert-danger" role="alert">
                        {props.errorMessage}
                      </div>
                    )}
                    {props.successMessage && (
                      <div className="text-black p-1 my-2">
                        {props.successMessage}
                      </div>
                    )}
                    <form onSubmit={onSignUp}>
                      <div className="form-group mb-3">
                        <label className="form-label">
                          First Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        {errors.firstName && (
                          <div className="text-danger fs-12">
                            {errors.firstName}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Last Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        {errors.lastName && (
                          <div className="text-danger fs-12">
                            {errors.lastName}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Phone <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && (
                          <div className="text-danger fs-12">
                            {errors.phone}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Email <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <div className="text-danger fs-12">
                            {errors.email}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Password <span className="required">*</span>
                        </label>
                        <div className="position-relative">
                          <input
                            type={showPassword.password ? 'text' : 'password'}
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <span
                            className="show-pass eye"
                            onClick={() => togglePassword('password')}
                          >
                            <i className="fa fa-eye" />
                          </span>
                        </div>
                        {errors.password && (
                          <div className="text-danger fs-12">
                            {errors.password}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Confirm Password <span className="required">*</span>
                        </label>
                        <div className="position-relative">
                          <input
                            type={
                              showPassword.confirmPassword ? 'text' : 'password'
                            }
                            className="form-control"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                          />
                          <span
                            className="show-pass eye"
                            onClick={() => togglePassword('confirmPassword')}
                          >
                            <i className="fa fa-eye" />
                          </span>
                        </div>
                        {errors.confirmPassword && (
                          <div className="text-danger fs-12">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                        >
                          Sign Up
                        </button>
                      </div>
                    </form>
                    <div className="new-account mt-3">
                      <p>
                        Already have an account?{' '}
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

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};

export default connect(mapStateToProps)(Register);
