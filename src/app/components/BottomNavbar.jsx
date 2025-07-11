'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BottomNavbar = ({ balance, userMobile }) => {
  const pathname = usePathname()
  
  const navItems = [
    {
      name: 'Wallet',
      href: '/wallet',
      icon: '💰',
      activeIcon: '💰'
    },
    {
      name: 'Games',
      href: '/games',
      icon: '🎮',
      activeIcon: '🎮'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: '👤',
      activeIcon: '👤'
    },
    {
      name: 'Support',
      href: '/support',
      icon: '💬',
      activeIcon: '💬'
    }
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
              <span className="text-lg">{isActive ? item.activeIcon : item.icon}</span>
              <span className="text-xs font-medium">{item.name}</span>
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