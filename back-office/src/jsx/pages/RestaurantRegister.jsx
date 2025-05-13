import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import axiosInstance from '../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
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
                  .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          width: 80%;
          max-width: 800px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          cursor: pointer;
          font-size: 1.5rem;
        }
        .modal-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 20px;
          color: #FA8072;
          text-align: center;
        }
        .modal-section {
          margin-bottom: 20px;
        }
        .modal-section h3 {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        .modal-section p {
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .modal-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }
        .modal-button {
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
        .modal-button-agree {
          background-color: #FA8072;
          color: white;
          border: none;
        }
        .modal-button-close {
          background-color: #ccc;
          color: #333;
          border: none;
        }
      `}</style>
      <div className="container">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-8 col-lg-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <h1 className="text-center mb-4 font-w800">Sign Up</h1>

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
    I have read and agree to{' '}
    <span 
      className="text-primary cursor-pointer" 
      onClick={() => setShowTermsModal(true)}
    >
      Terms of service
    </span>{' '}
    and{' '}
    <span 
      className="text-primary cursor-pointer" 
      onClick={() => setShowPrivacyModal(true)}
    >
      privacy policy
    </span>
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
            {/* Terms Modal */}
      {showTermsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={() => setShowTermsModal(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <h2 className="modal-title">Terms and Conditions</h2>
            
            <div className="modal-section">
              <p>
                By creating an account, you acknowledge and agree to the following Terms & Conditions. 
                These Terms govern your use of our website and services, including order processing, 
                payments, delivery, and refunds.
              </p>
            </div>

            <div className="modal-section">
              <h3>1. Order Processing</h3>
              <p>
                All orders placed through our platform are subject to availability and acceptance. 
                Upon order confirmation, a receipt will be sent to the provided email address. 
                We reserve the right to cancel or modify any order due to stock availability 
                or other unforeseen circumstances.
              </p>
            </div>

            <div className="modal-section">
              <h3>2. Payment</h3>
              <p>
                Payments must be made through the available payment methods on our website. 
                All payment information provided must be accurate and up-to-date. 
                We reserve the right to refuse any payment that is fraudulent or unauthorized.
              </p>
            </div>

            <div className="modal-section">
              <h3>3. Delivery Services</h3>
              <p>
                We offer delivery services within specific regions. Delivery times and fees may vary 
                depending on the location and the selected delivery option. While we strive to meet 
                estimated delivery times, we are not liable for any delays caused by external factors 
                beyond our control.
              </p>
            </div>

            <div className="modal-section">
              <h3>4. Refund Policy</h3>
              <p>
                Refunds are available for orders that meet specific criteria, such as incorrect items 
                or damaged goods. Requests for refunds must be made within 14 days of delivery. 
                We reserve the right to approve or reject refund requests based on our review.
              </p>
            </div>

            <div className="modal-section">
              <h3>5. User Responsibilities</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account information 
                and for all activities under your account. It is your responsibility to ensure the 
                accuracy of the information you provide.
              </p>
            </div>

            <div className="modal-buttons">
              <button 
                className="modal-button modal-button-agree"
                onClick={() => {
                  setTermsAgreed(true);
                  setShowTermsModal(false);
                }}
              >
                I Agree
              </button>
              <button 
                className="modal-button modal-button-close"
                onClick={() => setShowTermsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={() => setShowPrivacyModal(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <h2 className="modal-title">Privacy Policy</h2>
            
            <div className="modal-section">
              <p>
                This Privacy Policy describes how we collect, use, and disclose your personal 
                information when you use our services. By using our services, you agree to the 
                collection and use of information in accordance with this policy.
              </p>
            </div>

            <div className="modal-section">
              <h3>1. Information We Collect</h3>
              <p>
                We collect several types of information from and about users of our website, 
                including personal information such as name, email address, phone number, and 
                payment information when you register or place an order.
              </p>
            </div>

            <div className="modal-section">
              <h3>2. How We Use Your Information</h3>
              <p>
                We use the information we collect to provide and improve our services, process 
                transactions, communicate with you, and for security and fraud prevention purposes. 
                We do not sell or share your personal information with third parties for marketing 
                purposes without your consent.
              </p>
            </div>

            <div className="modal-section">
              <h3>3. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or 
                destruction. However, no internet transmission or electronic storage is 100% secure.
              </p>
            </div>

            <div className="modal-section">
              <h3>4. Your Rights</h3>
              <p>
                You have the right to access, correct, or delete your personal information. 
                You may also object to or restrict certain processing of your data. To exercise 
                these rights, please contact us using the information provided below.
              </p>
            </div>

            <div className="modal-section">
              <h3>5. Changes to This Policy</h3>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "effective date" at 
                the top of this policy.
              </p>
            </div>

            <div className="modal-buttons">
              <button 
                className="modal-button modal-button-agree"
                onClick={() => {
                  setTermsAgreed(true);
                  setShowPrivacyModal(false);
                }}
              >
                I Agree
              </button>
              <button 
                className="modal-button modal-button-close"
                onClick={() => setShowPrivacyModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantRegister;
