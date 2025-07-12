"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { apiClient } from '../../apiClient'
import BottomNavbar from '../../components/BottomNavbar'

export default function GameDiamondPacksPage() {
  const [diamondPacks, setDiamondPacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [gameInfo, setGameInfo] = useState(null)
  const params = useParams()
  const gameId = params.gameId

  useEffect(() => {
    async function fetchDiamondPacks() {
      try {
        setLoading(true)
        const data = await apiClient.get(`/games/${gameId}/diamond-packs`)
        if (data.success && Array.isArray(data.diamondPacks)) {
          setDiamondPacks(data.diamondPacks)
        }
      } catch (err) {
        console.error('Failed to fetch diamond packs:', err)
      } finally {
        setLoading(false)
      }
    }

    if (gameId) {
      fetchDiamondPacks()
    }
  }, [gameId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-[var(--color-text)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col pb-24 relative pt-6 bg-[var(--color-bg)] w-full lg:w-5/6 mx-auto">
      {/* Header */}
      <div className="px-4 mb-6">
        <div className="text-[var(--color-text)] text-2xl font-bold mb-2">Diamond Packs</div>
        <div className="text-gray-400 text-sm">Choose your diamond pack</div>
      </div>

      {/* Diamond Packs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {diamondPacks.map((pack) => (
          <div
            key={pack._id}
            className="bg-[rgba(255,255,255,0.05)] rounded-2xl p-6 border border-[rgba(100,255,218,0.1)] hover:border-[rgba(100,255,218,0.3)] transition-all duration-300 cursor-pointer"
          >
            {/* Pack Logo */}
            <div className="flex justify-center mb-4">
              <img 
                src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*cl5528JBPb6Gg5o8yOLUZA.jpeg" 
                alt="Pack Logo" 
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64x64/64ffda/000000?text=D'
                }}
              />
            </div>

            {/* Pack Details */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#64ffda] mb-2">
                {pack.amount} Diamonds
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {pack.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[rgba(100,255,218,0.1)] rounded-lg p-2">
                  <div className="text-[#64ffda] font-semibold">{pack.commission}%</div>
                  <div className="text-gray-400">Commission</div>
                </div>
                <div className="bg-[rgba(100,255,218,0.1)] rounded-lg p-2">
                  <div className="text-[#64ffda] font-semibold">{pack.cashback}%</div>
                  <div className="text-gray-400">Cashback</div>
                </div>
              </div>

              {/* Buy Button */}
              <button className="w-full mt-4 bg-gradient-to-r from-[#64ffda] to-[#00b894] text-black font-semibold py-2 px-4 rounded-lg hover:from-[#00b894] hover:to-[#64ffda] transition-all duration-300">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {diamondPacks.length === 0 && !loading && (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-2">No diamond packs available</div>
            <div className="text-sm">Check back later for new packs</div>
          </div>
        </div>
      )}

      <BottomNavbar />
    </div>
  )
} 