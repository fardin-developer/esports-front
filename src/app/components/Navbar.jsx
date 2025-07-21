'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoginModal from './LoginModal'
import { useSelector, useDispatch } from 'react-redux'
import { logout, rehydrateAuth, fetchWalletBalance } from '../features/auth/authSlice'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Redux state
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const userMobile = useSelector((state) => state.auth.userMobile)
  const hydrated = useSelector((state) => state.auth.hydrated)
  const balance = useSelector((state) => state.auth.balance)
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

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchWalletBalance())
    }
  }, [dispatch, isLoggedIn])

  if (!hydrated) return null // or a spinner

  // Handle successful login
  const handleLoginSuccess = (mobileNumber) => {
    setIsLoggedIn(true)
    setUserMobile(mobileNumber)
    setIsLoginOpen(false)
  }

  // Handle logout
  const handleLogout = () => {
    dispatch(logout())
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
            ? 'bg-surface/95 backdrop-blur-xl shadow-lg shadow-primary/10'
            : 'bg-surface/90 backdrop-blur-lg'
          } border-b border-primary/10`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold shimmer hover:scale-105 transition-transform duration-300 flex items-center space-x-2"
            >
              <img className='w-24' src="/zenova.png" alt="Zennova Logo" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-text/90 hover:text-primary transition-all duration-300 relative group px-4 py-2 rounded-lg hover:bg-primary/5 text-sm font-medium"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-8 rounded-full"></span>
                </Link>
              ))}
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              {/* Wallet Balance - Show only when logged in on desktop */}
              {isLoggedIn && (
                <div className="hidden sm:flex items-center space-x-2 bg-secondary/10 px-4 py-2.5 rounded-full border border-secondary/30 hover:border-secondary/50 transition-all duration-300">
                  <div className="w-6 h-6 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center text-xs shadow-sm">
                    💰
                  </div>
                  <span className="text-sm font-semibold text-text">
                    ${balance.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Auth Buttons */}
              <div className="flex items-center space-x-2">
                {!isLoggedIn ? (
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-5 py-2.5 text-sm font-medium text-primary border-2 border-primary rounded-full hover:bg-primary/10 hover:shadow-md hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Login
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    {/* Mobile Wallet Balance - Show on mobile when logged in */}
                    <div className="sm:hidden flex items-center space-x-2 bg-secondary/10 px-3 py-2 rounded-full border border-secondary/30">
                      <div className="w-5 h-5 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center text-xs">
                        💰
                      </div>
                      <span className="text-xs font-semibold text-text">
                        ${balance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              {!isLoggedIn ? <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors duration-300"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <span className={`block w-full h-0.5 bg-text transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block w-full h-0.5 bg-text transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-full h-0.5 bg-text transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
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
          } overflow-hidden bg-surface/95 backdrop-blur-xl border-t border-primary/10`}>
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-text/90 hover:text-primary transition-all duration-300 text-lg font-medium py-2 px-4 rounded-lg hover:bg-primary/10 transform ${isMobileMenuOpen
                  ? 'translate-y-0 opacity-100'
                  : '-translate-y-4 opacity-0'
                  }`}
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn && (
              <div className="mt-6">
                <div className="flex items-center space-x-2 bg-secondary/10 px-3 py-2 rounded-full border border-secondary/30">
                  <div className="w-5 h-5 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center text-xs">
                    💰
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text">{userMobile}</div>
                    <div className="text-xs text-text-muted">Balance: ${balance.toFixed(1)}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 px-4 py-2 text-sm text-error hover:text-error/80 hover:bg-error/10 rounded-lg transition-colors text-left"
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