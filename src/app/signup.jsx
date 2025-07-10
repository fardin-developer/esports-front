"use client";
import { useState, useRef } from "react";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef([]);

  // Simulate sending OTP
  const sendOtp = async () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  // Simulate verifying OTP
  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      if (otp.join("") === "654321") {
        alert("Signup successful! Welcome to CoinFront.");
      } else {
        setError("Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    }, 1000);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setPhone(value);
  };

  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
    if (newOtp.every((d) => d.length === 1)) {
      verifyOtp();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 flex flex-col gap-8 border border-pink-200">
        <div className="flex flex-col items-center gap-3">
          <svg width="56" height="56" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ec4899"/><path d="M8 12h8M8 16h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          <h1 className="text-3xl font-extrabold text-pink-600">Create Account</h1>
          <p className="text-gray-500 text-center">Sign up to join CoinFront and start your journey!</p>
        </div>
        {step === 1 && (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (phone.length === 10) sendOtp();
              else setError("Enter a valid 10-digit phone number");
            }}
            className="flex flex-col gap-4"
          >
            <label className="block">
              <span className="text-gray-700 font-medium">Phone Number</span>
              <input
                type="tel"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg bg-pink-50"
                placeholder="Enter your phone number"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={10}
                inputMode="numeric"
                autoFocus
                required
              />
            </label>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-pink-500 text-white font-semibold text-lg hover:bg-pink-600 transition disabled:opacity-50 shadow-md"
              disabled={loading || phone.length !== 10}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (otp.every(d => d.length === 1)) verifyOtp();
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2 items-center">
              <span className="text-gray-700 font-medium">Enter OTP</span>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => (otpRefs.current[idx] = el)}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 h-12 text-center text-xl border-b-2 border-pink-400 focus:outline-none focus:border-pink-600 transition bg-pink-50 rounded"
                    value={digit}
                    onChange={e => handleOtpChange(e, idx)}
                    onKeyDown={e => handleOtpKeyDown(e, idx)}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
              <span className="text-gray-500 text-xs mt-2">OTP sent to +91 {phone}</span>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-pink-500 text-white font-semibold text-lg hover:bg-pink-600 transition disabled:opacity-50 shadow-md"
              disabled={loading || otp.some(d => d.length !== 1)}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              className="w-full py-2 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition"
              onClick={() => {
                setStep(1);
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }}
              disabled={loading}
            >
              Change phone number
            </button>
          </form>
        )}
        <div className="text-center text-sm text-gray-500 mt-2">
          Already have an account? <a href="/" className="text-pink-600 font-semibold hover:underline">Login</a>
        </div>
      </div>
    </div>
  );
} 