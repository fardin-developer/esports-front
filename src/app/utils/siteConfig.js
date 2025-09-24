// Function to get site name from domain
export function getSiteNameFromDomain() {
  // Check for environment variable first
  if (process.env.NEXT_PUBLIC_SITE_NAME) {
    console.log(process.env.NEXT_PUBLIC_SITE_NAME);
    
    return process.env.NEXT_PUBLIC_SITE_NAME;
  }

  // Server-side: always return default to prevent hydration mismatch
  if (typeof window === 'undefined') {
    return 'Zennova';
  }

  // Client-side: use actual hostname
  const hostname = window.location.hostname;
  console.log("hostname", hostname);
  
  
  // Handle localhost and development
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('vercel.app')) {
    return 'Zennova';
  }
  
  // Remove www. and common TLDs
  const siteName = hostname
    .replace(/^www\./, '')
    .replace(/\.(com|in|org|net|co\.in|co\.uk|io|dev|app)$/, '')
    .split('.')[0];
  
  // Handle special cases and capitalize
  const specialCases = {
    'zenova': 'Zenova',
    'zennova': 'Zennova',
    'nexusofficialstore': 'Nexus Official Store',
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
  if (hostname.includes('zenova') || hostname.includes('zennova')) {
    return '/zenova.png';
  }
  
  if (hostname.includes('nexusofficialstore')) {
    return ''; // This logo may not exist, will fallback to text
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

// Function to get logo style configuration
export function getLogoStyle() {
  // Check for custom logo style environment variable
  if (process.env.NEXT_PUBLIC_LOGO_STYLE) {
    return process.env.NEXT_PUBLIC_LOGO_STYLE;
  }
  
  // Server-side: return default style
  if (typeof window === 'undefined') {
    return 'default';
  }
  
  // Client-side: use domain-specific logic
  const hostname = window.location.hostname;
  
  // Domain-specific logo styles
  if (hostname.includes('zenova') || hostname.includes('zennova')) {
    return 'default';
  }
  
  if (hostname.includes('nexusofficialstore')) {
    return 'yellow';
  }
  
  if (hostname.includes('leafstore')) {
    return 'green';
  }
  
  if (hostname.includes('cp-topup')) {
    return 'yellow';
  }
  
  // Add more domain-specific styles here
  // if (hostname.includes('yourdomain')) {
  //   return 'your-theme';
  // }
  
  return 'default'; // Default style
}

// Function to get theme colors based on logo style
export function getThemeColors(style = 'default') {
  const themes = {
    default: {
      primary: 'from-primary to-accent',
      secondary: 'from-secondary to-accent',
      text: 'text-primary',
      background: 'bg-primary/10',
      border: 'border-primary/30'
    },
    yellow: {
      primary: 'from-yellow-400 to-yellow-600',
      secondary: 'from-yellow-300 to-yellow-500',
      text: 'text-yellow-500',
      background: 'bg-yellow-100/20',
      border: 'border-yellow-300/30'
    },
    green: {
      primary: 'from-green-400 to-green-600',
      secondary: 'from-green-300 to-green-500',
      text: 'text-green-500',
      background: 'bg-green-100/20',
      border: 'border-green-300/30'
    },
    blue: {
      primary: 'from-blue-400 to-blue-600',
      secondary: 'from-blue-300 to-blue-500',
      text: 'text-blue-500',
      background: 'bg-blue-100/20',
      border: 'border-blue-300/30'
    },
    purple: {
      primary: 'from-purple-400 to-purple-600',
      secondary: 'from-purple-300 to-purple-500',
      text: 'text-purple-500',
      background: 'bg-purple-100/20',
      border: 'border-purple-300/30'
    }
  };
  
  return themes[style] || themes.default;
}

// Function to get site configuration
export function getSiteConfig() {
  const siteName = getSiteNameFromDomain();
  const logoStyle = getLogoStyle();
  const themeColors = getThemeColors(logoStyle);
  
  return {
    name: siteName,
    logo: getSiteLogo(),
    style: logoStyle,
    theme: themeColors,
    title: `${siteName} - Gaming uc top up`,
    description: `Get instant diamonds, coins, and premium currency for your favorite games at unbeatable prices with our secure wallet system on ${siteName}.`,
  };
} 