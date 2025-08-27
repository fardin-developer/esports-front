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

// Helper to get status style
const getStatusStyle = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-success/10 text-success border-success/20'
    case 'pending':
      return 'bg-warning/10 text-warning border-warning/20'
    case 'processing':
      return 'bg-info/10 text-info border-info/20'
    case 'cancelled':
      return 'bg-error/10 text-error border-error/20'
    case 'failed':
      return 'bg-error/10 text-error border-error/20'
    default:
      return 'bg-border text-text-muted border-border'
  }
}

const ORDER_STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'failed', label: 'Failed' },
]


export default function OrdersPage() {
  // Date range: default to last 7 days
  const today = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(today.getDate() - 6)

  const [startDate, setStartDate] = useState(formatLocalDate(weekAgo))
  const [endDate, setEndDate] = useState(formatLocalDate(today))
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('')
  const [orderType, setOrderType] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError('')
      try {
        // Convert local dates to UTC range for API query
        const startUTC = getUTCDateRange(startDate, false)
        const endUTC = getUTCDateRange(endDate, true)
        
        const params = `?page=${page}&limit=10${status ? `&status=${status}` : ''}${orderType ? `&orderType=${orderType}` : ''}&startDate=${encodeURIComponent(startUTC)}&endDate=${encodeURIComponent(endUTC)}`
        const data = await apiClient.get(`/order/history${params}`)
        setOrders(data.orders || [])
        setTotalPages(data.pagination?.totalPages || 1)
      } catch (err) {
        setError('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [page, status, orderType, startDate, endDate])

  // Pagination
  const handlePrev = () => setPage((p) => Math.max(1, p - 1))
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1))

  // Filter handlers
  const handleStatus = (e) => {
    setStatus(e.target.value)
    setPage(1)
  }
  const handleOrderType = (e) => {
    setOrderType(e.target.value)
    setPage(1)
  }

  // Date input handlers
  const handleStartDate = (e) => {
    setStartDate(e.target.value)
    setPage(1)
  }
  const handleEndDate = (e) => {
    setEndDate(e.target.value)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 ">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-primary mb-2">Order History</h1>
          <p className="text-text-muted text-sm">View and manage your order history</p>
        </div>

        {/* Filters Section */}
        <div className="bg-surface-light border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-3">
                Filters
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Status</label>
                  <select
                    value={status}
                    onChange={handleStatus}
                    className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
                  >
                    {ORDER_STATUSES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">From Date</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={handleStartDate} 
                    max={endDate}
                    className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">To Date</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={handleEndDate} 
                    min={startDate}
                    max={formatLocalDate(today)}
                    className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-surface-light border border-border rounded-lg p-8 text-center">
              <div className="inline-flex items-center gap-2 text-text-muted">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Loading orders...
              </div>
            </div>
          ) : error ? (
            <div className="bg-surface-light border border-border rounded-lg p-8 text-center">
              <div className="text-error text-sm">{error}</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-surface-light border border-border rounded-lg p-8 text-center">
              <div className="text-text-muted text-sm">No orders found for the selected filters.</div>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden lg:block bg-surface-light border border-border rounded-lg">
                {/* Table Header */}
                <div className="sticky top-0 z-20 bg-surface-light/95 backdrop-blur border-b border-border px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                    <div className="col-span-4">Order</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border">
                  {orders.map(order => (
                    <div key={order._id} className="px-6 py-4 hover:bg-surface/50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Order Info */}
                        <div className="col-span-4">
                          <div className="font-medium text-text text-sm">
                            {order.items?.[0]?.itemName || order.description || 'Order'}
                          </div>
                          {order.description && (
                            <div className="text-xs text-text-muted mt-1 line-clamp-2">{order.description}</div>
                          )}
                        </div>
                        {/* Date */}
                        <div className="col-span-2">
                          <div className="text-sm text-text">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-text-muted">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        {/* Status */}
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        {/* Type */}
                        <div className="col-span-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-border text-text-muted border-border">
                            {order.orderType === 'diamond_pack_purchase' ? 'Diamond Pack' : order.orderType || '-'}
                          </span>
                        </div>
                        {/* Amount */}
                        <div className="col-span-2 text-right">
                          <div className="font-semibold text-primary text-base">
                            {order.amount ? `${order.amount} ${order.currency || ''}` : '-'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {orders.map(order => (
                  <div key={order._id} className="bg-surface-light border border-border rounded-lg p-4 hover:bg-surface/50 transition-colors">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-text text-sm truncate">
                          {order.items?.[0]?.itemName || order.description || 'Order'}
                        </h3>
                        <p className="text-xs text-text-muted mt-1">
                          {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="space-y-2">
                      {order.description && (
                        <p className="text-sm text-text-muted line-clamp-2">{order.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-muted">Type:</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-border text-text-muted">
                            {order.orderType === 'diamond_pack_purchase' ? 'Diamond Pack' : order.orderType || '-'}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary text-base">
                            {order.amount ? `${order.amount} ${order.currency || ''}` : '-'}
                          </div>
                        </div>
                      </div>

                      {order.paymentMethod && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs text-text-muted">Payment:</span>
                          <span className="text-xs text-text capitalize">{order.paymentMethod}</span>
                        </div>
                      )}

                      {order.items && order.items.length > 0 && (
                        <div className="pt-2 border-t border-border">
                          <div className="text-xs text-text-muted mb-1">Items:</div>
                          {order.items.map((item, index) => (
                            <div key={item._id || index} className="flex justify-between items-center text-xs">
                              <span className="text-text truncate flex-1">{item.itemName}</span>
                              <span className="text-text-muted ml-2">Qty: {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 bg-surface-light border border-border rounded-lg px-4 sm:px-6 py-4">
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
  )
}