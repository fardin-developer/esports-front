'use client'
import GameCard from './GameCard'

const GamesSection = () => {
  const games = [
    {
      id: 1,
      title: 'Mobile Legends',
      description: 'Buy diamonds for Mobile Legends at the best prices',
      emoji: '🗡️',
      price: 0.99,
      gradient: 'from-[#ff6b6b] to-[#4ecdc4]'
    },
    {
      id: 2,
      title: 'PUBG Mobile',
      description: 'Get UC coins for PUBG Mobile instantly',
      emoji: '🎯',
      price: 1.99,
      gradient: 'from-[#ffd93d] to-[#ff6b6b]'
    },
    {
      id: 3,
      title: 'Genshin Impact',
      description: 'Purchase Genesis Crystals with huge discounts',
      emoji: '⚡',
      price: 4.99,
      gradient: 'from-[#74b9ff] to-[#0984e3]'
    },
    {
      id: 4,
      title: 'Honor of Kings',
      description: 'Buy tokens and premium items',
      emoji: '🏆',
      price: 2.99,
      gradient: 'from-[#fdcb6e] to-[#e17055]'
    },
    {
      id: 5,
      title: 'Valorant',
      description: 'Get VP points for Valorant skins and agents',
      emoji: '🎮',
      price: 9.99,
      gradient: 'from-[#ff7675] to-[#d63031]'
    },
    {
      id: 6,
      title: 'Honkai Star Rail',
      description: 'Purchase Stellar Jade and Oneiric Shards',
      emoji: '🎲',
      price: 0.99,
      gradient: 'from-[#a29bfe] to-[#6c5ce7]'
    }
  ]

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto relative z-10">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-[#64ffda]">
        Popular Games
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}

export default GamesSection