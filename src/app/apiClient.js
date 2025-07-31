import { API_BASE_URL } from './config';

// Function to handle logout and redirect
function handleAuthFailure() {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    localStorage.removeItem('auth');
    
    // Get current path for redirect
    const currentPath = window.location.pathname + window.location.search;
    const redirectPath = currentPath !== '/login' ? `?redirect=${encodeURIComponent(currentPath)}` : '';
    
    // Redirect to login page
    window.location.href = `/login${redirectPath}`;
  }
}

export async function apiFetch(path, options = {}) {
  // Add Bearer token from localStorage if available (client-side only)
  let authHeaders = {};
  if (typeof window !== 'undefined') {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const token = auth?.token;
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    });
    
    // Handle 401 Unauthorized errors
    if (res.status === 401) {
      const data = await res.json().catch(() => ({}));
      
      // Check if it's specifically an authentication error
      if (data.error && data.error.includes('Authentication failed')) {
        handleAuthFailure();
        throw new Error('Authentication failed. Redirecting to login...');
      }
      
      throw new Error(`Unauthorized: ${data.message || 'Authentication required'}`);
    }
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Convenience methods for common HTTP verbs
export const apiClient = {
  get: (path, options = {}) => apiFetch(path, options),
  post: (path, data, options = {}) => apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  }),
  put: (path, data, options = {}) => apiFetch(path, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  }),
  delete: (path, options = {}) => apiFetch(path, {
    method: 'DELETE',
    ...options,
  }),
}; 