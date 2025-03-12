import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Button from '../components/button';
import Footer from '../components/footer';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import InputField from '../components/InputField';
import { FcGoogle } from 'react-icons/fc'; // Google Icon

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

  return (
    <>
      <div className="flex flex-col relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{
            backgroundImage: "url('/Register.jpg')",
            boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
          }}
        />
        <main className="relative flex-grow flex items-center justify-center sm:justify-end py-5 px-4 sm:px-6 lg:px-20">
          <div
            className="w-full max-w-md sm:w-[480px] sm:h-auto p-4 rounded-2xl bg-white/10 backdrop-blur-xl flex flex-col justify-between "
            style={{ marginTop: '60px' }}
          >
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-3xl font-bold text-white">Create Account</h1>

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
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    formik={formik}
                    placeholder="Create a password"
                  />
                  <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    formik={formik}
                    placeholder="Confirm your password"
                  />

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
                        className="text-black font-bold underline"
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
                  className="w-full bg-transparent hover:bg-yellow-500 text-white hover:text-white border-2 disabled:border-yellow-500/50 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 disabled:bg-gray-500 disabled:text-gray-700"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  {formik.isSubmitting
                    ? 'Creating Account...'
                    : 'Create Account'}
                </Button>
              </form>
            </div>

            <div className="text-center mt-2">
              <span className="text-white"> Already have an account? </span>
              <Link
                to="/login"
                className="text-yellow-500 hover:text-yellow-400 font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </main>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-auto">
              <h2 className="text-lg font-bold mb-4">Terms and Conditions</h2>
              <p className="text-sm mb-4">
                By creating an account, you acknowledge and agree to the
                following Terms & Conditions. These Terms govern your use of our
                website and services, including order processing, payments,
                delivery, and refunds.
              </p>

              <h3 className="text-md font-bold mb-2">1. Order Processing</h3>
              <p className="text-sm mb-4">
                All orders placed through TheMenuFy are subject to availability
                and acceptance. Upon order confirmation, a receipt will be sent
                to the provided email address. We reserve the right to cancel or
                modify any order due to stock availability or other unforeseen
                circumstances.
              </p>

              <h3 className="text-md font-bold mb-2">2. Payment</h3>
              <p className="text-sm mb-4">
                Payments must be made through the available payment methods on
                our website. All payment information provided must be accurate
                and up-to-date. TheMenuFy reserves the right to refuse any
                payment that is fraudulent or unauthorized.
              </p>

              <h3 className="text-md font-bold mb-2">3. Delivery Services</h3>
              <p className="text-sm mb-4">
                We offer delivery services within specific regions. Delivery
                times and fees may vary depending on the location and the
                selected delivery option. While we strive to meet estimated
                delivery times, TheMenuFy is not liable for any delays caused by
                external factors beyond our control.
              </p>

              <h3 className="text-md font-bold mb-2">4. Refund Policy</h3>
              <p className="text-sm mb-4">
                Refunds are available for orders that meet specific criteria,
                such as incorrect items or damaged goods. Requests for refunds
                must be made within 14 days of receiving the order. Refunds will
                be issued to the original payment method, and delivery fees are
                non-refundable unless otherwise specified.
              </p>

              <h3 className="text-md font-bold mb-2">
                5. Security and Privacy
              </h3>
              <p className="text-sm mb-4">
                At TheMenuFy, we are committed to maintaining the security and
                privacy of your personal information. We use industry-standard
                encryption to protect your payment data and follow best
                practices for securing sensitive user information.
              </p>

              <h3 className="text-md font-bold mb-2">
                6. Account Responsibility
              </h3>
              <p className="text-sm mb-4">
                By creating an account, you are responsible for maintaining the
                confidentiality of your account credentials, including your
                username and password. You agree to notify us immediately of any
                unauthorized use of your account or any security breach.
              </p>

              <h3 className="text-md font-bold mb-2">
                7. Modifications to Terms
              </h3>
              <p className="text-sm mb-4">
                TheMenuFy reserves the right to modify these Terms & Conditions
                at any time. We will notify users of any significant changes
                through the website. Continued use of our services after such
                modifications constitutes your acceptance of the revised Terms.
              </p>

              <h3 className="text-md font-bold mb-2">
                8. Limitation of Liability
              </h3>
              <p className="text-sm mb-4">
                TheMenuFy shall not be held liable for any indirect, incidental,
                special, or consequential damages arising from the use of our
                website or services. Our liability is limited to the maximum
                extent permitted by law.
              </p>

              <h3 className="text-md font-bold mb-2">9. Governing Law</h3>
              <p className="text-sm mb-4">
                These Terms & Conditions are governed by the laws of the
                jurisdiction in which TheMenuFy operates. Any disputes will be
                resolved in accordance with the applicable laws.
              </p>

              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-[#FA8072] text-white px-4 py-2 rounded mt-4 w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 bg-transparent py-3 text-center border-t border-[#FA8072]/30">
        <p className="text-xs font-light opacity-90 text-white">
          © 2025 TheMenuFy. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default Register;
