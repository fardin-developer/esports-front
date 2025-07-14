import { API_BASE_URL } from './config';

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
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Convenience methods for common HTTP verbs
export const apiClient = {
  get: (path) => apiFetch(path),
  post: (path, data) => apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (path, data) => apiFetch(path, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (path) => apiFetch(path, {
    method: 'DELETE',
  }),
}; 