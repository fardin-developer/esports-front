import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar.jsx'
import ClientProvider from './ClientProvider'
import BottomNavbar from "./components/BottomNavbar";
import Footer from "./components/Footer";
// import DeveloperProtection from './components/DeveloperProtection.jsx';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getSiteNameFromDomain } from './utils/siteConfig';

export async function generateMetadata({ params, searchParams }, parent) {
  // For server-side, we need to use headers to get the domain
  const headers = await import('next/headers');
  let siteName = 'Zennova'; // Default fallback
  
  try {
    const headersList = await headers.headers();
    const host = headersList.get('host');
    
    if (host) {
      // Extract site name from host
      const hostname = host.split(':')[0]; // Remove port if present
      
      // Handle localhost and development
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('vercel.app')) {
        siteName = 'Zennova';
      } else {
        // Remove www. and common TLDs
        const extractedName = hostname
          .replace(/^www\./, '')
          .replace(/\.(com|in|org|net|co\.in|co\.uk|io|dev|app)$/, '')
          .split('.')[0];
        
        // Handle special cases
        const specialCases = {
          'zenova': 'Zenova',
          'zennova': 'Zennova',
          'leafstore': 'LeafStore',
          'gaming': 'Gaming Platform',
          'topup': 'TopUp Platform',
          'uc': 'UC Platform'
        };
        
        const lowerName = extractedName.toLowerCase();
        siteName = specialCases[lowerName] || extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      }
    }
  } catch (error) {
    // Fallback if headers are not available
    siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Zennova';
  }
  
  return {
    title: `${siteName} - Gaming uc top up`,
    description: `Get instant diamonds, coins, and premium currency for your favorite games at unbeatable prices with our secure wallet system on ${siteName}.`,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} pt-20`}>
        <ClientProvider>
          {/* <DeveloperProtection> */}
            <Navbar />
            {children}
            <BottomNavbar/>
            <Footer/>
          {/* </DeveloperProtection> */}
        </ClientProvider>
      </body>
    </html>
  );
}