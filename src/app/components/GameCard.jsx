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
      className={`flex flex-col w-full h-full rounded-xl md:rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer relative group bg-surface border-border ${isHovered ? 'transform -translate-y-2 md:-translate-y-3 shadow-lg md:shadow-primary border-primary' : ''
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Game Image - Responsive aspect ratio */}
      <div className={`aspect-[3/4] sm:aspect-square md:aspect-[4/5] bg-gradient-to-r ${game.gradient || 'from-blue-500 to-purple-600'} relative overflow-hidden`}>
        <div className="relative z-10 w-full h-full">
          <img
            src={game.img}
            alt={game.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform transition-transform duration-500 ${isHovered ? 'translate-x-full' : '-translate-x-full'
          }`}></div>
      </div>

      {/* Game Info - Responsive padding and text */}
      <div className="p-2 sm:p-3 md:p-4 flex flex-col gap-1 md:gap-2 justify-between flex-shrink-0 min-h-[50px] sm:min-h-[60px] md:min-h-[70px] lg:min-h-[80px]">
        <span className="text-xs sm:text-sm md:text-base font-medium text-text line-clamp-1 sm:line-clamp-2 leading-tight">
          {game.title}
        </span>
        <p className="text-xs sm:text-xs md:text-sm leading-relaxed line-clamp-1 sm:line-clamp-2 text-text opacity-70 sm:block">
          {game.description}
        </p>
      </div>
    </div>
  )
}

export default GameCard