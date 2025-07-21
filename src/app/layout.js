import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar.jsx'
import ClientProvider from './ClientProvider'
import BottomNavbar from "./components/BottomNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zennova - Premium Gaming Currency",
  description: "Get instant diamonds, coins, and premium currency for your favorite games at unbeatable prices with our secure wallet system.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="pt-20">
        <ClientProvider>
          <Navbar />
          {children}
          <BottomNavbar/>
        </ClientProvider>
      </body>
    </html>
  );
}
