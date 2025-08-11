"use client"
import { useEffect, useState } from 'react'
import Actions from './components/Actions'
import BottomNavbar from './components/BottomNavbar'
import GameCard from './components/GameCard'
import { apiClient } from './apiClient'
import AnimatedBackground from './components/AnimatedBackground'
import Bannner from './components/Bannner'

export default function HomePage() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true)
        setError(null)
        const data = await apiClient.get('/games/get-all')
        if (data.success && Array.isArray(data.games)) {
          setGames(data.games)
        } else {
          setError('Failed to load games')
        }
      } catch (err) {
        console.error('Failed to fetch games:', err)
        setError('Failed to load games')
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  return (
    <div className="min-h-screen flex flex-col pb-24 relative pt-6 w-full lg:p-20 mx-auto bg-[#F2CB05]">
      {/* <AnimatedBackground /> */}
      <Bannner/>
      <Actions />
      
      {/* Professional Games Section */}
      <section className="px-4 lg:px-6 mb-8">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-black">
              All Games
            </h2>
          </div>
          <p className="text-gray-900 text-sm lg:text-base max-w-2xl">
            Discover and top up your favorite games with instant delivery and competitive prices
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 md:gap-4 lg:gap-5">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="w-full aspect-[3/4] bg-white/10 rounded-xl animate-pulse">
                <div className="w-full h-full bg-white/20 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Games</h3>
            <p className="text-white/70 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Games Grid */}
        {!loading && !error && games.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 md:gap-4 lg:gap-5">
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
        )}

        {/* Empty State */}
        {!loading && !error && games.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Games Available</h3>
            <p className="text-white/70">Check back later for new games</p>
          </div>
        )}

        {/* Games Count */}
        {!loading && !error && games.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-900 text-sm">
              Showing {games.length} game{games.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </section>
      
      <BottomNavbar />
    </div>
  )
} 