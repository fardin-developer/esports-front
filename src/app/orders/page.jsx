"use client"
import React, { useEffect, useState } from 'react'
import { apiClient } from '../apiClient'

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

const ORDER_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
  // Add more types as needed
]

export default function OrdersPage() {
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
        const params = `?page=${page}&limit=10${status ? `&status=${status}` : ''}${orderType ? `&orderType=${orderType}` : ''}`
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
  }, [page, status, orderType])

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

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-primary mb-2">Order History</h1>
          <p className="text-text-muted text-sm">View and manage your order history</p>
        </div>

        {/* Filters Section */}
        <div className="bg-surface-light border border-border rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-text mb-2">
                Filters
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                  <label className="block text-xs text-text-muted mb-1">Order Type</label>
                  <select
                    value={orderType}
                    onChange={handleOrderType}
                    className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
                  >
                    {ORDER_TYPES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
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
              <div className="col-span-4">Order</div>
              <div className="col-span-2 hidden sm:block">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
          </div>

          {/* Table Body - Scrollable */}
          <div className="relative" style={{height: '60vh'}}>
            <div className="overflow-y-auto h-full divide-y divide-border" style={{scrollbarGutter: 'stable'}}>
              {loading ? (
                <div className="px-6 py-12 text-center">
                  <div className="inline-flex items-center gap-2 text-text-muted">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    Loading orders...
                  </div>
                </div>
              ) : error ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-error text-sm">{error}</div>
                </div>
              ) : orders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-text-muted text-sm">No orders found for the selected filters.</div>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order._id} className="px-6 py-4 hover:bg-surface/50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Order Info */}
                      <div className="col-span-4">
                        <div className="font-medium text-text text-sm">{order.title || 'Order'}</div>
                        {order.description && (
                          <div className="text-xs text-text-muted mt-1 line-clamp-2">{order.description}</div>
                        )}
                        <div className="text-xs text-text-muted mt-1 sm:hidden">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {/* Date - Hidden on mobile */}
                      <div className="col-span-2 hidden sm:block">
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
                          {order.orderType || '-'}
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