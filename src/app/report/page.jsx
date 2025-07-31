"use client"
import React, { useEffect, useState } from 'react'
import { apiClient } from '../apiClient'

// Helper to get local date string yyyy-mm-dd (not UTC)
function formatLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper to convert local date string to UTC for API queries
function getUTCDateRange(localDateStr, isEndDate = false) {
  const localDate = new Date(localDateStr)
  if (isEndDate) {
    // For end date, set to end of day in local timezone, then convert to UTC
    localDate.setHours(23, 59, 59, 999)
  } else {
    // For start date, set to start of day in local timezone, then convert to UTC
    localDate.setHours(0, 0, 0, 0)
  }
  return localDate.toISOString()
}

// Helper to format currency
function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

// Helper to get transaction type style
function getTransactionTypeStyle(type) {
  switch (type) {
    case 'credit':
      return 'bg-green-900/50 text-green-400 border-green-700'
    case 'debit':
      return 'bg-red-900/50 text-red-400 border-red-700'
    default:
      return 'bg-gray-700 text-gray-300 border-gray-600'
  }
}

// Helper to get status style
function getStatusStyle(status) {
  switch (status) {
    case 'completed':
      return 'bg-green-900/50 text-green-400 border-green-700'
    case 'pending':
      return 'bg-yellow-900/50 text-yellow-400 border-yellow-700'
    case 'failed':
      return 'bg-red-900/50 text-red-400 border-red-700'
    default:
      return 'bg-gray-700 text-gray-300 border-gray-600'
  }
}

const TRANSACTION_TYPES = [
  { value: '', label: 'All Transactions' },
  { value: 'credit', label: 'Credits' },
  { value: 'debit', label: 'Debits' }
]

export default function ReportPage() {
  // Date range: default to last 30 days
  const today = new Date()
  const monthAgo = new Date()
  monthAgo.setDate(today.getDate() - 29)

  const [startDate, setStartDate] = useState(formatLocalDate(monthAgo))
  const [endDate, setEndDate] = useState(formatLocalDate(today))
  const [transactionType, setTransactionType] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [summary, setSummary] = useState({
    totalCredits: 0,
    totalDebits: 0,
    netAmount: 0
  })

  useEffect(() => {
    async function fetchLedger() {
      setLoading(true)
      setError('')
      try {
        // Convert local dates to UTC range for API query
        const startUTC = getUTCDateRange(startDate, false)
        const endUTC = getUTCDateRange(endDate, true)
        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          dateFrom: startUTC,
          dateTo: endUTC
        })
        
        if (transactionType) {
          params.append('transactionType', transactionType)
        }
        
        const data = await apiClient.get(`/wallet/ledger?${params.toString()}`)
        
        if (data.success && data.data) {
          setTransactions(data.data.transactions || [])
          setTotalPages(data.data.pagination?.pages || 1)
          setTotalTransactions(data.data.pagination?.total || 0)
          
          // Calculate summary
          const credits = data.data.transactions.filter(t => t.transactionType === 'credit')
          const debits = data.data.transactions.filter(t => t.transactionType === 'debit')
          
          const totalCredits = credits.reduce((sum, t) => sum + t.amount, 0)
          const totalDebits = debits.reduce((sum, t) => sum + t.amount, 0)
          
          setSummary({
            totalCredits,
            totalDebits,
            netAmount: totalCredits - totalDebits
          })
        }
      } catch (err) {
        setError('Failed to load ledger data')
        console.error('Ledger fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLedger()
  }, [startDate, endDate, transactionType, page])

  // Filter handlers
  const handleStartDate = (e) => {
    setStartDate(e.target.value)
    setPage(1)
  }
  
  const handleEndDate = (e) => {
    setEndDate(e.target.value)
    setPage(1)
  }
  
  const handleTransactionType = (e) => {
    setTransactionType(e.target.value)
    setPage(1)
  }

  // Pagination
  const handlePrev = () => setPage((p) => Math.max(1, p - 1))
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1))

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Wallet Ledger Report</h1>
          <p className="text-gray-300 text-sm sm:text-lg">Comprehensive transaction history and financial summary</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Total Credits</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{formatCurrency(summary.totalCredits)}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Total Debits</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{formatCurrency(summary.totalDebits)}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Net Balance</p>
                <p className={`text-lg sm:text-2xl font-bold ${summary.netAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(Math.abs(summary.netAmount))}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-white mb-3">
                Filter Options
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">Transaction Type</label>
                  <select
                    value={transactionType}
                    onChange={handleTransactionType}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    {TRANSACTION_TYPES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">From Date</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={handleStartDate} 
                    max={endDate}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-medium">To Date</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={handleEndDate} 
                    min={startDate}
                    max={formatLocalDate(today)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                
                <div className="flex items-end">
                  <div className="text-xs sm:text-sm text-gray-400">
                    {totalTransactions} transactions found
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            {/* Table Header */}
            <div className="sticky top-0 z-20 bg-gray-700 border-b border-gray-600 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                <div className="col-span-4">Transaction Details</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Balance</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="relative" style={{height: '60vh'}}>
              <div className="overflow-y-auto h-full divide-y divide-gray-700" style={{scrollbarGutter: 'stable'}}>
                {loading ? (
                  <div className="px-6 py-12 text-center">
                    <div className="inline-flex items-center gap-3 text-gray-400">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading ledger data...
                    </div>
                  </div>
                ) : error ? (
                  <div className="px-6 py-12 text-center">
                    <div className="text-red-400 text-sm">{error}</div>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-sm">No transactions found for the selected criteria.</div>
                  </div>
                ) : (
                  transactions.map(tx => (
                    <div key={tx._id} className="px-6 py-4 hover:bg-gray-700/50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Transaction Details */}
                        <div className="col-span-4">
                          <div className="font-medium text-white text-sm mb-1">
                            {tx.description || 'Wallet Transaction'}
                          </div>
                          <div className="text-xs text-gray-400 mb-1">
                            {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {tx.metadata?.utr && (
                            <div className="text-xs text-gray-400">
                              UTR: {tx.metadata.utr}
                            </div>
                          )}
                        </div>
                        
                        {/* Transaction Type */}
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTransactionTypeStyle(tx.transactionType)}`}>
                            {tx.transactionType === 'credit' ? 'Credit' : 'Debit'}
                          </span>
                        </div>
                        
                        {/* Balance */}
                        <div className="col-span-2">
                          <div className="text-sm text-white">
                            {formatCurrency(tx.balanceAfter)}
                          </div>
                          <div className="text-xs text-gray-400">
                            was {formatCurrency(tx.balanceBefore)}
                          </div>
                        </div>
                        
                        {/* Status */}
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(tx.status)}`}>
                            {tx.status}
                          </span>
                        </div>
                        
                        {/* Amount */}
                        <div className="col-span-2 text-right">
                          <div className={`font-semibold text-base ${tx.transactionType === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.transactionType === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <div className="inline-flex items-center gap-3 text-gray-400">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading ledger data...
                </div>
              </div>
            ) : error ? (
              <div className="px-4 py-8 text-center">
                <div className="text-red-400 text-sm">{error}</div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-gray-400 text-sm">No transactions found for the selected criteria.</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {transactions.map(tx => (
                  <div key={tx._id} className="p-4 hover:bg-gray-700/50 transition-colors">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-sm truncate">
                          {tx.description || 'Wallet Transaction'}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTransactionTypeStyle(tx.transactionType)}`}>
                          {tx.transactionType === 'credit' ? 'Credit' : 'Debit'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Amount:</span>
                        <span className={`font-semibold text-sm ${tx.transactionType === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.transactionType === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Balance:</span>
                        <span className="text-sm text-white">{formatCurrency(tx.balanceAfter)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Status:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>
                      
                      {tx.metadata?.utr && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">UTR:</span>
                          <span className="text-xs text-gray-400 font-mono">{tx.metadata.utr}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-700 bg-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                  Page {page} of {totalPages} • {totalTransactions} total transactions
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 bg-gray-600 border border-gray-500 rounded-md hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 bg-gray-600 border border-gray-500 rounded-md hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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