"use client"
import { useEffect, useState } from 'react'
import Actions from './components/Actions'
import BottomNavbar from './components/BottomNavbar'
import GameCard from './components/GameCard'
import { apiClient } from './apiClient'
import AnimatedBackground from './components/AnimatedBackground'
import Bannner from './components/Bannner'
import BannerBottom from './components/BannerBottom'

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
    <div className="min-h-screen flex flex-col pb-24 relative bg-primary selection:bg-black selection:text-primary">
      {/* Top Banner Section */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 pt-6 mb-8">
        <Bannner />
      </div>

      {/* Quick Actions Section */}
      <div className="mb-4">
        <Actions />
      </div>
      
      {/* Games Section */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Modern Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-black rounded-full"></div>
              <h2 className="text-3xl lg:text-4xl font-black text-black tracking-tight uppercase">
                Trending Games
              </h2>
            </div>
            <p className="text-black/60 font-bold text-sm lg:text-base uppercase tracking-widest">
              Instant Top-up • Best Rates • 24/7 Delivery
            </p>
          </div>
          
          {/* Games Count - Hidden on small mobile */}
          <div className="hidden sm:block">
            <div className="bg-black text-primary px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              {games.length} Games Available
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-5">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="w-full  bg-black/5 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-md mx-auto my-12">
            <div className="w-16 h-16 bg-red-100 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-black mb-2 uppercase">Oops! Something went wrong</h3>
            <p className="text-gray-600 font-medium mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-black text-primary rounded-xl font-black uppercase tracking-widest hover:translate-y-[-2px] transition-transform active:translate-y-0"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Games Grid */}
        {!loading && !error && games.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-5">
            {games.map((game, idx) => (
              <div key={game._id || idx} className="w-full">
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
          <div className="text-center py-20 bg-white/30 rounded-3xl border-4 border-dashed border-black/10">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tight">No Games Found</h3>
            <p className="text-black/50 font-bold uppercase text-sm tracking-widest">We're updating our catalog. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Bottom Features/Banner */}
      <div className="mt-16 w-full max-w-7xl mx-auto px-4">
        <BannerBottom />
      </div>

      <BottomNavbar />
    </div>
  )
} 