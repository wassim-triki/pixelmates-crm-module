import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Button from '../components/button';
import Footer from '../components/footer';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import InputField from '../components/InputField';
import { FcGoogle } from 'react-icons/fc'; // Google Icon
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// Validation Schema using Yup
const validationSchema = yup.object({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  termsAccepted: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

function Register() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // Register API request
        await axiosInstance.post('/auth/signup', {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          role: 'Client',
        });

        // Redirect user to verification page
        navigate('/verify-email', { state: { email: values.email } });
      } catch (error) {
        setErrors({
          apiError: error.response?.data?.message || 'Registration failed',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ✅ **Google Sign-up Handler**
  const handleGoogleSignUp = () => {
    window.location.href = `http://localhost:5000/api/auth/google`;
  };

  // Close modal automatically after agreeing
  const handleAgreeTerms = () => {
    formik.setFieldValue('termsAccepted', true);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Backg_Login.png')",
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.1)',
        }}
      />
      <main className="relative flex-grow flex items-center justify-center py-5 px-4 sm:px-6 lg:px-20">
        <div
          className="w-full max-w-md sm:w-[480px] sm:h-auto p-4 rounded-2xl bg-white/10 backdrop-blur-xl flex flex-col justify-between"
          style={{ marginTop: '60px' }}
        >
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Sign Up</h1>

            {formik.errors.apiError && (
              <p className="text-red-500 text-center w-full font-medium">
                {formik.errors.apiError}
              </p>
            )}

            {/* Google Signup Button */}
            <button
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center w-full gap-3 border-2 border-gray-300/30 py-3 rounded-full text-white bg-transparent hover:bg-gray-100 hover:text-black transition-all duration-300"
            >
              <FcGoogle size={22} />
              Sign up with Google
            </button>

            <div className="relative flex items-center w-full">
              <div className="w-full border-t border-gray-400"></div>
              <span className="px-3 text-white text-sm">OR</span>
              <div className="w-full border-t border-gray-400"></div>
            </div>

            <form className="w-full space-y-4" onSubmit={formik.handleSubmit}>
              <div className="space-y-2">
                {/* First and Last Name in the same row */}
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <InputField
                      label="First Name"
                      name="firstName"
                      formik={formik}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="w-1/2">
                    <InputField
                      label="Last Name"
                      name="lastName"
                      formik={formik}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  formik={formik}
                  placeholder="Enter your email"
                />
                <div className="relative">
                  <InputField
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    formik={formik}
                    placeholder="Create a password"
                  />
                  <div
                    className="absolute right-3 top-[39px] cursor-pointer text-white hover:text-gray-200 transition duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEye /> : <FiEyeOff />}
                  </div>
                </div>

                <div className="relative">
                  <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    formik={formik}
                    placeholder="Confirm your password"
                  />
                  <div
                    className="absolute right-3 top-[39px] cursor-pointer text-white hover:text-gray-200 transition duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center space-x-1">
                  <input
                    id="terms"
                    type="checkbox"
                    name="termsAccepted"
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                    checked={formik.values.termsAccepted}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor="terms" className="text-sm text-white">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="text-[#FA8072] font-bold underline"
                    >
                      Terms and Conditions
                    </button>
                  </label>
                </div>
                {formik.touched.termsAccepted &&
                  formik.errors.termsAccepted && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.termsAccepted}
                    </p>
                  )}
              </div>

              <Button
                type="submit"
                className="w-full !bg-[#FA8072] hover:!bg-[#e0685a] active:bg-[#FA8072] text-white hover:text-white active:text-white border-2 disabled:border-[#FA8072]/50 border-[#FA8072] font-semibold py-3 px-6 rounded-full cursor-pointer transition-all duration-300"
              >
                {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </div>

          <div className="text-center mt-2">
            <span className="text-white"> Already have an account? </span>
            <Link
              to="/login"
              className="text-[#FA8072] cursor-pointer hover:text-[#FA8072]/50 z-[1000] font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
{/* Terms and Conditions Modal */}
{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg w-[800px] max-h-[80vh] overflow-auto relative">
      {/* Close Icon */}
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        onClick={() => setIsModalOpen(false)}
      >
        <FontAwesomeIcon icon={faTimes} className="text-xl" />
      </button>

      <h2 className="text-lg font-bold mb-6 text-center">Terms and Conditions</h2>
      <p className="text-sm mb-4">
        By creating an account, you acknowledge and agree to the following Terms & Conditions. These Terms govern your use of our website and services, including order processing, payments, delivery, and refunds.
      </p>

      <h3 className="text-md font-bold mb-2">1. Order Processing</h3>
      <p className="text-sm mb-4">
        All orders placed through TheMenuFy are subject to availability and acceptance. Upon order confirmation, a receipt will be sent to the provided email address. We reserve the right to cancel or modify any order due to stock availability or other unforeseen circumstances.
      </p>

      <h3 className="text-md font-bold mb-2">2. Payment</h3>
      <p className="text-sm mb-4">
        Payments must be made through the available payment methods on our website. All payment information provided must be accurate and up-to-date. TheMenuFy reserves the right to refuse any payment that is fraudulent or unauthorized.
      </p>

      <h3 className="text-md font-bold mb-2">3. Delivery Services</h3>
      <p className="text-sm mb-4">
        We offer delivery services within specific regions. Delivery times and fees may vary depending on the location and the selected delivery option. While we strive to meet estimated delivery times, TheMenuFy is not liable for any delays caused by external factors beyond our control.
      </p>

      <h3 className="text-md font-bold mb-2">4. Refund Policy</h3>
      <p className="text-sm mb-4">
        Refunds are available for orders that meet specific criteria, such as incorrect items or damaged goods. Requests for refunds must be made within 14 days of delivery. TheMenuFy reserves the right to approve or reject refund requests based on our review.
      </p>

      {/* Additional Information */}
      <h3 className="text-md font-bold mb-2">5. User Responsibilities</h3>
      <p className="text-sm mb-4">
        You are responsible for maintaining the confidentiality of your account information and for all activities under your account. It is your responsibility to ensure the accuracy of the information you provide.
      </p>

      <h3 className="text-md font-bold mb-2">6. Privacy Policy</h3>
      <p className="text-sm mb-4">
        We are committed to protecting your privacy. Please review our Privacy Policy to understand how your personal information is collected, used, and protected while using our services.
      </p>

      {/* Professional Services Information */}
      <h3 className="text-md font-bold mb-2">7. Professional Services</h3>
      <p className="text-sm mb-4">
        In addition to our standard offerings, TheMenuFy also provides professional services tailored to your business needs. These services include menu consultation, custom branding, and promotional support to help you enhance your online presence and improve customer engagement.
      </p>
      <p className="text-sm mb-4">
        If you are interested in exploring these professional services, please reach out to our support team for more information on how we can assist you in achieving your goals.
      </p>

      {/* Button Row */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-[#FA8072] text-white py-2 px-4 rounded-full w-[48%]"
          onClick={handleAgreeTerms}
        >
          I Agree
        </button>
        <button
          className="bg-[#ccc] text-white py-2 px-4 rounded-full w-[48%]"
          onClick={() => setIsModalOpen(false)}
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

export default Register;
