import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import axiosInstance from '../../config/axios';

function RestaurantRegister() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
  const toggleConfirm = () => setShowConfirm((v) => !v);
  const handleTermsChange = (e) => setTermsAgreed(e.target.checked);
  const handleRecaptcha = (val) => setRecaptchaValue(val);

  const passwordsMatch = formData.password === formData.confirmPassword;

  const onSignUp = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match.');
      return;
    }
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
      setTimeout(() => navigate('/verify-email', { state: { email: formData.email } }), 2000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () =>
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    /^\S+@\S+\.\S+$/.test(formData.email) &&
    formData.password.length >= 8 &&
    formData.confirmPassword.length >= 8 &&
    passwordsMatch &&
    formData.restaurantName.trim() &&
    /^\d{8}$/.test(formData.phone) &&
    termsAgreed &&
    recaptchaValue;

  return (
    <div className="authincation">
      <style>{`
        .authincation {
          padding: 40px 0;
          background-color: #f4f7fa;
          min-height: 100vh;
        }
        .authincation-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 15px rgba(0,0,0,0.1);
        }
        .auth-form h4 {
          font-size: 2rem;
          font-weight: bold;
          color:#FA8072;
          margin-bottom: 30px;
        }
        .form-control {
          border-radius: 6px;
          height: 45px;
        }
        .btn-block {
          width: 100%;
        }
        .eye {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }
        .form-check-label a {
          text-decoration: underline;
        }
      `}</style>
      <div className="container">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-8 col-lg-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <h4 className="text-center mb-4">Sign Up</h4>

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

                      <div className="form-group mb-3">
                        <label>Password</label>
                        <div className="position-relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className="form-control"
                            placeholder="At least 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <span className="eye" onClick={togglePassword}>
                            <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                          </span>
                        </div>
                      </div>

                      <div className="form-group mb-3">
                        <label>Confirm Password</label>
                        <div className="position-relative">
                          <input
                            type={showConfirm ? 'text' : 'password'}
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Retype your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                          />
                          <span className="eye" onClick={toggleConfirm}>
                            <i className={`fa ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`} />
                          </span>
                        </div>
                        {!passwordsMatch && formData.confirmPassword && (
                          <small className="text-danger">Passwords do not match.</small>
                        )}
                      </div>

                      <div className="form-group mb-3">
                        <label>Restaurant name</label>
                        <input
                          type="text"
                          name="restaurantName"
                          className="form-control"
                          placeholder="Your restaurant name"
                          value={formData.restaurantName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label>Phone number</label>
                        <div className="input-group gap-2">
                          <div className="input-group-prepend">
                            <span className="input-group-text h-100">🇹🇳 +216</span>
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

                      <div className="form-group form-check mb-3">
                        <input
                          type="checkbox"
                          id="terms"
                          className="form-check-input"
                          checked={termsAgreed}
                          onChange={handleTermsChange}
                        />
                        <label htmlFor="terms" className="form-check-label fs-6">
                          I have read and agree to <Link to="/terms">Terms of service</Link> and{' '}
                          <Link to="/privacy">privacy policy</Link>
                        </label>
                      </div>

                      <div className="form-group mb-3">
                        <ReCAPTCHA
                          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                          onChange={handleRecaptcha}
                        />
                      </div>

                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          disabled={!isFormValid() || loading}
                        >
                          {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status" />
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

export default RestaurantRegister;
