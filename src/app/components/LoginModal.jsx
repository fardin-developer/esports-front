import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../features/auth/authSlice'
import { apiClient } from '../apiClient'

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
    e.preventDefault()
    setError('')
    
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid mobile number')
      return
    }

    setIsLoading(true)
    
    try {
      await apiClient.post('/user/send-otp', { phone: mobileNumber })
      setStep('otp')
      setTimer(60) // 60 seconds timer
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async () => {
    setError('')
    setIsLoading(true)
    
    const otpValue = otp.join('')
    try {
      const data = await apiClient.post('/user/verify-otp', { phone: mobileNumber, otp: otpValue })
      if (data.requiresRegistration) {
        setPendingPhone(data.phone)
        setStep('register')
      } else {
        // Success: dispatch login, call onLoginSuccess, close modal
        dispatch(login({ token: data.token || 'demo-token', userMobile: mobileNumber }))
        try {
          onLoginSuccess?.(mobileNumber)
        } catch (err) {
          // ignore
        }
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const data = await apiClient.post('/user/complete-registration', {
        name: registrationData.name,
        email: registrationData.email,
        phone: pendingPhone,
      })
      dispatch(login({ token: data.token || 'demo-token', userMobile: pendingPhone }))
      try {
        onLoginSuccess?.(pendingPhone)
      } catch (err) {}
      onClose()
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
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
      await apiClient.post('/user/send-otp', { phone: mobileNumber })
      setTimer(60)
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } catch (err) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-[#0f0f23] border border-[rgba(100,255,218,0.2)] rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-[rgba(100,255,218,0.1)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#64ffda] to-[#00bcd4] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📱</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {step === 'mobile' ? 'Enter Mobile Number' : 'Enter OTP'}
          </h2>
          <p className="text-white/70">
            {step === 'mobile' 
              ? 'We\'ll send you a verification code' 
              : `Code sent to ${mobileNumber}`}
          </p>
        </div>

        {/* Mobile Number Step */}
        {step === 'mobile' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
                  +91
                </span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyDown={(e) => e.key === 'Enter' && handleMobileSubmit(e)}
                  placeholder="Enter 10-digit number"
                  className="w-full pl-12 pr-4 py-3 bg-[rgba(100,255,218,0.05)] border border-[rgba(100,255,218,0.2)] rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#64ffda] focus:ring-2 focus:ring-[rgba(100,255,218,0.2)] transition-all duration-300"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {error}
              </div>
            )}

            <button
              onClick={handleMobileSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#64ffda] to-[#00bcd4] text-[#0f0f23] rounded-lg font-semibold hover:shadow-lg hover:shadow-[rgba(100,255,218,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="space-y-6">
            {/* Mobile Number Display */}
            <div className="flex items-center justify-between bg-[rgba(100,255,218,0.05)] p-3 rounded-lg border border-[rgba(100,255,218,0.2)]">
              <div className="flex items-center space-x-2">
                <span className="text-white/60 text-sm">+91</span>
                <span className="text-white/60 text-sm">{mobileNumber}</span>
              </div>
              <button
                onClick={handleEditMobile}
                className="text-[#64ffda] hover:text-[#00bcd4] text-sm font-medium transition-colors duration-200"
              >
                Edit
              </button>
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-4">
                Enter 6-digit OTP
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
                    className="w-12 h-12 text-center text-lg font-semibold bg-[rgba(100,255,218,0.05)] border border-[rgba(100,255,218,0.2)] rounded-lg text-white focus:outline-none focus:border-[#64ffda] focus:ring-2 focus:ring-[rgba(100,255,218,0.2)] transition-all duration-300"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {error}
              </div>
            )}

            {/* Resend OTP */}
            <div className="text-center">
              {timer > 0 ? (
                <p className="text-white/70 text-sm">
                  Resend OTP in {timer} seconds
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-[#64ffda] hover:text-[#00bcd4] text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Resending...' : 'Resend OTP'}
                </button>
              )}
            </div>

            {/* Loading indicator when verifying OTP */}
            {isLoading && otp.every(digit => digit !== '') && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-[#64ffda]">
                  <div className="w-4 h-4 border-2 border-[#64ffda] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Verifying OTP...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Registration Step */}
        {step === 'register' && (
          <form className="space-y-6" onSubmit={handleRegistrationSubmit}>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Name</label>
              <input
                type="text"
                value={registrationData.name}
                onChange={e => setRegistrationData({ ...registrationData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-[rgba(100,255,218,0.05)] border border-[rgba(100,255,218,0.2)] rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#64ffda] focus:ring-2 focus:ring-[rgba(100,255,218,0.2)] transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Email</label>
              <input
                type="email"
                value={registrationData.email}
                onChange={e => setRegistrationData({ ...registrationData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-[rgba(100,255,218,0.05)] border border-[rgba(100,255,218,0.2)] rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#64ffda] focus:ring-2 focus:ring-[rgba(100,255,218,0.2)] transition-all duration-300"
                required
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#64ffda] to-[#00bcd4] text-[#0f0f23] rounded-lg font-semibold hover:shadow-lg hover:shadow-[rgba(100,255,218,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginModal