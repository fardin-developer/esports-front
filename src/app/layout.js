import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar.jsx'
import ClientProvider from './ClientProvider'
import BottomNavbar from "./components/BottomNavbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getSiteNameFromDomain } from './utils/siteConfig';

export async function generateMetadata() {
  // For server-side, use environment variable or fallback
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Gaming Platform';
  
  return {
    title: `${siteName} - Gaming uc top up`,
    description: `Get instant diamonds, coins, and premium currency for your favorite games at unbeatable prices with our secure wallet system on ${siteName}.`,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="pt-20">
        <ClientProvider>
          <Navbar />
          {children}
          <BottomNavbar/>
          <Footer/>
        </ClientProvider>
      </body>
    </html>
  );
}
