import React from 'react'

const feedData = [
  {
    id: 1,
    type: 'news',
    title: 'Valorant Patch 8.0 Released',
    description: 'New agents, maps, and balance changes are live! Check out what’s new in the latest update.',
    date: '2024-06-10',
    icon: '📰',
  },
  {
    id: 2,
    type: 'promotion',
    title: 'Double Diamonds Weekend!',
    description: 'Buy any Mobile Legends diamond pack and get 2x the value. Limited time only!',
    date: '2024-06-09',
    icon: '💎',
  },
  {
    id: 3,
    type: 'result',
    title: 'MLBB: Team Nova Wins Finals',
    description: 'Team Nova clinched the championship in a thrilling 3-2 series against Titans.',
    date: '2024-06-08',
    icon: '🏆',
  },
  {
    id: 4,
    type: 'activity',
    title: 'You purchased 1000 UC for PUBG Mobile',
    description: 'Order #123456 completed. Enjoy your new UC coins!',
    date: '2024-06-07',
    icon: '🛒',
  },
  {
    id: 5,
    type: 'news',
    title: 'Genshin Impact 4.0 Announced',
    description: 'A new region, characters, and events are coming soon. Stay tuned for more details!',
    date: '2024-06-06',
    icon: '🌟',
  },
]

const typeColors = {
  news: 'from-primary to-accent',
  promotion: 'from-secondary to-primary',
  result: 'from-accent to-secondary',
  activity: 'from-primary-dark to-accent',
}

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-bg py-10 px-2 md:px-0">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary shimmer">
          Latest Feed
        </h1>
        <div className="flex flex-col gap-6">
          {feedData.map(item => (
            <div
              key={item.id}
              className={`relative rounded-2xl border border-border bg-surface/80 backdrop-blur-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-1 group`}
            >
              {/* Gradient bar */}
              <div className={`absolute left-0 top-0 h-full w-2 bg-gradient-to-b ${typeColors[item.type]} group-hover:w-3 transition-all duration-300`}></div>
              <div className="flex items-start gap-4 p-5 md:p-6">
                <div className="text-3xl md:text-4xl flex-shrink-0 select-none">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">
                    <h2 className="text-lg md:text-xl font-semibold text-text mb-0.5">
                      {item.title}
                    </h2>
                    <span className="text-xs text-text-muted md:ml-4">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-text-muted text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
