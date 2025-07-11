'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BottomNavbar = ({ balance, userMobile }) => {
  const pathname = usePathname()
  
  const navItems = [
    {
      name: 'Home',
      href: '/home',
      icon: 'public/home2.png',
      activeIcon: 'public/home2.png'
    },
    {
      name: 'Search',
      href: '/search',
      icon: 'public/search-white.png',
      activeIcon: 'public/search-white.png'
    },
   
    {
      name: 'Support',
      href: '/support',
      icon: 'public/chat-white.png',
      activeIcon: 'public/chat-white.png'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: 'public/profile-white.png',
      activeIcon: 'public/profile-white.png'
    },
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[rgba(15,15,35,0.98)] backdrop-blur-xl border-t border-[rgba(100,255,218,0.12)] shadow-lg shadow-[rgba(100,255,218,0.1)]">


      {/* Navigation Tabs */}
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'text-[#64ffda] bg-[rgba(100,255,218,0.1)]'
                  : 'text-white/70 hover:text-white/90 hover:bg-[rgba(100,255,218,0.05)]'
              }`}
            >
              <span className="text-lg">
                {typeof (isActive ? item.activeIcon : item.icon) === 'string' && (isActive ? item.activeIcon : item.icon).match(/\.(png|svg|jpg|jpeg|gif)$/i)
                  ? (
                    <img
                      src={`/${(isActive ? item.activeIcon : item.icon).replace(/^public\//, '')}`}
                      alt={item.name}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    isActive ? item.activeIcon : item.icon
                  )}
              </span>
              {/* <span className="text-xs font-medium">{item.name}</span> */}
              {isActive && (
                <div className="w-1 h-1 bg-[#64ffda] rounded-full"></div>
              )}
            </Link>
          )
        })}
      </div>

      {/* Safe Area for devices with home indicator */}
      <div className="h-1 bg-[rgba(15,15,35,0.98)]"></div>
    </div>
  )
}

export default BottomNavbar