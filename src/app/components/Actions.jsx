import React, { useState } from 'react'
import { apiClient } from '../apiClient'

const actions = [
  {
    label: 'Add Money',
    icon: '/add-money.png',
    color: 'bg-primary/20 text-primary',
    iconBg: 'bg-primary/80',
    action: 'add-balance',
  },
  {
    label: 'Transactions',
    icon: '/add-money1.png',
    color: 'bg-secondary/20 text-secondary',
    iconBg: 'bg-secondary/80',
  },
  {
    label: 'History',
    icon: '/add-money2.png',
    color: 'bg-accent/20 text-accent',
    iconBg: 'bg-accent/80',
  },
  {
    label: 'Report',
    icon: '/file.svg',
    color: 'bg-error/20 text-error',
    iconBg: 'bg-error/80',
  },
]

const AddBalanceModal = ({ open, onClose }) => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Enter a valid amount')
      return
    }
    setLoading(true)
    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const token = auth?.token
      console.log(token);
      
      const data = await apiClient.post('/wallet/add', {
        amount: Number(amount),
        redirectUrl: 'http://localhost:3001/payment/success',
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!data.success || !data.transaction?.paymentUrl) throw new Error(data.message || 'Failed to create payment')
      window.location.href = data.transaction.paymentUrl
    } catch (err) {
      setError(err.message || 'Failed to create payment')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-light rounded-2xl p-6 w-full max-w-xs shadow-2xl border border-border relative">
        <button className="absolute top-3 right-3 text-text-muted hover:text-text font-bold text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-bold text-primary mb-4 text-center">Add Balance</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full rounded-lg px-4 py-3 border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition"
            disabled={loading}
          />
          {error && <div className="text-error text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-base tracking-wide shadow-lg hover:bg-primary-dark transition-all duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Add Balance'}
          </button>
        </form>
      </div>
    </div>
  )
}

const Actions = () => {
  const [showAddBalance, setShowAddBalance] = useState(false)
  return (
    <div className="w-full px-2 mb-6">
      <AddBalanceModal open={showAddBalance} onClose={() => setShowAddBalance(false)} />
      <div className="flex gap-2 md:gap-3 w-full px-2 mb-6 bg-surface-light/80 backdrop-blur-md rounded-2xl shadow-lg p-2 md:p-4 border border-border">
        {actions.map((action, idx) => (
          <button
            key={action.label}
            className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 md:py-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl ${action.color} font-semibold text-xs md:text-base min-w-0 max-w-[110px] overflow-hidden`}
            style={{ minWidth: 0 }}
            onClick={action.action === 'add-balance' ? () => setShowAddBalance(true) : undefined}
          >
            <span className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-md mb-1 ${action.iconBg}`}>
              <img className="w-5 h-5 md:w-6 md:h-6" src={action.icon} alt={action.label} />
            </span>
            <span className="truncate text-center w-full block">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Actions