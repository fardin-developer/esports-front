// Get the current domain and construct API URL
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current domain
    const hostname = window.location.hostname;
    return `https://api.${hostname}/api/v1`;
  } else {
    // Server-side: fallback to environment variable or default
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.localhost';
  }
};

export const API_BASE_URL = getApiBaseUrl();