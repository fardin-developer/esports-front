import React from "react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] relative">
      {/* Background particles effect */}
      <div className="absolute inset-0 bg-gradient-radial from-[rgba(100,255,218,0.1)] via-transparent to-transparent opacity-50"></div>
      
      <div className="bg-[rgba(15,15,35,0.95)] backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-[rgba(100,255,218,0.3)] relative z-10">
        <h1 className="text-3xl font-extrabold text-[#64ffda] mb-6 text-center shimmer">Create Your Account</h1>
        <form className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(100,255,218,0.3)] text-white placeholder:text-gray-400 focus:outline-none focus:border-[#64ffda] focus:shadow-lg focus:shadow-[rgba(100,255,218,0.2)] transition-all duration-300"
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(100,255,218,0.3)] text-white placeholder:text-gray-400 focus:outline-none focus:border-[#64ffda] focus:shadow-lg focus:shadow-[rgba(100,255,218,0.2)] transition-all duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(100,255,218,0.3)] text-white placeholder:text-gray-400 focus:outline-none focus:border-[#64ffda] focus:shadow-lg focus:shadow-[rgba(100,255,218,0.2)] transition-all duration-300"
          />
          <button
            type="submit"
            className="mt-2 py-3 rounded-xl bg-gradient-to-r from-[#64ffda] to-[#00bcd4] text-[#0f0f23] font-bold text-lg shadow-lg hover:shadow-[rgba(100,255,218,0.3)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-300">
          Already have an account?{' '}
          <Link href="/login" className="text-[#64ffda] hover:underline font-semibold transition-colors duration-300">Login</Link>
        </p>
      </div>
    </div>
  );
} 