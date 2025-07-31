"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  ArrowRight,
  Search,
  HelpCircle,
  Mail,
  ArrowLeft,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoHome = useCallback(() => {
    setIsRedirecting(true);
    router.push("/");
  }, [router]);

  const handleGoBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  const navigationItems = [
    { label: "Help Center", path: "/help", icon: HelpCircle },
    { label: "Search", path: "/search", icon: Search },
    { label: "Contact Support", path: "/contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl space-y-10 text-center">
        {/* Error Icon and Code */}
        <div>
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800 text-white text-4xl font-bold rounded-full shadow-lg">
            404
          </div>
          <h1 className="mt-6 text-3xl md:text-4xl font-semibold text-gray-900">
            Page Not Found
          </h1>
          <p className="mt-2 text-gray-600 text-base md:text-lg">
            The page you're looking for doesn’t exist or has been moved.
          </p>
        </div>

        {/* Redirect Info */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  Redirecting to homepage
                </p>
                <p className="text-xs text-gray-500">
                  in {countdown} second{countdown !== 1 && "s"}
                </p>
              </div>
            </div>
            <div className="text-xl font-bold text-blue-600">{countdown}</div>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-2 bg-blue-500 transition-all ease-linear"
              style={{ width: `${((10 - countdown) / 10) * 100}%` }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGoHome}
              disabled={isRedirecting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isRedirecting ? "Redirecting..." : "Go Home Now"}
            </button>
            <button
              onClick={handleGoBack}
              className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Navigation Suggestions */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <p className="mb-4 text-gray-800 font-medium text-sm">
            Still looking for something?
          </p>
          <div className="space-y-2">
            {navigationItems.map(({ label, path, icon: Icon }) => (
              <button
                key={label}
                onClick={() => router.push(path)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition group"
              >
                <div className="flex items-center gap-3 text-gray-700 group-hover:text-gray-900">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-xs text-gray-400 mt-6">Error Code: 404</p>
      </div>
    </div>
  );
}
