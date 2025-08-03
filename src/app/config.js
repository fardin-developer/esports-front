function getApiBaseUrl() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000/api/v1';
    }
    
    const parts = hostname.split('.').filter(Boolean);
    const rootDomain = parts.length >= 2 ? parts.slice(-2).join('.') : hostname;
    return `https://api.${rootDomain}/api/v1`;
  }

export const API_BASE_URL = getApiBaseUrl();