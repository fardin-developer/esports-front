// Function to get site name from domain
export function getSiteNameFromDomain() {
  // Check for environment variable first
  if (process.env.NEXT_PUBLIC_SITE_NAME) {
    return process.env.NEXT_PUBLIC_SITE_NAME;
  }

  // Server-side: always return default to prevent hydration mismatch
  if (typeof window === 'undefined') {
    return 'CP TopUp';
  }

  // Client-side: use actual hostname
  const hostname = window.location.hostname;
  
  // Handle localhost and development
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('vercel.app')) {
    return 'CP TopUp';
  }
  
  // Remove www. and common TLDs
  const siteName = hostname
    .replace(/^www\./, '')
    .replace(/\.(com|in|org|net|co\.in|co\.uk|io|dev|app)$/, '')
    .split('.')[0];
  
  // Handle special cases and capitalize
  const specialCases = {
    'zenova': 'Zenova',
    'CP TopUp': 'CP TopUp',
    'leafstore': 'LeafStore',
    'gaming': 'Gaming Platform',
    'topup': 'TopUp Platform',
    'uc': 'UC Platform'
  };
  
  const lowerName = siteName.toLowerCase();
  if (specialCases[lowerName]) {
    return specialCases[lowerName];
  }
  
  // Default: capitalize first letter
  return siteName.charAt(0).toUpperCase() + siteName.slice(1);
}

// Function to get site logo path
export function getSiteLogo() {
  // Check for custom logo environment variable
  if (process.env.NEXT_PUBLIC_CUSTOM_LOGO_PATH) {
    return process.env.NEXT_PUBLIC_CUSTOM_LOGO_PATH;
  }
  
  // Server-side: return default logo
  if (typeof window === 'undefined') {
    return '/zenova.png';
  }
  
  // Client-side: use domain-specific logic
  const hostname = window.location.hostname;
  
  // Domain-specific logos
  if (hostname.includes('zenova') || hostname.includes('CP TopUp')) {
    return '/zenova.png';
  }
  
  if (hostname.includes('leafstore')) {
    return '/leafstore-logo.png'; // This logo may not exist, will fallback to text
  }
  
  if (hostname.includes('cp-topup')) {
    return '/cplogo.jpeg'; // This logo may not exist, will fallback to text
  }
  
  // Add more domain-specific logos here
  // if (hostname.includes('yourdomain')) {
  //   return '/yourdomain-logo.png';
  // }
  
  return '/zenova.png'; // Default logo
}

// Function to get site configuration
export function getSiteConfig() {
  const siteName = getSiteNameFromDomain();
  
  return {
    name: siteName,
    logo: getSiteLogo(),
    title: `${siteName} - Gaming uc top up`,
    description: `Get instant diamonds, coins, and premium currency for your favorite games at unbeatable prices with our secure wallet system on ${siteName}.`,
  };
} 