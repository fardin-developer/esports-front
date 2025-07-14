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
      gradient: 'from-primary to-accent'
    },
    {
      id: 2,
      title: 'PUBG Mobile',
      description: 'Get UC coins for PUBG Mobile instantly',
      emoji: '🎯',
      price: 1.99,
      gradient: 'from-secondary to-primary'
    },
    {
      id: 3,
      title: 'Genshin Impact',
      description: 'Purchase Genesis Crystals with huge discounts',
      emoji: '⚡',
      price: 4.99,
      gradient: 'from-accent to-primary-dark'
    },
    {
      id: 4,
      title: 'Honor of Kings',
      description: 'Buy tokens and premium items',
      emoji: '🏆',
      price: 2.99,
      gradient: 'from-secondary to-accent'
    },
    {
      id: 5,
      title: 'Valorant',
      description: 'Get VP points for Valorant skins and agents',
      emoji: '🎮',
      price: 9.99,
      gradient: 'from-primary-dark to-accent'
    },
    {
      id: 6,
      title: 'Honkai Star Rail',
      description: 'Purchase Stellar Jade and Oneiric Shards',
      emoji: '🎲',
      price: 0.99,
      gradient: 'from-accent to-secondary'
    }
  ]

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto relative z-10">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-primary">
        Popular Games
      </h2>
      
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}

export default GamesSection