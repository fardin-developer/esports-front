// src/components/GameCard.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const GameCard = ({ game, gameId }) => {
  const router = useRouter()

  const handleCardClick = () => {
    if (gameId) {
      router.push(`/game/${gameId}`)
    }
  }

  return (
    <div
      className="group relative flex flex-col w-full h-full cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Neubrutalism Card */}
      <div className="relative h-full flex flex-col bg-white border-[2.5px] border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group-hover:translate-x-px group-hover:translate-y-px group-hover:shadow-none">
        
        {/* Game Image Wrapper */}
        <div className="aspect-square relative bg-black/5 overflow-hidden border-b-[2.5px] border-black">
          <img
            src={game.img}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Action Overlay */}
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-black text-primary px-2 py-1 rounded-lg font-black text-[9px] uppercase tracking-[0.15em]">
              Top Up
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="p-2 flex flex-col justify-center flex-1 bg-white min-h-[44px]">
          <h3 className="text-[12px] md:text-[14px] font-black text-black uppercase leading-[1.2] line-clamp-2 group-hover:text-primary-dark transition-colors">
            {game.title}
          </h3>
          <div className="mt-0.5 flex items-center justify-between">
            <span className="text-[8px] md:text-[9px] font-bold text-black/40 uppercase tracking-tight line-clamp-1">
              {game.description || 'Action'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameCard