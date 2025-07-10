"use client";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="w-full max-w-2xl bg-white/80 rounded-2xl shadow-xl p-8 flex flex-col gap-8 items-center mt-16 mb-8">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-2"><circle cx="12" cy="12" r="10" fill="#6366f1"/><path d="M8 12h8M8 16h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        <h1 className="text-4xl font-extrabold text-indigo-700 text-center">Welcome to CoinFront</h1>
        <p className="text-lg text-gray-600 text-center max-w-md">Your modern platform for seamless crypto trading and portfolio management. Join us to experience a secure, fast, and user-friendly crypto journey.</p>
        <div className="flex gap-4 flex-col sm:flex-row w-full justify-center">
          <a href="/login" className="w-full sm:w-auto px-8 py-3 rounded-lg bg-indigo-500 text-white font-semibold text-lg hover:bg-indigo-600 transition text-center shadow-md">Login</a>
          <a href="/signup" className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white border border-indigo-400 text-indigo-600 font-semibold text-lg hover:bg-indigo-50 transition text-center shadow">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
