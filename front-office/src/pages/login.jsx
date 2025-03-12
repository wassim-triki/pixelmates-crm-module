import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/button';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc'; // Google Icon

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

function Login() {
  const { login, user } = useAuth();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      setApiError('');
      setLoading(true);
      try {
        await login(values.email, values.password);
      } catch (err) {
        if (err === 'Please verify your email before logging in.') {
          navigate('/verify-email', { state: { email: values.email } });
          return;
        }
        setApiError(err);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleSignIn = () => {
    window.location.href = `http://localhost:5000/api/auth/google`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login.jpg')",
        }}
      />

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-md sm:w-[480px] p-10 rounded-2xl bg-white/20 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white pt-4">Sign in</h1>

            {/* Error Messages */}
            {apiError && (
              <p className="text-red-400 text-center w-full font-medium">
                {apiError}
              </p>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full gap-3 border-2 border-gray-300/30 py-3 rounded-full text-white bg-transparent hover:bg-gray-100 hover:text-black transition-all duration-300"
            >
              <FcGoogle size={22} />
              Sign in with Google
            </button>

            <div className="relative flex items-center w-full">
              <div className="w-full border-t border-gray-400"></div>
              <span className="px-3 text-white text-sm">OR</span>
              <div className="w-full border-t border-gray-400"></div>
            </div>

            {/* Login Form */}
            <form
              className="w-full max-w-sm space-y-6"
              onSubmit={formik.handleSubmit}
            >
              <div className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-300"
                    placeholder="Enter your email"
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-300"
                    placeholder="Enter your password"
                  />
                  {formik.errors.password && formik.touched.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-[#FA8072] hover:text-[#FF6347] font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full !bg-[#FA8072] hover:!bg-[#c47168] active:bg-[#FA8072] text-white hover:text-white active:text-white border-2 disabled:border-[#FA8072]/50 border-[#FA8072] font-semibold py-3 px-6 rounded-full cursor-pointer transition-all duration-300  disabled:text-gray-700"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </div>

          {/* Signup Link */}
          <div className="text-center mt-4">
            <span className="text-white">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-[#FA8072] hover:text-[#FF6347] font-medium"
            >
              Signup
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 bg-transparent py-3 text-center border-t border-[#FA8072]/30">
        <p className="text-xs font-light opacity-90 text-white">
          © 2025 TheMenuFy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Login;
