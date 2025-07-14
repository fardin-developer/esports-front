"use client"
import React, { useEffect, useState } from 'react'
import { apiClient } from '../apiClient'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true)
      setError('')
      try {
        const auth = JSON.parse(localStorage.getItem('auth'))
        const token = auth?.token
        const data = await apiClient.get('/wallet/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        setTransactions(data.transactions || [])
      } catch (err) {
        setError('Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  return (
    <main className="min-h-screen bg-bg py-10 px-2 md:px-0">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary shimmer">Transactions</h1>
        {loading ? (
          <div className="text-center text-text-muted py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-error py-10">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-text-muted py-10">No transactions found.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {transactions.map(tx => (
              <div key={tx.id} className="rounded-xl bg-surface-light border border-border shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold text-text text-base md:text-lg">{tx.type || 'Transaction'}</div>
                  <div className="text-xs text-text-muted">{new Date(tx.date).toLocaleString()}</div>
                  <div className="text-sm text-text-muted mt-1">{tx.description}</div>
                </div>
                <div className={`font-bold text-lg md:text-xl ${tx.amount > 0 ? 'text-success' : 'text-error'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency || ''}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 