"use client";

import React, { useEffect, useState } from 'react';
import { Clock, Package, CheckCircle, XCircle, AlertCircle, Home, List, RefreshCw, CreditCard, Calendar, Hash, User, Server } from 'lucide-react';

import { apiClient } from '../apiClient';

export default function OrderStatusPage() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromURL = params.get('orderId');
    const upiOrder = params.get('client_txn_id') || params.get('clientTrxId');;

    if (!idFromURL && !upiOrder) {
      setError('No order ID provided in URL');
      setLoading(false);
      return;
    }

    setOrderId(idFromURL || upiOrder);
    fetchOrderStatus(idFromURL, upiOrder);
  }, []);

  const fetchOrderStatus = async (id, upiOrder) => {
    setLoading(true);
    setError(null);
    console.log("id", id);
    console.log("upiOrder", upiOrder);
    
    try {
      let orderId = id;
      if (!id && upiOrder) {
        orderId = upiOrder;
      }
      console.log("orderId", orderId);
      
      const response = await apiClient.get(`/order/order-status?orderId=${orderId}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch order status');
      }
      setOrderData(response.order);
    } catch (e) {
      console.error('API Error:', e);
      setError(`Failed to fetch order status: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Clock,
        iconColor: 'text-amber-500',
        label: 'Pending'
      },
      processing: {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: RefreshCw,
        iconColor: 'text-blue-500',
        label: 'Processing'
      },
      completed: {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: CheckCircle,
        iconColor: 'text-green-500',
        label: 'Completed'
      },
      failed: {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: XCircle,
        iconColor: 'text-red-500',
        label: 'Failed'
      },
      cancelled: {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: XCircle,
        iconColor: 'text-gray-500',
        label: 'Cancelled'
      }
    };
    return configs[status] || {
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: AlertCircle,
      iconColor: 'text-gray-500',
      label: status || 'Unknown'
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency = 'INR') => {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Helper function to parse description JSON
  const parseDescription = (description) => {
    try {
      if (typeof description === 'string') {
        return JSON.parse(description);
      }
      return description;
    } catch (e) {
      console.error('Error parsing description:', e);
      return { text: description };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Order Details</h3>
            <p className="text-gray-500">Please wait while we fetch your order information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Order</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button 
              onClick={() => fetchOrderStatus(orderId)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) return null;

  const statusConfig = getStatusConfig(orderData.status);
  const StatusIcon = statusConfig.icon;
  const descriptionData = parseDescription(orderData.description);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your order status and details
              </p>
            </div>
            <button 
              onClick={() => fetchOrderStatus(orderId)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Status Card */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-3" />
                  <h2 className="text-lg font-medium text-gray-900">Order Status</h2>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                  <StatusIcon className={`h-4 w-4 mr-2 ${statusConfig.iconColor}`} />
                  {statusConfig.label}
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Hash className="h-4 w-4 mr-2" />
                    Order ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{orderData._id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Order Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(orderData.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Method
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{orderData.paymentMethod}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{orderData.orderType.replace(/_/g, ' ')}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={item._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.itemName}</h4>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Item ID: {item.itemId}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>Unit Price: {formatCurrency(item.price, orderData.currency)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity, orderData.currency)}
                      </div>
                      <div className="text-sm text-gray-500">Total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Game User Details */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Account Details</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                {descriptionData.playerId && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Player ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{descriptionData.playerId}</dd>
                  </div>
                )}
                {descriptionData.server && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      Server
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{descriptionData.server}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderData.amount, orderData.currency)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(orderData.amount, orderData.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {descriptionData.text && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-700">{descriptionData.text}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </button>
            <button 
              onClick={() => window.location.href = '/orders'}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <List className="h-4 w-4 mr-2" />
              View All Orders
            </button>
          </div>
        </div>

        {/* Support Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Need help with your order?{' '}
            <a href="/support" className="font-medium text-blue-600 hover:text-blue-500">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}