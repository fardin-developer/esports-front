"use client"
import { useEffect, useState } from 'react'
import Actions from '../components/Actions'
import BottomNavbar from '../components/BottomNavbar'
import GameCard from '../components/GameCard'
import { apiClient } from '../apiClient'

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
    <div className="min-h-screen flex flex-col pb-24 relative pt-6 bg-[var(--color-bg)] w-full lg:p-20 mx-auto">
      <Actions />
      <div className="px-4 mb-2">
        <div className="text-[var(--color-text)] text-base font-medium mb-1">All Games</div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full px-2">
        {games.map((game, idx) => (
          <div key={game._id || idx}>
            {game.name ? <GameCard game={{ title: game.name, img: game.image, description: game.publisher }} gameId={game._id} /> : ''}
          </div>
        ))}
      </div>
      <BottomNavbar />
    </div>
  )
} 