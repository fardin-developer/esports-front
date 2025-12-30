import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../features/auth/authSlice'
import { API_BASE_URL } from '../config';
import { AlertCircle, User, Mail, ChevronRight, X } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState('mobile') // 'mobile' or 'otp'
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  const [registrationData, setRegistrationData] = useState({ name: '', email: '' })
  const [pendingPhone, setPendingPhone] = useState('')
  
  const otpRefs = useRef([])
  const dispatch = useDispatch()

  // Enhanced fetch function with better error handling
  const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection.');
      }
      throw error;
    }
  };

  // Timer effect for OTP resend
  useEffect(() => {
    let interval
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  // Auto-submit when all OTP fields are filled
  useEffect(() => {
    if (otp.every(digit => digit !== '') && step === 'otp') {
      handleOtpSubmit()
    }
  }, [otp, step])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('mobile')
      setMobileNumber('')
      setOtp(['', '', '', '', '', ''])
      setError('')
      setTimer(0)
    }
  }, [isOpen])

  const handleMobileSubmit = async (e) => {
    if (e) e.preventDefault()
    setError('')
    
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Enter a valid 10-digit number')
      return
    }

    setIsLoading(true)
    
    try {
      console.log('Sending OTP request to:', `${API_BASE_URL}/user/send-otp`);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/send-otp`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ phone: mobileNumber })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Failed to send OTP';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          if (response.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          } else if (response.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (response.status === 404) {
            errorMessage = 'Service not found. Please contact support.';
          }
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('OTP sent successfully:', data);
      
      setStep('otp')
      setTimer(60)
    } catch (err) {
      console.error('Send OTP error:', err);
      let errorMessage = 'OTP delivery failed. Please try again.';
      
      if (err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please check your connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async () => {
    setError('')
    setIsLoading(true)
    
    const otpValue = otp.join('')
    try {
      console.log('Verifying OTP:', `${API_BASE_URL}/user/verify-otp`);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/verify-otp`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ phone: mobileNumber, otp: otpValue })
      });
      
      if (!response.ok) {
        let errorMessage = 'Invalid OTP';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json()
      console.log('OTP verified successfully:', data);
      
      if (data.requiresRegistration) {
        setPendingPhone(data.phone)
        setStep('register')
      } else {
        dispatch(login({ token: data.token || 'demo-token', userMobile: mobileNumber }))
        try {
          onLoginSuccess?.(mobileNumber)
        } catch (err) {
          console.error('onLoginSuccess callback error:', err);
        }
        onClose()
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError('Invalid code. Please check and try again.')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/complete-registration`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          name: registrationData.name,
          email: registrationData.email,
          phone: pendingPhone,
        })
      });
      
      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json()
      dispatch(login({ token: data.token || 'demo-token', userMobile: pendingPhone }))
      try {
        onLoginSuccess?.(pendingPhone)
      } catch (err) {
        console.error('onLoginSuccess callback error:', err);
      }
      onClose()
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    const val = value.replace(/\D/g, '');
    if (val.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = val
    setOtp(newOtp)
    
    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleResendOtp = async () => {
    setError('')
    setIsLoading(true)
    
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/send-otp`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ phone: mobileNumber })
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to resend OTP';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }
      
      setTimer(60)
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditMobile = () => {
    setStep('mobile')
    setOtp(['', '', '', '', '', ''])
    setError('')
    setTimer(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FECA00]/95 backdrop-blur-sm">
      <div className="w-full max-w-[350px]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="group flex items-center text-[13px] font-bold text-gray-700 hover:text-black mb-5 transition-colors"
        >
          <X className="w-4 h-4 mr-2" />
          Close
        </button>

        <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/60 overflow-hidden">
          <div className="p-6 sm:p-8">
            
            {/* Header */}
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

            {/* Error Message */}
            {error && (
              <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 rounded-xl text-red-600 border border-red-100 animate-shake">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
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
                      onKeyDown={(e) => e.key === 'Enter' && handleMobileSubmit(e)}
                      placeholder="9876543210"
                      className="bg-transparent w-full outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                    />
                  </div>
                </div>
                <button
                  onClick={handleMobileSubmit}
                  disabled={isLoading || mobileNumber.length < 10}
                  className="w-full bg-[#FECA00] hover:shadow-lg hover:-translate-y-px active:translate-y-0 text-[#1A1A1A] py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isLoading ? "Wait..." : "Get OTP"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: OTP */}
            {step === 'otp' && (
              <div className="space-y-6">
                {/* Edit mobile button */}
                <button
                  onClick={handleEditMobile}
                  className="text-[11px] font-bold text-[#FECA00] hover:text-[#1A1A1A] transition-colors"
                >
                  ← Change Number
                </button>

                <div className="flex justify-between gap-1.5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => otpRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-full aspect-square text-center text-lg font-black bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#FECA00] focus:bg-white transition-all outline-none text-gray-900"
                      maxLength={1}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="h-[2px] w-8 bg-gray-100 rounded-full"></div>
                  <button
                    disabled={timer > 0 || isLoading}
                    onClick={handleResendOtp}
                    className="text-[11px] font-black text-[#FECA00] uppercase tracking-tighter disabled:text-gray-300 transition-colors"
                  >
                    {timer > 0 ? `Resend code in ${timer}s` : "Resend code now"}
                  </button>
                </div>

                {/* Loading indicator when verifying OTP */}
                {isLoading && otp.every(digit => digit !== '') && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-[#1A1A1A]">
                      <div className="w-4 h-4 border-2 border-[#FECA00] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold">Verifying...</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: REGISTER */}
            {step === 'register' && (
              <form className="space-y-3" onSubmit={handleRegistrationSubmit}>
                <div className="bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-[#FECA00] transition-all px-3 py-3 flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2.5" />
                  <input
                    type="text"
                    value={registrationData.name}
                    onChange={e => setRegistrationData({ ...registrationData, name: e.target.value })}
                    placeholder="Full Name"
                    className="bg-transparent w-full outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-[#FECA00] transition-all px-3 py-3 flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2.5" />
                  <input
                    type="email"
                    value={registrationData.email}
                    onChange={e => setRegistrationData({ ...registrationData, email: e.target.value })}
                    placeholder="Email Address"
                    className="bg-transparent w-full outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
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
  )
}

export default LoginModal
