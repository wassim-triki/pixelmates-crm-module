import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axiosInstance from '../config/axios';
import Button from '../components/button';
import Footer from '../components/footer';
import BlurContainer from '../components/blurContainer';
import InputField from '../components/InputField';

// ✅ **Validation Schema using Yup**
const validationSchema = yup.object({
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [apiMessage, setApiMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ **Extract token & email from URL**
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setApiMessage('Invalid or expired reset link.');
      setIsSuccess(false);
    }
  }, [token, email]);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiMessage('');
      setIsSuccess(false);

      try {
        // ✅ **Send API request to reset password**
        const response = await axiosInstance.post('/auth/reset-password', {
          token,
          email,
          newPassword: values.newPassword,
        });

        // ✅ **Show success message**
        setApiMessage(response.data.message);
        setIsSuccess(true);

        // ✅ **Redirect after a short delay**
        setTimeout(() => navigate('/login'), 3000);
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
        {/* ✅ Blur Container */}
        <BlurContainer className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-8 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-xl">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white">
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
            <form className="w-full space-y-5" onSubmit={formik.handleSubmit}>
              <div className="space-y-4">
                {/* ✅ New Password Input */}
                <InputField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  formik={formik}
                  placeholder="Enter your new password"
                />

                {/* ✅ Confirm Password Input */}
                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  formik={formik}
                  placeholder="Confirm your new password"
                />
              </div>

              {/* ✅ Submit Button (Disabled if form is invalid or submitting) */}
              <Button
                className="w-full bg-transparent hover:bg-yellow-500 text-white hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 mt-4"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? 'Resetting Password...'
                  : 'Reset Password'}
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

export default ResetPassword;
