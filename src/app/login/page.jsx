"use client";

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login } from '../features/auth/authSlice';
import { apiClient } from '../apiClient';
import { ArrowLeft, AlertCircle, User, Mail, Lock, ShieldCheck, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const [step, setStep] = useState('mobile'); 
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [registrationData, setRegistrationData] = useState({ name: '', email: '', password: '' });
  const [pendingPhone, setPendingPhone] = useState('');
  
  const otpRefs = useRef([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState('/');
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const hydrated = useSelector((state) => state.auth.hydrated);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) setRedirectUrl(redirect);
    }
  }, []);

  useEffect(() => {
    if (hydrated && isLoggedIn) {
      router.push(redirectUrl);
    }
  }, [hydrated, isLoggedIn, router, redirectUrl]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (otp.every(digit => digit !== '') && step === 'otp') {
      handleOtpSubmit();
    }
  }, [otp, step]);

  const handleMobileSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    if (mobileNumber.length < 10) {
      setError('Enter a valid 10-digit number');
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.post('/user/send-otp', { phone: mobileNumber });
      setStep('otp');
      setTimer(60);
    } catch (err) {
      setError(err.message || 'OTP delivery failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setError('');
    setIsLoading(true);
    try {
      const data = await apiClient.post('/user/verify-otp', { phone: mobileNumber, otp: otp.join('') });
      if (data.requiresRegistration) {
        setPendingPhone(data.phone);
        setStep('register');
      } else {
        dispatch(login({ token: data.token || 'demo-token', userMobile: mobileNumber }));
        router.push(redirectUrl);
      }
    } catch (err) {
      setError('Invalid code. Please check and try again.');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!registrationData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!registrationData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!registrationData.password.trim()) {
      setError('Please enter a password');
      return;
    }
    if (registrationData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiClient.post('/user/complete-registration', {
        phone: pendingPhone,
        name: registrationData.name.trim(),
        email: registrationData.email.trim(),
        password: registrationData.password
      });
      
      dispatch(login({ token: data.token || 'demo-token', userMobile: pendingPhone }));
      router.push(redirectUrl);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (step === 'mobile') {
      router.push('/'); // Navigate to home page
    } else if (step === 'otp') {
      setStep('mobile');
      setOtp(['', '', '', '', '', '']);
    } else if (step === 'register') {
      setStep('otp');
    }
  };

  if (!hydrated) return null;

  return (
    <div className="fixed inset-0 bg-[#FECA00] flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-[350px] z-10">
        
        {/* Compact Back Button */}
        <button 
          onClick={handleGoBack}
          className="group flex items-center text-[13px] font-bold text-gray-600 hover:text-black mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step === 'mobile' ? 'Go to Home' : 'Change Details'}
        </button>

        <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-white/60 overflow-hidden">
          <div className="p-6 sm:p-8">
            
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#1A1A1A]">
                {step === 'mobile' && "Sign In"}
                {step === 'otp' && "Verify OTP"}
                {step === 'register' && "Profile Setup"}
              </h2>
              {step === 'otp' && (
                <p className="text-[12px] text-gray-500 mt-1 font-medium italic">
                  Sending code to +91 {mobileNumber}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 rounded-xl text-red-600 border border-red-100 animate-shake">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] font-bold leading-tight">{error}</p>
              </div>
            )}

            {/* STEP 1: MOBILE */}
            {step === 'mobile' && (
              <div className="space-y-4">
                <div className="group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-1.5 block ml-1">Phone Number</label>
                  <div className="flex items-center bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-[#FECA00] focus-within:bg-white transition-all px-3 py-3">
                    <span className="text-gray-900 font-black text-sm mr-2.5 border-r pr-2.5 border-gray-200">+91</span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="bg-transparent w-full outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                    />
                  </div>
                </div>
                <button
                  onClick={handleMobileSubmit}
                  disabled={isLoading || mobileNumber.length < 10}
                  className="w-full bg-[#FECA00] hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 text-[#1A1A1A] py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isLoading ? "Wait..." : "Get OTP"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: OTP */}
            {step === 'otp' && (
              <div className="space-y-6">
                <div className="flex justify-between gap-1.5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => otpRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length > 1) return;
                        const newOtp = [...otp];
                        newOtp[index] = val;
                        setOtp(newOtp);
                        if (val && index < 5) otpRefs.current[index + 1]?.focus();
                      }}
                      onKeyDown={(e) => e.key === 'Backspace' && !otp[index] && index > 0 && otpRefs.current[index - 1]?.focus()}
                      className="w-full aspect-square text-center text-lg font-black bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#FECA00] focus:bg-white transition-all outline-none text-gray-900"
                      maxLength={1}
                    />
                  ))}
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="h-[2px] w-8 bg-gray-100 rounded-full"></div>
                  <button
                    disabled={timer > 0 || isLoading}
                    onClick={handleMobileSubmit}
                    className="text-[11px] font-black text-[#FECA00] uppercase tracking-tighter disabled:text-gray-300 transition-colors"
                  >
                    {timer > 0 ? `Resend code in ${timer}s` : "Resend code now"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REGISTER */}
            {step === 'register' && (
              <form onSubmit={handleRegistrationSubmit} className="space-y-3">
                <div className="bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-[#FECA00] transition-all px-3 py-3 flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2.5" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-transparent w-full outline-none text-sm font-bold text-gray-900"
                    required
                  />
                </div>
                <div className="bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-[#FECA00] transition-all px-3 py-3 flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2.5" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-transparent w-full outline-none text-sm font-bold text-gray-900"
                    required
                  />
                </div>
                <div className="bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-[#FECA00] transition-all px-3 py-3 flex items-center">
                  <Lock className="w-4 h-4 text-gray-400 mr-2.5" />
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={registrationData.password}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-transparent w-full outline-none text-sm font-bold text-gray-900"
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !registrationData.name.trim() || !registrationData.email.trim() || !registrationData.password.trim()}
                  className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-xl font-black text-sm transition-all shadow-md mt-2 disabled:opacity-50"
                >
                  {isLoading ? "Setting up..." : "Complete"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-8 text-center opacity-70">
           <p className="text-[9px] uppercase tracking-[0.3em] text-gray-800 flex items-center justify-center gap-2">
            Verified Account Protection
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.15s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}