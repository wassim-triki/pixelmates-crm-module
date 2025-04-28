import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import axiosInstance from '../../config/axios';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    restaurantName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setErrorMessage('');
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const togglePassword = () => setShowPassword((v) => !v);
  const handleTermsChange = (e) => setTermsAgreed(e.target.checked);
  const handleRecaptcha = (val) => setRecaptchaValue(val);

  const onSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const postData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        restaurantName: formData.restaurantName,
        phone: `+216${formData.phone}`,
      };
      const response = await axiosInstance.post('/admin/signup', postData);
      setSuccessMessage(response.data.message || 'Signup successful!');
      // setTimeout(() => navigate('/verify-email'), 2000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () =>
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    /^\S+@\S+\.\S+$/.test(formData.email) &&
    formData.password.length >= 8 &&
    formData.restaurantName.trim() &&
    /^\d{8}$/.test(formData.phone) &&
    termsAgreed &&
    recaptchaValue;

  return (
    <div className="authincation">
      <div className="container">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-8 col-lg-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <h4 className="text-center mb-4">
                      Create your free account
                    </h4>

                    {errorMessage && (
                      <div className="alert alert-danger" role="alert">
                        {errorMessage}
                      </div>
                    )}
                    {successMessage && (
                      <div className="alert alert-success" role="alert">
                        {successMessage}
                      </div>
                    )}

                    <form onSubmit={onSignUp} noValidate>
                      {/* First & Last Name */}
                      <div className="form-row mb-3 d-flex gap-2">
                        <div className="form-group col-md-6">
                          <label>First name</label>
                          <input
                            type="text"
                            name="firstName"
                            className="form-control"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Last name</label>
                          <input
                            type="text"
                            name="lastName"
                            className="form-control"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="form-group mb-3">
                        <label>Email address</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="your@company.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Password */}
                      <div className="form-group mb-3">
                        <label>Password</label>
                        <div className="position-relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className="form-control"
                            placeholder="Must be at least 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <span
                            className="show-pass eye"
                            onClick={togglePassword}
                            style={{ cursor: 'pointer' }}
                          >
                            <i className="fa fa-eye" />
                          </span>
                        </div>
                      </div>

                      {/* Restaurant name */}
                      <div className="form-group mb-3">
                        <label>Restaurant name</label>
                        <input
                          type="text"
                          name="restaurantName"
                          className="form-control"
                          placeholder="Your restaurant"
                          value={formData.restaurantName}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Phone number */}
                      <div className="form-group mb-3">
                        <label>Phone number</label>
                        <div className="input-group gap-2">
                          <div className="input-group-prepend">
                            <span className="input-group-text h-100">
                              <span role="img" aria-label="Tunisia flag">
                                🇹🇳
                              </span>{' '}
                              +216
                            </span>
                          </div>
                          <input
                            type="text"
                            name="phone"
                            className="form-control"
                            placeholder="20 123 456"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Terms checkbox */}
                      <div className="form-group form-check mb-3">
                        <input
                          type="checkbox"
                          id="terms"
                          className="form-check-input"
                          checked={termsAgreed}
                          onChange={handleTermsChange}
                        />
                        <label
                          htmlFor="terms"
                          className="form-check-label fs-6"
                        >
                          I have read and agree to{' '}
                          <Link to="/terms">Terms of service</Link> and{' '}
                          <Link to="/privacy">privacy policy</Link>
                        </label>
                      </div>

                      {/* reCAPTCHA */}
                      <div className="form-group mb-3">
                        <ReCAPTCHA
                          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                          onChange={handleRecaptcha}
                        />
                      </div>

                      {/* Submit */}
                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          disabled={!isFormValid() || loading}
                        >
                          {loading ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            'Create account'
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="new-account mt-3 text-center">
                      <p className="mb-0">
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

export default Register;
