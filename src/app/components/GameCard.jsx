// src/components/GameCard.jsx
'use client'
import { useState } from 'react'

const GameCard = ({ game }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleBuyNow = () => {
    // Handle purchase logic here
    alert(`Purchasing ${game.title}...`)
  }

  return (
    <div
      className={`bg-[rgba(255,255,255,0.05)] rounded-2xl overflow-hidden border border-[rgba(100,255,218,0.1)] transition-all duration-300 cursor-pointer relative group ${
        isHovered ? 'transform -translate-y-3 shadow-2xl shadow-[rgba(100,255,218,0.2)] border-[rgba(100,255,218,0.3)]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(100,255,218,0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Game Image */}
      <div className={`h-48 bg-gradient-to-r ${game.gradient} flex items-center justify-center text-6xl relative overflow-hidden`}>
        <div className="relative z-10">{game.emoji}</div>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent transform transition-transform duration-500 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`}></div>
      </div>
      
      {/* Game Info */}
      <div className="p-6 relative z-10">
        <h3 className="text-xl font-semibold mb-2 text-[#64ffda]">
          {game.title}
        </h3>
        <p className="text-gray-400 mb-4 text-sm leading-relaxed">
          {game.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="bg-gradient-to-r from-[#ffd700] to-[#ffb300] text-[#0f0f23] px-3 py-1 rounded-xl font-semibold text-sm">
            From ${game.price}
          </div>
          <button
            onClick={handleBuyNow}
            className="bg-gradient-to-r from-[#64ffda] to-[#00bcd4] text-[#0f0f23] px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-lg hover:shadow-[rgba(100,255,218,0.3)] transition-all duration-300"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameCard