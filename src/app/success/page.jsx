"use client";

import React, { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('transactionId') || params.get('orderId');
    setTransactionId(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
          {/* Success Icon */}
          <div className="text-green-600 text-8xl mb-6">🎉</div>
          
          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your transaction has been completed successfully.</p>
          
          {transactionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Transaction ID:</p>
              <p className="font-mono text-gray-800 break-all">{transactionId}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
              onClick={() => window.location.href = '/'}
            >
              🏠 Go to Home
            </button>
            <button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              onClick={() => window.location.href = '/transactions'}
            >
              📋 View Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
