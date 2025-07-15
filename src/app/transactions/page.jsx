"use client"
import React, { useEffect, useState } from 'react'
import { apiClient } from '../apiClient'

// Helper to get date string yyyy-mm-dd
function formatDate(date) {
  return date.toISOString().slice(0, 10)
}

export default function TransactionsPage() {
  // Date range: default to last 7 days
  const today = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(today.getDate() - 6)

  const [startDate, setStartDate] = useState(formatDate(weekAgo))
  const [endDate, setEndDate] = useState(formatDate(today))
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true)
      setError('')
      try {
        const params = `?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=10`
        const data = await apiClient.get(`/transaction/history${params}`)
        setTransactions(data.transactions || [])
        setTotalPages(data.pagination?.totalPages || 1)
      } catch (err) {
        setError('Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [startDate, endDate, page])

  // Date input handlers
  const handleStartDate = (e) => setStartDate(e.target.value)
  const handleEndDate = (e) => setEndDate(e.target.value)

  // Pagination
  const handlePrev = () => setPage((p) => Math.max(1, p - 1))
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1))

  const getStatusStyle = (status) => {
    switch (status) {
      case 'success':
        return 'bg-success/10 text-success border-success/20'
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'failed':
        return 'bg-error/10 text-error border-error/20'
      default:
        return 'bg-border text-text-muted border-border'
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-primary mb-2">Transaction History</h1>
          <p className="text-text-muted text-sm">View and manage your transaction history</p>
        </div>

        {/* Filters Section */}
        <div className="bg-surface-light border border-border rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-text mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-text-muted mb-1">From</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={handleStartDate} 
                    max={endDate}
                    className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">To</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={handleEndDate} 
                    min={startDate}
                    max={formatDate(today)}
                    className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-surface-light border border-border rounded-lg">
          {/* Table Header */}
          <div className="sticky top-0 z-20 bg-surface-light/95 backdrop-blur border-b border-border px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-text-muted uppercase tracking-wider">
              <div className="col-span-6 sm:col-span-4">Transaction</div>
              <div className="col-span-3 sm:col-span-2 hidden sm:block">Date</div>
              <div className="col-span-2 sm:col-span-2">Status</div>
              <div className="col-span-3 sm:col-span-4 text-right">Amount</div>
            </div>
          </div>

          {/* Table Body - Scrollable */}
          <div className="relative" style={{height: '60vh'}}>
            <div className="overflow-y-auto h-full divide-y divide-border" style={{scrollbarGutter: 'stable'}}>
              {loading ? (
                <div className="px-6 py-12 text-center">
                  <div className="inline-flex items-center gap-2 text-text-muted">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    Loading transactions...
                  </div>
                </div>
              ) : error ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-error text-sm">{error}</div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-text-muted text-sm">No transactions found for the selected period.</div>
                </div>
              ) : (
                transactions.map(tx => (
                  <div key={tx._id} className="px-6 py-4 hover:bg-surface/50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Transaction Info */}
                      <div className="col-span-6 sm:col-span-4">
                        <div className="font-medium text-text text-sm">Wallet Top-up</div>
                        {tx.description && (
                          <div className="text-xs text-text-muted mt-1 line-clamp-2">{tx.description}</div>
                        )}
                        <div className="text-xs text-text-muted mt-1 sm:hidden">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {/* Date - Hidden on mobile */}
                      <div className="col-span-2 hidden sm:block">
                        <div className="text-sm text-text">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-text-muted">
                          {new Date(tx.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="col-span-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>
                      
                      {/* Amount */}
                      <div className="col-span-3 sm:col-span-4 text-right">
                        <div className="font-semibold text-primary text-base">
                          +{tx.amount} {tx.currency || ''}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-text-muted">
                  Page {page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-text bg-surface border border-border rounded-md hover:bg-surface-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-text bg-surface border border-border rounded-md hover:bg-surface-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}