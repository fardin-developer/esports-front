"use client"
import { useEffect, useState } from 'react'
import Actions from './components/Actions'
import BottomNavbar from './components/BottomNavbar'
import GameCard from './components/GameCard'
import { apiClient } from './apiClient'
import AnimatedBackground from './components/AnimatedBackground'

export default function HomePage() {
  const [games, setGames] = useState([])

  useEffect(() => {
    async function fetchGames() {
      try {
        const data = await apiClient.get('/games/get-all')
        if (data.success && Array.isArray(data.games)) {
          setGames(data.games)
        }
      } catch (err) {
        console.error('Failed to fetch games:', err)
      }
    }
    fetchGames()
  }, [])

  return (
    <div className="min-h-screen flex flex-col pb-24 relative pt-6 w-full lg:p-20 mx-auto">
      {/* <AnimatedBackground /> */}
      <Actions />
      <div className="px-4 mb-2">
        <div className="text-[var(--color-text)] text-2xl font-medium mb-1">All Games</div>
      </div>
      
      {/* Responsive Grid Container */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4 lg:gap-5 w-full px-4">
        {games.map((game, idx) => (
          <div key={game._id || idx} className="w-full aspect-[3/4]">
            {game.name ? (
              <GameCard 
                game={{ 
                  title: game.name, 
                  img: game.image, 
                  description: game.publisher 
                }} 
                gameId={game._id} 
              />
            ) : null}
          </div>
        ))}
      </div>
      
      <BottomNavbar />
    </div>
  )
} 