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
      className={`flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer relative group bg-surface border-border ${
        isHovered ? 'transform -translate-y-3 shadow-primary border-primary' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {/* Game Image */}
      <div className={`flex-1 flex items-center justify-center bg-gradient-to-r ${game.gradient} text-6xl relative overflow-hidden`}>
        <div className="relative z-10">
          <img src='https://play-lh.googleusercontent.com/4y4Hob34qNkReHWoah36OV0F0oPI6N2eakOx5dsActLEHTMidJ2WMjSpC9kTqOuM3hY' alt="" />
        </div>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform transition-transform duration-500 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`}></div>
      </div>
      {/* Game Info */}
      <div className="p-2 flex flex-col gap-2 justify-between">
        <span className="text-sm text-text">
          {game.title}
        </span>
        <p className="text-xs leading-relaxed line-clamp-2 text-text opacity-70">
          {game.description}
        </p>
      </div>
    </div>
  )
}

export default GameCard