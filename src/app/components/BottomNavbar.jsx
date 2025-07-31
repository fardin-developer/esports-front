'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BottomNavbar = ({ balance, userMobile }) => {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Support',
      href: '/support',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      name: 'Feed',
      href: '/feed',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ]

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="relative mx-4">
          <div className="relative bg-zinc-900/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-zinc-800/50">
            <div className="px-5 py-3">
              <div className="flex items-center justify-around">
                {navItems.map((item) => (
                  <div key={item.name} className="flex flex-col items-center justify-center py-1.5 px-2">
                    <div className="text-zinc-500">
                      {item.icon}
                    </div>
                    <span className="text-[9px] font-medium text-zinc-500 mt-1">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-2"></div>
      </div>
    )
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="relative mx-4">
        {/* Main Navigation Container with Perfect Curves */}
        <div className="relative bg-zinc-900/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-zinc-800/50">
          {/* Navigation Content */}
          <div className="px-5 py-3">
            <div className="flex items-center justify-around">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative flex flex-col items-center justify-center group"
                  >
                    {/* Active Floating Indicator */}
                    {isActive && (
                      <>
                        {/* Floating Background */}
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-zinc-800 rounded-xl shadow-xl flex items-center justify-center border border-zinc-700">
                          <div className="text-blue-400">
                            {item.icon}
                          </div>
                        </div>
                        {/* Connection Line */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-zinc-700 rounded-full"></div>
                      </>
                    )}
                    
                    {/* Regular State */}
                    {!isActive && (
                      <div className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 hover:bg-zinc-800/50">
                        <div className="text-zinc-500 group-hover:text-zinc-300 transition-all duration-200 group-hover:scale-105">
                          {item.icon}
                        </div>
                        <span className="text-[9px] font-medium text-zinc-500 group-hover:text-zinc-300 mt-1 transition-all duration-200">
                          {item.name}
                        </span>
                      </div>
                    )}
                    
                    {/* Active Label */}
                    {isActive && (
                      <div className="flex flex-col items-center mt-1">
                        <span className="text-[9px] font-semibold text-blue-400">
                          {item.name}
                        </span>
                        <div className="w-0.5 h-0.5 bg-blue-400 rounded-full mt-0.5 opacity-80"></div>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Safe Area */}
      <div className="h-2"></div>
    </div>
  )
}

export default BottomNavbar