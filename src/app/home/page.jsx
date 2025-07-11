import BottomNavbar from '../components/BottomNavbar'
import GameCard from '../components/GameCard'

const games = [
  { title: 'PUBG', emoji: '🎯', description: 'Battle royale action', gradient: 'from-[#ffd93d] to-[#ff6b6b]' },
  { title: 'BGMI', emoji: '🎮', description: 'Mobile gaming fun', gradient: 'from-[#74b9ff] to-[#0984e3]' },
  { title: 'MBL LGNDS', emoji: '🗡️', description: 'Epic MOBA battles', gradient: 'from-[#ff6b6b] to-[#4ecdc4]' },
  { title: 'COC', emoji: '🏰', description: 'Strategy and clans', gradient: 'from-[#fdcb6e] to-[#e17055]' },
  { title: 'V', emoji: '⚡', description: 'Tactical shooter', gradient: 'from-[#ff7675] to-[#d63031]' },
  { title: '', emoji: '', description: '', gradient: 'from-gray-200 to-gray-400' },
  { title: '', emoji: '', description: '', gradient: 'from-gray-200 to-gray-400' },
  { title: '', emoji: '', description: '', gradient: 'from-gray-200 to-gray-400' },
  { title: '', emoji: '', description: '', gradient: 'from-gray-200 to-gray-400' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col pb-24 relative w-full max-w-md mx-auto pt-6 bg-[var(--color-bg)]">

      {/* Main action buttons in a row */}
      <div className="flex gap-2 w-full px-2 mb-4">
        <button className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] py-3 font-medium text-sm shadow hover:bg-[var(--color-primary)/.08] transition-all flex flex-col justify-center items-center">
          <img className='w-8' src="/add-money.png" alt="" />
          <span>add money</span>
        </button>
        <button className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] py-3 font-medium text-sm shadow hover:bg-[var(--color-primary)/.08] transition-all">Transaction</button>
        <button className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] py-3 font-medium text-sm shadow hover:bg-[var(--color-primary)/.08] transition-all">Orders</button>
        <button className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] py-3 font-medium text-sm shadow hover:bg-[var(--color-primary)/.08] transition-all">History</button>
      </div>

      {/* All Games label */}
      <div className="px-4 mb-2">
        <div className="text-[var(--color-text)] text-base font-medium mb-1">All Games</div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full px-2">
        {games.map((game, idx) => (
          <div key={idx}>
            {game.title ? <GameCard game={game} /> : ''}
          </div>
        ))}
      </div>

      <BottomNavbar />
    </div>
  )
} 