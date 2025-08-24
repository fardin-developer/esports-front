'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'

const BannerBottom = () => {
  const features = [
    {
      title: "Fast Delivery",
      description: "Get your items instantly",
      icon: "⚡"
    },
    {
      title: "24/7 Support",
      description: "We're always here to help",
      icon: "🛡️"
    },
    {
      title: "Secure Payment",
      description: "100% secure transactions",
      icon: "💳"
    },
    {
      title: "Best Prices",
      description: "Guaranteed best deals",
      icon: "💰"
    }
  ]

  return (
    <div className="relative overflow-hidden mx-4 mb-8 rounded-2xl">
      {/* Single Card with Gradient */}
      <div className="bg-gradient-to-r from-black via-gray-800 to-gray-600 p-4 sm:p-8 rounded-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-evenly gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group flex flex-col items-center text-center p-2 sm:p-3 w-full sm:min-w-[150px] sm:max-w-[200px]">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300 hover:bg-white/20">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{feature.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BannerBottom
