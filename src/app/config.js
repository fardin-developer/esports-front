function getApiBaseUrl() {
  // const hostname = window.location.hostname;
  
  // // Handle localhost development
  // if (hostname === 'localhost' || hostname === '127.0.0.1') {
  //   return 'https://game.cptopup.in/api/v1';
  // }
  
  // // Split hostname and get the root domain (last two parts)
  // const parts = hostname.split('.').filter(Boolean);
  
  // // Extract root domain
  // const rootDomain = parts.length >= 2 ? parts.slice(-2).join('.') : hostname;
  
  // // Use 'game' subdomain with the root domain
  // return `https://game.${rootDomain}/api/v1`;
}

export const API_BASE_URL = 'https://game.cptopup.in/';