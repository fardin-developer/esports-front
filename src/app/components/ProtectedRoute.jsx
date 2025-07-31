"use client";

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const router = useRouter();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const hydrated = useSelector((state) => state.auth.hydrated);

  useEffect(() => {
    if (hydrated && requireAuth && !isLoggedIn) {
      // Get current path for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      const redirectPath = encodeURIComponent(currentPath);
      
      // Redirect to login with return URL
      router.push(`/login?redirect=${redirectPath}`);
    }
  }, [hydrated, isLoggedIn, requireAuth, router]);

  // Show loading spinner while checking authentication
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authentication is required but user is not logged in, don't render children
  if (requireAuth && !isLoggedIn) {
    return null;
  }

  // Render children if authentication check passes
  return children;
};

export default ProtectedRoute; 