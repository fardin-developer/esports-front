"use client";

import React, { useEffect, useState } from 'react';
import { apiClient } from '../apiClient';

export default function OrderStatusPage() {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromURL = params.get('orderId');

    if (!idFromURL) {
      setError('No order ID provided in URL');
      setLoading(false);
      return;
    }

    setOrderId(idFromURL);

    async function fetchStatus() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.get(`/moogold/order-status?orderId=${idFromURL}`);
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch order status');
        }
        setStatusData(data.data);
      } catch (e) {
        console.error('API Error:', e);
        setError(`Failed to fetch order status: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, []);

  const getStatusColor = (status) => {
    if (!status) return 'text-gray-400 bg-gray-100';
    if (status === 'completed') return 'text-green-600 bg-green-100';
    if (status === 'pending') return 'text-yellow-600 bg-yellow-100';
    if (status === 'processing') return 'text-blue-600 bg-blue-100';
    if (status === 'failed' || status === 'cancelled') return 'text-red-600 bg-red-100';
    return 'text-purple-600 bg-purple-100';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return '✅';
    if (status === 'pending') return '⏳';
    if (status === 'processing') return '🔄';
    if (status === 'failed' || status === 'cancelled') return '❌';
    return '📦';
  };

  const formatDate = (dateObj) => {
    if (!dateObj || !dateObj.date) return 'N/A';
    return new Date(dateObj.date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Status</h1>
          <p className="text-gray-600">Track your order progress in real-time</p>
          {orderId && <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <div className="text-gray-600 text-lg mt-4">Fetching your order details...</div>
            </div>
          )}

          {error && (
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Order</h3>
                <p className="text-red-600">{error}</p>
                <button 
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {statusData && (
            <div className="p-8">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Order #{statusData.order_id}</h2>
                    <p className="text-blue-100">Created: {formatDate(statusData.date_created)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getStatusIcon(statusData.order_status)}</span>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(statusData.order_status)} bg-white`}>
                      {statusData.order_status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {statusData.item && statusData.item.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    🛒 Order Items ({statusData.item.length})
                  </h3>
                  <div className="space-y-4">
                    {statusData.item.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.product}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-600">Variation ID:</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.variation_id}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-600">Quantity:</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">×{item.quantity}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-600">Unit Price:</span>
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">₹{item.price}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-600">Player ID:</span>
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono">{item.player_id}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-600">Server ID:</span>
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono">{item.server_id}</span>
                              </div>
                              {item.voucher_code && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-600">Voucher:</span>
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-mono">{item.voucher_code}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-gray-800">
                              ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">Total</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mt-4 border border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-gray-800">Order Total</span>
                      <span className="text-2xl font-bold text-green-600">₹{calculateTotal(statusData.item)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => window.location.href = '/'}
                >
                  🏠 Go to Home
                </button>
                <button 
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => window.location.href = '/orders'}
                >
                  📋 View All Orders
                </button>
                <button 
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => window.location.reload()}
                >
                  🔄 Refresh Status
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Need help? Contact our support team for assistance.</p>
        </div>
      </div>
    </div>
  );
}
