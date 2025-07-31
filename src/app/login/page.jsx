"use client";

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '../features/auth/authSlice';
import { apiClient } from '../apiClient';
import { ArrowLeft, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [step, setStep] = useState('mobile'); // 'mobile', 'otp', or 'register'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [registrationData, setRegistrationData] = useState({ name: '', email: '' });
  const [pendingPhone, setPendingPhone] = useState('');
  
  const otpRefs = useRef([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const hydrated = useSelector((state) => state.auth.hydrated);

  // Redirect URL from query params
  const redirectUrl = searchParams.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (hydrated && isLoggedIn) {
      router.push(redirectUrl);
    }
  }, [hydrated, isLoggedIn, router, redirectUrl]);

  // Timer effect for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-submit when all OTP fields are filled
  useEffect(() => {
    if (otp.every(digit => digit !== '') && step === 'otp') {
      handleOtpSubmit();
    }
  }, [otp, step]);

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);
    
    try {
      await apiClient.post('/user/send-otp', { phone: mobileNumber });
      setStep('otp');
      setTimer(60); // 60 seconds timer
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setError('');
    setIsLoading(true);
    
    const otpValue = otp.join('');
    try {
      const data = await apiClient.post('/user/verify-otp', { phone: mobileNumber, otp: otpValue });
      if (data.requiresRegistration) {
        setPendingPhone(data.phone);
        setStep('register');
      } else {
        // Success: dispatch login and redirect
        dispatch(login({ token: data.token || 'demo-token', userMobile: mobileNumber }));
        router.push(redirectUrl);
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await apiClient.post('/user/complete-registration', {
        name: registrationData.name,
        email: registrationData.email,
        phone: pendingPhone,
      });
      dispatch(login({ token: data.token || 'demo-token', userMobile: pendingPhone }));
      router.push(redirectUrl);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      await apiClient.post('/user/send-otp', { phone: mobileNumber });
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMobile = () => {
    setStep('mobile');
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimer(0);
  };

  const handleGoBack = () => {
    if (step === 'otp') {
      handleEditMobile();
    } else if (step === 'register') {
      setStep('otp');
    } else {
      router.push('/');
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {step === 'mobile' ? 'Back to Home' : 'Back'}
          </button>
          
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'mobile' && 'Welcome Back'}
            {step === 'otp' && 'Verify Your Number'}
            {step === 'register' && 'Complete Registration'}
          </h2>
          
          <p className="text-gray-700">
            {step === 'mobile' && 'Enter your mobile number to continue'}
            {step === 'otp' && `We sent a code to +91 ${mobileNumber}`}
            {step === 'register' && 'Just a few more details to get started'}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          {/* Mobile Number Step */}
          {step === 'mobile' && (
            <form className="space-y-6" onSubmit={handleMobileSubmit}>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium">
                    +91
                  </span>
                  <input
                    id="mobile"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onKeyDown={(e) => e.key === 'Enter' && handleMobileSubmit(e)}
                    placeholder="Enter 10-digit number"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || mobileNumber.length < 10}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <div className="space-y-6">
              {/* Mobile Number Display */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm">+91</span>
                  <span className="text-gray-900 font-medium">{mobileNumber}</span>
                </div>
                <button
                  onClick={handleEditMobile}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  Edit
                </button>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Enter 6-digit verification code
                </label>
                <div className="flex justify-between space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => otpRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      maxLength={1}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Resend OTP */}
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-gray-600 text-sm">
                    Resend code in {timer} seconds
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Resending...' : 'Resend OTP'}
                  </button>
                )}
              </div>

              {/* Loading indicator when verifying OTP */}
              {isLoading && otp.every(digit => digit !== '') && (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Verifying code...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Registration Step */}
          {step === 'register' && (
            <form className="space-y-6" onSubmit={handleRegistrationSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={registrationData.name}
                  onChange={e => setRegistrationData({ ...registrationData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={registrationData.email}
                  onChange={e => setRegistrationData({ ...registrationData, email: e.target.value })}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <a href="/terms-website" className="text-blue-600 hover:text-blue-700 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 