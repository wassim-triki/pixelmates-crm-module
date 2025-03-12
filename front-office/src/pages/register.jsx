import React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Button from '../components/button';
import Footer from '../components/footer';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import InputField from '../components/InputField';

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
          role: 'Client', // Default role for clients
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

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{
            backgroundImage: "url('/Register.jpg')",
            boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
          }}
        />
        <main className="relative flex-grow flex items-center justify-center py-10 px-4 sm:px-6 lg:px-20 overflow-hidden">
          <div className="w-full sm:w-[700px] lg:w-[800px] p-6 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-xl flex flex-col justify-between min-h-[70vh]">
            <div className="flex flex-col items-center space-y-6">
              <h1 className="text-3xl font-bold text-white text-center">
                Create Account
              </h1>

              {formik.errors.apiError && (
                <p className="text-red-500 text-center w-full font-medium">
                  {formik.errors.apiError}
                </p>
              )}

              <form className="w-full space-y-5" onSubmit={formik.handleSubmit}>
                <div className="flex space-x-4">
                  <div className="w-1/3">
                    <InputField
                      label="First Name"
                      name="firstName"
                      formik={formik}
                      placeholder="Enter your first name"
                      className="border-[#FA8072] focus:ring-[#FA8072]"
                    />
                  </div>
                  <div className="w-1/3">
                    <InputField
                      label="Last Name"
                      name="lastName"
                      formik={formik}
                      placeholder="Enter your last name"
                      className="border-[#FA8072] focus:ring-[#FA8072]"
                    />
                  </div>
                  <div className="w-1/3">
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      formik={formik}
                      placeholder="Enter your email"
                      className="border-[#FA8072] focus:ring-[#FA8072]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    formik={formik}
                    placeholder="Create a password"
                    className="border-[#FA8072] focus:ring-[#FA8072]"
                  />
                  <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    formik={formik}
                    placeholder="Confirm your password"
                    className="border-[#FA8072] focus:ring-[#FA8072]"
                  />

                  {/* Terms and Conditions */}
                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      name="termsAccepted"
                      className="h-4 w-4 text-[#FA8072] focus:ring-[#FA8072]"
                      checked={formik.values.termsAccepted}
                      onChange={formik.handleChange}
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-white">
                      I agree to the{' '}
                      <a href="#" className="text-[#FA8072] hover:text-[#FF6347]">
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                  {formik.touched.termsAccepted && formik.errors.termsAccepted && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.termsAccepted}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#FA8072] hover:bg-[#FA8072] active:bg-[#FA8072] text-white hover:text-white active:text-white border-2 disabled:border-[#FA8072]/50 border-[#FA8072] font-semibold py-3 px-6 rounded-full transition-all duration-300  disabled:text-gray-700"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Signing up' : 'Sign Up'}
                </Button>
              </form>
            </div>

            <div className="text-center mt-4">
              <span className="text-white"> Already have an account? </span>
              <Link
                to="/login"
                className="text-[#FA8072] hover:text-[#FF6347] font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </main>
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
