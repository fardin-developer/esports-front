"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { apiClient } from '../../apiClient'
import BottomNavbar from '../../components/BottomNavbar'
import { FaBolt, FaTimes, FaGem, FaCheckCircle } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { fetchWalletBalance } from '../../features/auth/authSlice'
import React from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Shield, Headphones, DollarSign } from 'lucide-react';

export default function GameDiamondPacksPage() {
  const [diamondPacks, setDiamondPacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [gameInfo, setGameInfo] = useState(null)
  // Remove userId and serverId states
  // const [userId, setUserId] = useState('')
  // const [serverId, setServerId] = useState('')
  const [validationValues, setValidationValues] = useState({})
  const [validationLoading, setValidationLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null)
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [upiLoading, setUpiLoading] = useState(false);
  const [showHowToPurchase, setShowHowToPurchase] = useState(false);
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [upiTransaction, setUpiTransaction] = useState(null);
  const [upiOrder, setUpiOrder] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const params = useParams()
  const gameId = params.gameId
  const dispatch = useDispatch()
  const router = useRouter();

  useEffect(() => {
    async function fetchDiamondPacks() {
      try {
        setLoading(true)
        const data = await apiClient.get(`/games/${gameId}/diamond-packs`)
        // console.log(data);
        
        if (data.success && Array.isArray(data.diamondPacks)) {
          setDiamondPacks(data.diamondPacks)
          console.log(data.gameData);
          
          setGameInfo(data.gameData)
          // Initialize validation values
          if (data.gameData?.validationFields) {
            const initialVals = {}
            data.gameData.validationFields.forEach(field => {
              initialVals[field] = ''
            })
            setValidationValues(initialVals)
          }
        }
      } catch (err) {
        console.error('Failed to fetch diamond packs:', err)
      } finally {
        setLoading(false)
      }
    }

    if (gameId) {
      fetchDiamondPacks()
    }
  }, [gameId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-text text-lg font-semibold">Loading Game Packs...</div>
        </div>
      </div>
    )
  }


  const handleValidateUser = async () => {

    // Use gameInfo._id for validation
    if (!gameInfo?._id) {
      setValidationResult({ status: false, message: 'No game_id found for this game. Cannot validate user.' });
      return;
    }
    // Prepare data for validation API
    const data = {
      // "product-id": String(gameInfo._id),// changgin it temporarily
      "product-id":"MOBILE_LEGENDS_PRO",
      ...Object.fromEntries(
        Object.entries(validationValues).map(([key, value]) => {
          // Map 'userId' to 'User ID', 'serverId' to 'Server ID', else keep as is with capitalization
          if (key.toLowerCase() === 'userid') return ['User ID', value];
          if (key.toLowerCase() === 'serverid') return ['Server ID', value];
          return [key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(), value];
        })
      )
    };

    setValidationLoading(true);
    setValidationResult(null);
    
    try {
      // Use our backend API route to avoid CORS issues
      const response = await fetch('/api/validate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game: 'MOBILE_LEGENDS_PRO',
          userId: validationValues.userId,
          serverId: validationValues.serverId
        })
      });
      
      const result = await response.json();
      console.log(result);
      
      // Check if response is false (rate limiting or other error)
      if (result.response === false) {
        setValidationResult({ 
          status: false, 
          message: "Invalid User ID or Server ID" 
        });
        return;
      }
      
      let status = result.data?.status === 200 ? true : false;
      let message = result.data?.message || 'Validation completed';
      let username = result.data?.nickname;
      
      if (result.data && typeof result.data.status !== 'undefined') {
        status = result.data.status === 'true' || result.data.status === true || result.data.status === 200;
        message = result.data.message || message;
        username = result.data.username || result.data.nickname || username;
      }
      const validationObj = { status, message, username };
      setValidationResult(validationObj);
    } catch (err) {
      console.log(err);
      
      setValidationResult({ status: false, message: "Validation failed. Please try again." });
    } finally {
      setValidationLoading(false);
    }
  };

  // Create Order handler (updated for /api/v1/order/diamond-pack)
  const handleCreateOrder = async () => {
    if (!selectedPack || !selectedPaymentMethod) return;
    const pack = diamondPacks.find(p => p._id === selectedPack);
    if (!pack) return;

    // Route to appropriate payment method
    if (selectedPaymentMethod === 'upi') {
      handleCreateUpiOrder();
    } else if (selectedPaymentMethod === 'cp-coins') {
      handleCreateCpCoinsOrder();
    }
  };

  // Create CP Coins Order handler
  const handleCreateCpCoinsOrder = async () => {
    if (!selectedPack) return;
    const pack = diamondPacks.find(p => p._id === selectedPack);
    if (!pack) return;

    setOrderLoading(true);
    setOrderResult(null);
  
    try {
      const payload = {
        diamondPackId: pack._id,
        playerId: validationValues.userId || validationValues.UserId || validationValues['User ID'],
        server: validationValues.serverId || validationValues.ServerId || validationValues['Server ID'],
        quantity: 1,
      };
  
      const result = await apiClient.post('/order/diamond-pack', payload);
      const orderId = result.orderId
      console.log(orderId);
      setOrderResult(result);
      console.log("test 1 ");
      
  
      if (result.success && orderId) {
        dispatch(fetchWalletBalance());
        console.log("test 2 ");

        // ✅ Navigate to the order page with order ID
        router.push(`/status?orderId=${orderId}`);
      }
    } catch (err) {
      setOrderResult({ success: false, message: 'Order creation failed. Please try again.' });
    } finally {
      setOrderLoading(false);
    }
  };

  // Create UPI Order handler
  const handleCreateUpiOrder = async () => {
    if (!selectedPack) return;
    const pack = diamondPacks.find(p => p._id === selectedPack);
    if (!pack) return;

    setUpiLoading(true);
    setOrderResult(null);

    try {
      const payload = {
        diamondPackId: pack._id,
        playerId: validationValues.userId || validationValues.UserId || validationValues['User ID'],
        server: validationValues.serverId || validationValues.ServerId || validationValues['Server ID'],
        quantity: 1,
        redirectUrl: `${window.location.origin}/status`
      };

      const result = await apiClient.post('/order/diamond-pack-upi', payload);
      setOrderResult(result);

      console.log(result);
      

     if (result.success && result.transaction) {
        window.location.href = result.transaction.paymentUrl;
      } else {
        alert("UPI order creation failed. Please try again later.");
      }
    } catch (err) {
      setOrderResult({ success: false, message: 'UPI order creation failed. Please try again.' });
    } finally {
      setUpiLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen w-screen bg-[#FECA00]">
      <div className="max-w-7xl mx-auto px-4 py-6">

      {/* <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 shadow-xl bg-clip-text text- mb-2">
              DIAMOND STORE
            </h1>
            <div className="w-28 h-1 bg-gradient-to-r from-[#FCF3A4] to-gray-300 mx-auto rounded-full"></div>
          </div> */}


        {/* Game Data Section */}
        {gameInfo && (
          <div className="px-4 mb-8">
            <div className="bg-gradient-to-r from-[#FCF3A4] to-gray-200 backdrop-blur-sm border border-[#FCF3A4] rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Game Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md"></div>
                    <img 
                      src={gameInfo.image} 
                      alt={gameInfo.name}
                      className="relative w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border-2 border-gray-600/30 shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Game Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    {gameInfo.name}
                  </h2>
                  <div className="flex flex-col md:flex-row gap-4 text-sm md:text-base text-gray-700">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="font-semibold">Publisher:</span>
                      <span className="bg-gray-800/70 text-white px-3 py-1 rounded-lg">
                        {gameInfo.publisher}
                      </span>
                    </div>
                  </div>
                  
                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    <span className="bg-primary text-gray-800 px-3 py-1 rounded-full text-xs font-medium border border-primary/30 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-gray-800" />
                      Instant Delivery
                    </span>
                    <span className="bg-primary text-gray-800 px-3 py-1 rounded-full text-xs font-medium border border-primary/30 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-gray-800" />
                      Secure Payment
                    </span>
                    <span className="bg-primary text-gray-800 px-3 py-1 rounded-full text-xs font-medium border border-primary/30 flex items-center gap-1">
                      <Headphones className="w-3 h-3 text-gray-800" />
                      24/7 Support
                    </span>
                    <span className="bg-primary text-gray-800 px-3 py-1 rounded-full text-xs font-medium border border-primary/30 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-gray-800" />
                      Best Prices
                    </span>
                  </div>
                </div>

                {/* Game Status Badge */}
                <div className="flex-shrink-0">
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Gaming Header with Glow Effect */}
        <div className="px-4 mb-8">
          
          <div className="bg-[#fcf2d7] backdrop-blur-sm border border-[#FCF3A4] rounded-2xl p-6 shadow-2xl">
            <div className="text-gray-800 text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
              <FaGem className="text-gray-800 text-xl" />
              VERIFY YOUR ACCOUNT
            </div>
            <div className="mb-4">
              {gameInfo?.validationFields?.map(field => (
                <div key={field} className="mb-4">
                  <label className="block text-gray-800 font-semibold mb-2" htmlFor={field}>
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <input
                    id={field}
                    type="text"
                    value={validationValues[field] || ''}
                    onChange={e => setValidationValues(vals => ({ ...vals, [field]: e.target.value }))}
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
                    className="w-full bg-gray-100 text-gray-700 placeholder:text-gray-500 rounded-xl px-4 py-3 mb-2 border border-gray-600/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              ))}
            </div>
            <button
              className="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-lg hover:shadow-green-400/25 hover:scale-[1.02] transition-all duration-300 transform"
              onClick={handleValidateUser}
              disabled={validationLoading}
            >
              {validationLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  Validating...
                </div>
              ) : (
                "VALIDATE NOW"
              )}
            </button>
            {validationResult && (
              <div className={`mt-4 p-3 rounded-xl border-2 ${validationResult.status === true ? "bg-green-50 border-green-400 text-green-700" : "bg-red-50 border-red-300 text-red-600"}`}>
                <div className="flex items-center gap-2 font-bold">
                  <FaCheckCircle className={validationResult.status === true ? "text-green-500" : "text-red-400"} />
                  {validationResult.message}
                </div>
                {validationResult.username && (
                  <div className="font-black mt-1 text-gray-800">Username: {validationResult.username}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Select Amount Section Title with How to Purchase Button */}
        <div className="px-2 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-gray-800">
              SELECT YOUR DIAMOND PACK
            </div>
            <button
              onClick={() => setShowHowToPurchase(true)}
              className="bg-[#FCF3A4] text-black px-3 py-4 rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300 transform"
            >
              How to <span className='br'> Purchase</span>
            </button>
          </div>
        </div>

        {/* Diamond Packs Selectable Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4 mb-8 bg-[#FCF3A4] rounded-2xl">
          {diamondPacks.map((pack) => {
            const isSelected = selectedPack === pack._id
            return (
              <div
                key={pack._id}
                className={`relative group cursor-pointer transform transition-all duration-300 text-gray-800 bg-transparent hover:scale-105 ${isSelected ? 'scale-105' : ''}`}
                onClick={() => setSelectedPack(pack._id)}
              >
                {/* Card Background with Gradient */}
                <div className={`relative overflow-hidden rounded-2xl p-4 min-h-[140px] ${isSelected 
                  ? 'bg-primary border-2 border-primary shadow-2xl rounded-2xl shadow-primary/25' 
                  : 'border-1 text-gray-800'
                }`}>
                  
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-purple-500/20 to-transparent"></div>
                  </div>

                  {/* Selection Indicator */}
                  <div className="absolute top-3 left-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'border-primary bg-primary shadow-lg shadow-primary/50' 
                        : 'border-gray-500 bg-transparent group-hover:border-primary/50'
                    }`}>
                      {isSelected && <FaCheckCircle className="text-gray-800 text-xs" />}
                    </div>
                  </div>


                  {/* Pack Logo with Glow Effect */}
                  {pack.logo && (
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md"></div>
                        <img 
                          src={pack.logo} 
                          alt={pack.description}
                          className="relative w-14 h-14 object-contain rounded-xl border border-gray-600/30"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Pack Info */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-gray-700 font-semibold text-sm md:text-base mb-2 leading-tight">
                      {pack.description}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-yellow-600 to-gray-500 bg-clip-text">
                      ₹{pack.amount}
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                    isSelected 
                      ? 'shadow-[0_0_30px_rgba(59,130,246,0.5)]' 
                      : 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  }`}></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Payment Section */}
        {selectedPack && (
          <div className="w-full max-w-xl mx-auto mt-6 mb-8 space-y-4">
            {/* Payment Selection Card */}
            <div className="rounded-2xl bg-[#FCF3A4] shadow-lg p-6">
              <h3 className="text-black text-lg font-bold mb-4">SELECT PAYMENT</h3>
              <div className="flex gap-4">
                {/* UPI Payment Option */}
                <button
                  onClick={() => setSelectedPaymentMethod('upi')}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedPaymentMethod === 'upi'
                      ? 'bg-[#FECA00] border-black'
                      : 'bg-white border-black'
                  }`}
                >
                  <div className="w-6 h-6 flex text-gray-900 font-bold items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                      <rect x="2" y="4" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-black font-semibold">UPI</span>
                </button>

                {/* CP Coins Payment Option */}
                <button
                  onClick={() => setSelectedPaymentMethod('cp-coins')}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedPaymentMethod === 'cp-coins'
                      ? 'bg-[#FECA00] border-black'
                      : 'bg-white border-black'
                  }`}
                >
                  <div className="w-6 h-6 bg-[#FECA00] rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xs">CP</span>
                  </div>
                  <span className="text-black font-semibold">CP Coins</span>
                </button>
              </div>
            </div>

            {/* Buy Now Card - Only show after payment method selection */}
            {true && (
              <div className="rounded-2xl bg-[#FCF3A4] shadow-lg p-6 mb-28">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-black text-lg font-bold">BUY NOW</h3>
                  <div className="text-right">
                    <div className="text-black text-lg font-bold">
                      ₹{diamondPacks.find(p => p._id === selectedPack)?.amount}
                    </div>
                    {/* <div className="text-black text-sm">
                      {diamondPacks.find(p => p._id === selectedPack)?.description} | {selectedPaymentMethod === 'upi' ? 'UPI' : 'CP COINS'}
                    </div> */}
                  </div>
                </div>
                
                <button 
                  className="w-full py-4 rounded-xl bg-[#FECA00] text-black font-black text-xl tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={handleCreateOrder} 
                  disabled={orderLoading || upiLoading}
                >
                  {(orderLoading || upiLoading) ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                      Processing Purchase...
                    </div>
                  ) : (
                    "BUY NOW"
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {diamondPacks.length === 0 && !loading && (
          <div className="flex items-center justify-center flex-1 px-4">
            <div className="text-center text-text opacity-70">
              <div className="text-xl md:text-2xl mb-2">No diamond packs available</div>
              <div className="text-sm md:text-base">Check back later for new packs</div>
            </div>
          </div>
        )}

        {/* How to Purchase Modal */}
        {showHowToPurchase && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 max-w-5xl w-full max-h-[95vh] overflow-y-auto border border-gray-600/30 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">
                  How to Purchase
                </h2>
                <button
                  onClick={() => setShowHowToPurchase(false)}
                  className="text-text hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-full"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              {/* MLBB Purchasing Guide Image */}
              <div className="flex justify-center mb-6">
                <div className="relative max-w-full">
                  <img 
                    src="/mlbb purchasing guide.jpg" 
                    alt="MLBB Purchasing Guide"
                    className="w-full h-auto max-h-[75vh] object-contain rounded-xl border border-gray-600/30 shadow-lg"
                    onError={(e) => {
                      console.error('Failed to load MLBB purchasing guide image');
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-4 border border-yellow-500/30 mb-6">
                <p className="text-sm text-text/90 leading-relaxed text-center">
                  <strong className="text-yellow-400">📱 Follow the guide above</strong> to complete your Mobile Legends diamond purchase successfully!
                </p>
              </div>
              
              <button
                onClick={() => setShowHowToPurchase(false)}
                className="w-full bg-primary text-black py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300 transform"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {upiModalOpen && upiTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full border border-gray-600/30 shadow-2xl relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                onClick={() => setUpiModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-center mb-4 text-white">Scan & Pay with UPI</h2>
              <div className="flex flex-col items-center mb-6">
                <img
                  src={upiTransaction.paymentUrl}
                  alt="UPI QR Code"
                  className="w-48 h-48 rounded-xl border-4 border-primary bg-white object-contain mb-2"
                />
                <span className="text-gray-300 text-sm">Scan this QR with any UPI app</span>
              </div>
              <div className="mb-6">
                <div className="text-center text-gray-400 mb-2">Or pay directly with your favorite app:</div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {upiTransaction.upiIntent?.gpay_link && (
                    <a href={upiTransaction.upiIntent.gpay_link} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm">GPay</a>
                  )}
                  {upiTransaction.upiIntent?.phonepe_link && (
                    <a href={upiTransaction.upiIntent.phonepe_link} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm">PhonePe</a>
                  )}
                  {upiTransaction.upiIntent?.paytm_link && (
                    <a href={upiTransaction.upiIntent.paytm_link} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm">Paytm</a>
                  )}
                  {upiTransaction.upiIntent?.bhim_link && (
                    <a href={upiTransaction.upiIntent.bhim_link} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm">BHIM</a>
                  )}
                </div>
              </div>
              <button
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300 mb-2"
                onClick={() => {
                  setUpiModalOpen(false);
                  if (upiOrder?.id) router.push(`/status?orderId=${upiOrder.id}`);
                }}
              >
                Payment Completed
              </button>
              <div className="text-xs text-gray-400 text-center mt-2">After payment, click above to complete your order.</div>
            </div>
          </div>
        )}

        <BottomNavbar />
      </div>
    </div>
  )
}