import React, { useState, useEffect } from 'react'
import { apiClient } from '../apiClient'

const actions = [
  {
    label: 'Add Money',
    icon: '/add-money.png',
    color: 'primary',
    bgColor: 'bg-[#38bdf8]',
    hoverBg: 'hover:bg-[#0ea5e9]',
    glowColor: 'hover:shadow-[#38bdf8]/30',
    action: 'add-balance',
  },
  {
    label: 'Transactions',
    icon: '/add-money1.png',
    color: 'secondary',
    bgColor: 'bg-[#fbbf24]',
    hoverBg: 'hover:bg-[#f59e0b]',
    glowColor: 'hover:shadow-[#fbbf24]/30',
    action: 'navigate',
    href: '/transactions',
  },
  {
    label: 'History',
    icon: '/add-money2.png',
    color: 'accent',
    bgColor: 'bg-[#f472b6]',
    hoverBg: 'hover:bg-[#ec4899]',
    glowColor: 'hover:shadow-[#f472b6]/30',
    action: 'navigate',
    href: '/orders',
  },
  {
    label: 'Report',
    icon: '/file.svg',
    color: 'success',
    bgColor: 'bg-[#22c55e]',
    hoverBg: 'hover:bg-[#16a34a]',
    glowColor: 'hover:shadow-[#22c55e]/30',
    action: 'navigate',
    href: '/report',
  },
]

const AddBalanceModal = ({ open, onClose }) => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Enter a valid amount')
      return
    }
    setLoading(true)
    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const token = auth?.token

      const response = await apiClient.post('/wallet/add', {
        amount: Number(amount),
        redirectUrl: 'http://localhost:3001/payment/success',
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.success || !response.transaction?.paymentUrl) {
        throw new Error(response.message || 'Failed to create payment')
      }

      // Redirect to payment
      window.location.href = response.transaction.paymentUrl
    } catch (err) {
      setError(err.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 modal-overlay">
      <div className="bg-[#18181b] border border-[#334155] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative modal-container">

        <button 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#23272f] transition-all duration-200" 
          onClick={onClose}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div>
          <h2 className="text-xl font-semibold text-[#f1f5f9] mb-6 text-center">Add Balance</h2>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-xl px-4 py-3 bg-[#23272f] border border-[#334155] text-[#f1f5f9] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-all duration-200"
                disabled={loading}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && (
              <div className="text-[#ef4444] text-sm text-center bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg py-2 px-3">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#38bdf8]/20 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Add Balance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Actions = () => {
  const [showAddBalance, setShowAddBalance] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const handleClick = (action, idx) => {
    if (action.action === 'add-balance') {
      setShowAddBalance(true)
    } else if (action.action === 'navigate' && action.href) {
      window.location.href = action.href
    }
  }

  return (
    <section className="w-full px-4 py-8 relative">
      <AddBalanceModal open={showAddBalance} onClose={() => setShowAddBalance(false)} />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-4 md:grid-cols-4 gap-4 md:gap-6">
          {actions.map((action, idx) => (
            <button
              key={action.label}
              className={`
                group flex flex-col items-center justify-center aspect-square rounded-2xl pt-4 pb-4
                bg-[#18181b] border border-[#334155] 
                hover:border-[#38bdf8]/50 hover:-translate-y-1 hover:shadow-xl
                ${action.glowColor}
                focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:border-[#38bdf8]
                transition-all duration-300 ease-out transform-gpu
                active:scale-95 active:translate-y-0
              `}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleClick(action, idx)}
            >
              <div className={`
                flex items-center justify-center w-8 h-7 md:w-14 md:h-14 rounded-xl mb-3
                ${action.bgColor} ${action.hoverBg}
                transition-all duration-300 group-hover:scale-110
              `}>
                <img 
                  className="w-3 h-3 md:w-8 md:h-8 object-contain filter brightness-0 invert" 
                  src={action.icon} 
                  alt={action.label} 
                />
              </div>

              <span className="text-[9px] md:text-base text-[#f1f5f9] font-medium text-center transition-colors duration-300 group-hover:text-white">
                {action.label}
              </span>

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-[#334155] rounded-full transition-all duration-300 group-hover:w-8 group-hover:bg-[#38bdf8]"></div>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          animation: fadeIn 0.3s ease;
        }

        .modal-container {
          animation: slideIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </section>
  )
}

export default Actions
