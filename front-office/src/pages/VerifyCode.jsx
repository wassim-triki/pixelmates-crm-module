import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import Button from '../components/button';
import Footer from '../components/footer';
import BlurContainer from '../components/blurContainer';

function VerifyCode() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || ''; // Get email from state

  const [code, setCode] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  // Countdown effect for disabling the resend button
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const extractErrorMessage = (error) => {
    const msg = error?.response?.data?.message;
    return typeof msg === 'string' ? msg : 'Invalid input. Please try again.';
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axiosInstance.post('/auth/verify-email', { email, code });

      setMessage({
        type: 'success',
        text: 'Email successfully verified! Redirecting...',
      });
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setMessage({ type: 'error', text: extractErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axiosInstance.post('/auth/resend-verification', { email });

      setMessage({
        type: 'info',
        text: 'A new verification code has been sent to your email.',
      });
      setResendDisabled(true);
      setTimer(60); // Start 60-second countdown
    } catch (error) {
      setMessage({ type: 'error', text: extractErrorMessage(error) });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login.jpg')",
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
        }}
      />
      <main className="relative flex flex-col items-center justify-center w-full px-4">
        <BlurContainer className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white text-center">
            Enter Verification Code
          </h1>
          <p className="text-white text-center mt-2">
            We've sent a 6-digit code to{' '}
            <span className="font-semibold">{email}</span>. Enter it below.
          </p>

          {/* Show only one message at a time */}
          {message.text && (
            <p
              className={`text-center mt-2 ${
                message.type === 'success'
                  ? 'text-green-500'
                  : message.type === 'error'
                  ? 'text-red-500'
                  : 'text-yellow-400'
              }`}
            >
              {message.text}
            </p>
          )}

          <form className="w-full space-y-6 mt-4" onSubmit={handleVerify}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60"
              placeholder="Enter the code sent to your email"
              required
            />
            <Button
              type="submit"
              className="w-full bg-yellow-500 text-white py-3 px-6 rounded-full transition-all duration-300"
              disabled={loading || !code || resendLoading}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </form>

          {/* Resend Code */}
          <div className="text-center mt-4">
            <p className="text-white">Didn’t receive the code?</p>
            <button
              className="text-yellow-500 hover:text-yellow-400 font-medium mt-1"
              onClick={handleResendCode}
              disabled={resendLoading || resendDisabled}
            >
              {resendLoading
                ? 'Resending...'
                : resendDisabled
                ? `Resend in ${timer}s`
                : 'Resend Code'}
            </button>
          </div>
        </BlurContainer>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default VerifyCode;
