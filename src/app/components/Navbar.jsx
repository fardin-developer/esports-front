'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoginModal from './LoginModal'
import { useSelector, useDispatch } from 'react-redux'
import { logout, rehydrateAuth } from '../features/auth/authSlice'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [balance, setBalance] = useState(0.00)
  // Redux state
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const userMobile = useSelector((state) => state.auth.userMobile)
  const hydrated = useSelector((state) => state.auth.hydrated)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth')
      if (stored) {
        dispatch(rehydrateAuth(JSON.parse(stored)))
      } else {
        dispatch(rehydrateAuth(null))
      }
    }
  }, [dispatch])

  if (!hydrated) return null // or a spinner

  // Handle successful login
  const handleLoginSuccess = (mobileNumber) => {
    setIsLoggedIn(true)
    setUserMobile(mobileNumber)
    setBalance(1250.75) // Set initial balance or fetch from API
    setIsLoginOpen(false)
  }

  // Handle logout
  const handleLogout = () => {
    dispatch(logout())
    setBalance(0.00)
  }

  const navItems = [
    { name: 'Home', href: '/home' },
    { name: 'Games', href: '/games' },
    { name: 'Wallet', href: '/wallet' },
    { name: 'Support', href: '/support' },
    { name: 'About', href: '/about' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled
            ? 'bg-[rgba(15,15,35,0.98)] backdrop-blur-xl shadow-lg shadow-[rgba(100,255,218,0.1)]'
            : 'bg-[rgba(15,15,35,0.95)] backdrop-blur-lg'
          } border-b border-[rgba(100,255,218,0.12)]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold shimmer hover:scale-105 transition-transform duration-300 flex items-center space-x-2"
            >
              <span className="text-[19px]">⚡</span>
              <span className="bg-gradient-to-r from-[#64ffda] to-[#00bcd4] bg-clip-text text-transparent text-[19px]">
                GameVault
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white/90 hover:text-[#64ffda] transition-all duration-300 relative group px-4 py-2 rounded-lg hover:bg-[rgba(100,255,218,0.05)] text-sm font-medium"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#64ffda] to-[#00bcd4] transition-all duration-300 group-hover:w-8 rounded-full"></span>
                </Link>
              ))}
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              {/* Wallet Balance - Show only when logged in on desktop */}
              {isLoggedIn && (
                <div className="hidden sm:flex items-center space-x-2 bg-[rgba(100,255,218,0.08)] px-4 py-2.5 rounded-full border border-[rgba(100,255,218,0.2)] hover:border-[rgba(100,255,218,0.4)] transition-all duration-300">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#ffd700] to-[#ffb300] rounded-full flex items-center justify-center text-xs shadow-sm">
                    💰
                  </div>
                  <span className="text-sm font-semibold text-white/95">
                    ${balance.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Auth Buttons */}
              <div className="flex items-center space-x-2">
                {!isLoggedIn ? (
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-5 py-2.5 text-sm font-medium text-[#64ffda] border-2 border-[#64ffda] rounded-full hover:bg-[rgba(100,255,218,0.1)] hover:shadow-md hover:shadow-[rgba(100,255,218,0.2)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Login
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    {/* Mobile Wallet Balance - Show on mobile when logged in */}
                    <div className="sm:hidden flex items-center space-x-2 bg-[rgba(100,255,218,0.08)] px-3 py-2 rounded-full border border-[rgba(100,255,218,0.2)]">
                      <div className="w-5 h-5 bg-gradient-to-r from-[#ffd700] to-[#ffb300] rounded-full flex items-center justify-center text-xs">
                        💰
                      </div>
                      <span className="text-xs font-semibold text-white/95">
                        ${balance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              {!isLoggedIn ? <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-[rgba(100,255,218,0.1)] transition-colors duration-300"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <span className={`block w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button> : ''

              }

            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-out ${isMobileMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0'
          } overflow-hidden bg-[rgba(15,15,35,0.98)] backdrop-blur-xl border-t border-[rgba(100,255,218,0.12)]`}>
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-white/90 hover:text-[#64ffda] transition-all duration-300 text-lg font-medium py-2 px-4 rounded-lg hover:bg-[rgba(100,255,218,0.08)] transform ${isMobileMenuOpen
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-4 opacity-0'
                  }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Menu User Section */}
            {isLoggedIn && (
              <div className="border-t border-[rgba(100,255,218,0.12)] pt-4 mt-6">
                <div className="flex items-center space-x-3 px-4 py-3 bg-[rgba(100,255,218,0.08)] rounded-lg border border-[rgba(100,255,218,0.2)]">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#64ffda] to-[#00bcd4] rounded-full flex items-center justify-center text-xs font-bold text-[#0f0f23]">
                    {userMobile.slice(-2)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white/95">{userMobile}</div>
                    <div className="text-xs text-white/70">Balance: ${balance.toFixed(1)}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[rgba(255,0,0,0.05)] rounded-lg transition-colors text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </>
  )
}

export default Navbar