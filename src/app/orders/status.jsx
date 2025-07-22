"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function OrderStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      setError('No orderId provided.');
      setLoading(false);
      return;
    }
    async function fetchStatus() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/moogold/order-status?orderId=${orderId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to fetch order status');
        setStatusData(data.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [searchParams]);

  const statusColor = (status) => {
    if (!status) return 'text-gray-400';
    if (status === 'completed') return 'text-green-400';
    if (status === 'pending') return 'text-yellow-400';
    if (status === 'failed' || status === 'cancelled') return 'text-red-400';
    return 'text-primary';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary to-accent relative overflow-hidden">
      <div className="relative z-20 bg-card/90 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center max-w-xl w-full animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary text-center mb-4 drop-shadow">Order Status</h1>
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="loader mb-4"></div>
            <div className="text-text text-lg">Fetching order status...</div>
          </div>
        )}
        {error && (
          <div className="text-red-400 text-center text-lg font-semibold py-8">{error}</div>
        )}
        {statusData && (
          <div className="w-full bg-bg/80 rounded-xl p-4 mb-6 shadow-md animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block w-3 h-3 rounded-full ${statusColor(statusData.order_status)} animate-pulse`}></span>
              <span className={`font-bold text-lg ${statusColor(statusData.order_status)}`}>{statusData.order_status?.toUpperCase()}</span>
            </div>
            <div className="text-text/80 text-sm mb-2">
              <span className="font-bold">Order ID:</span> {statusData.order_id}
            </div>
            <div className="text-text/80 text-sm mb-2">
              <span className="font-bold">Created:</span> {statusData.date_created?.date ? new Date(statusData.date_created.date).toLocaleString() : 'N/A'}
            </div>
            {statusData.item && statusData.item.length > 0 && (
              <div className="mt-4">
                <div className="font-bold text-text mb-2">Items</div>
                {statusData.item.map((item, idx) => (
                  <div key={idx} className="bg-card/80 rounded-lg p-3 mb-2 shadow-sm animate-fade-in-up">
                    <div className="text-primary font-semibold text-base mb-1">{item.product}</div>
                    <div className="text-text/80 text-sm mb-1"><span className="font-bold">Variation ID:</span> {item.variation_id}</div>
                    <div className="text-text/80 text-sm mb-1"><span className="font-bold">Quantity:</span> {item.quantity}</div>
                    <div className="text-text/80 text-sm mb-1"><span className="font-bold">Price:</span> ₹{item.price}</div>
                    <div className="text-text/80 text-sm mb-1"><span className="font-bold">Player ID:</span> {item.player_id}</div>
                    <div className="text-text/80 text-sm mb-1"><span className="font-bold">Server ID:</span> {item.server_id}</div>
                    {item.voucher_code && <div className="text-text/80 text-sm mb-1"><span className="font-bold">Voucher:</span> {item.voucher_code}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex gap-4 w-full mt-4">
          <button
            className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-lg tracking-wide shadow-lg hover:bg-primary-dark transition-all duration-200"
            onClick={() => router.push('/')}
          >
            Go to Home
          </button>
          <button
            className="flex-1 py-3 rounded-xl bg-accent text-white font-bold text-lg tracking-wide shadow-lg hover:bg-accent-dark transition-all duration-200"
            onClick={() => router.push('/orders')}
          >
            View Orders
          </button>
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        .loader {
          border: 4px solid #e0e0e0;
          border-top: 4px solid var(--color-primary);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
} 