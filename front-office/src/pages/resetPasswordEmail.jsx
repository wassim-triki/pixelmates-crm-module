import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axiosInstance from '../config/axios';
import Button from '../components/button';
import Footer from '../components/footer';
import BlurContainer from '../components/blurContainer';

// ✅ **Validation Schema using Yup**
const validationSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
});

function ResetPasswordEmail() {
  const [apiMessage, setApiMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiMessage('');
      setIsSuccess(false);

      try {
        // ✅ **Send API request to backend**
        const response = await axiosInstance.post('/auth/forgot-password', {
          email: values.email,
        });

        // ✅ **Show success message**
        setApiMessage(response.data.message);
        setIsSuccess(true);
      } catch (error) {
        // ❌ **Handle errors**
        setApiMessage(error.response?.data?.message || 'Something went wrong');
        setIsSuccess(false);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {/* ✅ Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login.jpg')",
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* ✅ Main Content */}
      <main className="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8">
        <BlurContainer className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-8 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-xl">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white text-center">
              Reset Your Password
            </h1>

            {/* ✅ Display API Message */}
            {apiMessage && (
              <p
                className={`text-center font-medium ${
                  isSuccess ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {apiMessage}
              </p>
            )}

            {/* ✅ Reset Form */}
            <form className="w-full space-y-6" onSubmit={formik.handleSubmit}>
              <div className="space-y-4">
                {/* ✅ Email Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Enter your email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                    placeholder="Enter your email address"
                    required
                  />
                  {/* ✅ Show validation error */}
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* ✅ Submit Button (Disabled while submitting) */}
              <Button
                className="w-full bg-transparent hover:bg-yellow-500 text-white hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Sending...' : 'Reset Password'}
              </Button>
            </form>
          </div>
        </BlurContainer>
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}

export default ResetPasswordEmail;
