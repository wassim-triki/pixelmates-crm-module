import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/button';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';

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
          navigate('/verify-email', { state: { email: values.email } }); // Redirect to verification page
          return;
        }
        setApiError(err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login.jpg')",
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-md sm:w-[480px] p-10 rounded-2xl bg-white/10 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white pt-4">Sign in</h1>

            {/* Error Messages */}
            {apiError && (
              <p className="text-red-500 text-center w-full font-medium">
                {apiError}
              </p>
            )}

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
                    className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400"
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
                    className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400"
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
                    className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full bg-transparent hover:bg-yellow-500 text-white hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
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
              className="text-yellow-500 hover:text-yellow-400 font-medium"
            >
              Signup
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
