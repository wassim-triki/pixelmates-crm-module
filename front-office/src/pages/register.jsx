import React from 'react';
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

  // ✅ **Google Sign-up Handler**
  const handleGoogleSignUp = () => {
    window.location.href = `http://localhost:5000/api/auth/google`;
  };

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
                      <a
                        href="#"
                        className="text-[#FA8072] hover:text-[#FF6347]"
                      >
                        Terms and Conditions
                      </a>
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
                  className="w-full !bg-[#FA8072] hover:!bg-[#de7e73] active:bg-[#FA8072] text-white hover:text-white active:text-white border-2 disabled:border-[#FA8072]/50 border-[#FA8072] font-semibold py-3 px-6 rounded-full transition-all duration-300  disabled:text-gray-700 cursor-pointer"
                  disabled={formik.isSubmitting}
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
