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
      const response = await apiClient.post('/wallet/add', {
        amount: Number(amount),
        redirectUrl: `${window.location.origin}/payment/status`,
      })

      if (!response.success || !response.transaction?.paymentUrl) {
        throw new Error(response.message || 'Failed to create payment')
      }

      window.location.href = response.transaction.paymentUrl
    } catch (err) {
      setError(err.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 w-full max-w-sm shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-300">
        
        <button 
          className="absolute -top-4 -right-4 w-12 h-12 flex items-center justify-center bg-black text-primary rounded-full border-[3px] border-white shadow-lg hover:rotate-90 transition-transform duration-300 z-10" 
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-primary border-[3px] border-black rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-black text-black mb-1 uppercase tracking-tight">Add Balance</h2>
          <p className="text-black/50 font-bold text-xs uppercase tracking-widest mb-8">Fast & Secure Top-up</p>
          
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <span className="text-black font-black text-xl">₹</span>
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-2xl pl-12 pr-6 py-4 bg-black/5 border-[3px] border-black text-black text-2xl font-black placeholder:text-black/20 focus:outline-none focus:bg-white transition-all duration-200"
                disabled={loading}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-500 rounded-xl py-2 px-3 text-red-600 text-xs font-bold uppercase">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full py-5 rounded-2xl bg-black text-primary font-black text-xl tracking-widest shadow-[0_8px_0_0_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-1 active:translate-y-2 transition-all duration-100 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'PROCESSING...' : 'CONFIRM TOP-UP'}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-black/30 uppercase tracking-tighter">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Actions = () => {
  const [showAddBalance, setShowAddBalance] = useState(false)

  const handleClick = (action) => {
    if (action.action === 'add-balance') {
      setShowAddBalance(true)
    } else if (action.action === 'navigate' && action.href) {
      window.location.href = action.href
    }
  }

  return (
    <section className="w-full px-4 py-6">
      <AddBalanceModal open={showAddBalance} onClose={() => setShowAddBalance(false)} />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {actions.map((action) => (
            <button
              key={action.label}
              className="group relative flex items-center gap-4 p-3 md:p-5 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200"
              onClick={() => handleClick(action)}
            >
              <div className={`
                flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl border-2 border-black
                ${action.bgColor} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-px group-hover:translate-y-px transition-all
              `}>
                <img 
                  className="w-5 h-5 md:w-7 md:h-7 object-contain brightness-0 invert" 
                  src={action.icon} 
                  alt={action.label} 
                />
              </div>

              <div className="flex flex-col items-start">
                <span className="text-xs md:text-sm font-black text-black uppercase tracking-tight">
                  {action.label}
                </span>
                <span className="text-[9px] md:text-[10px] font-bold text-black/40 uppercase tracking-widest leading-none mt-0.5">
                  Instant
                </span>
              </div>
              
              <div className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Actions
