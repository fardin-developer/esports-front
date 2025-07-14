import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-surface to-surface relative">
      {/* Background particles effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50"></div>
      
      <div className="bg-surface-light backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-primary/30 relative z-10">
        <h1 className="text-3xl font-extrabold text-primary mb-6 text-center shimmer">Login to Your Account</h1>
        <form className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-surface border border-primary/30 text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl bg-surface border border-primary/30 text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
          />
          <button
            type="submit"
            className="mt-2 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-bg font-bold text-lg shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline font-semibold transition-colors duration-300">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}