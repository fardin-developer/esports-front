// src/components/GameCard.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const GameCard = ({ game, gameId }) => {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleCardClick = () => {
    if (gameId) {
      router.push(`/game/${gameId}`)
    }
  }

  return (
    <div
      className={`aspect-[3/4] flex flex-col bg-[rgba(255,255,255,0.05)] rounded-2xl overflow-hidden border border-[rgba(100,255,218,0.1)] transition-all duration-300 cursor-pointer relative group ${
        isHovered ? 'transform -translate-y-3 shadow-2xl shadow-[rgba(100,255,218,0.2)] border-[rgba(100,255,218,0.3)]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(100,255,218,0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      {/* Game Image */}
      <div className={`flex-1 flex items-center justify-center bg-gradient-to-r ${game.gradient} text-6xl relative overflow-hidden`}>
        <div className="relative z-10">
          <img src={game.img} alt="" />
        </div>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent transform transition-transform duration-500 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`}></div>
      </div>
      {/* Game Info */}
      <div className="p-4 flex flex-col gap-2 justify-between min-h-[120px]">
        <h3 className="text-lg font-semibold text-[#64ffda]">
          {game.title}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
          {game.description}
        </p>
      </div>
    </div>
  )
}

export default GameCard