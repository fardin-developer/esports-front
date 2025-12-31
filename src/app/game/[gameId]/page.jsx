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
  const [selectedCategory, setSelectedCategory] = useState(null); // null = all categories
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

  // Extract unique categories from diamond packs
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set();
    diamondPacks.forEach(pack => {
      if (pack.category && pack.status === 'active') {
        uniqueCategories.add(pack.category);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [diamondPacks]);

  // Filter packs based on selected category
  const filteredPacks = React.useMemo(() => {
    if (!selectedCategory) {
      // Show all active packs by default
      return diamondPacks.filter(pack => pack.status === 'active');
    }
    return diamondPacks.filter(pack => pack.category === selectedCategory && pack.status === 'active');
  }, [diamondPacks, selectedCategory]);

  // Clear selected pack if it's not in filtered packs
  React.useEffect(() => {
    if (selectedPack && !filteredPacks.find(pack => pack._id === selectedPack)) {
      setSelectedPack(null);
      setSelectedPaymentMethod(null);
    }
  }, [filteredPacks, selectedPack]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary p-6">
        <div className="relative">
          <div className="w-20 h-20 border-[6px] border-black rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-black rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-black text-black uppercase tracking-widest animate-pulse">
          Loading Packs...
        </h2>
      </div>
    )
  }


  const handleValidateUser = async () => {
    // Use gameInfo._id for validation
    if (!gameInfo?._id) {
      setValidationResult({ status: false, message: 'No game_id found for this game. Cannot validate user.' });
      return;
    }

    // Get the validation fields from gameInfo
    const validationFields = gameInfo.validationFields || [];
    
    // Check if all required fields are filled
    const missingFields = validationFields.filter(field => !validationValues[field]?.trim());
    if (missingFields.length > 0) {
      setValidationResult({ 
        status: false, 
        message: `Please fill in: ${missingFields.join(', ')}` 
      });
      return;
    }

    // Map the dynamic validation fields to API expected fields
    // The backend expects: playerId, serverId, gameId
    // The validationFields from backend could be: userId, serverId, etc.
    const getPlayerId = () => {
      // Check for userId or similar field names
      return validationValues.userId || validationValues.UserId || validationValues.playerId || validationValues.PlayerId || '';
    };

    const getServerId = () => {
      // Check for serverId or similar field names
      return validationValues.serverId || validationValues.ServerId || '';
    };

    const playerId = getPlayerId();
    const serverId = getServerId();

    if (!playerId) {
      setValidationResult({ status: false, message: 'Player ID is required for validation.' });
      return;
    }

    setValidationLoading(true);
    setValidationResult(null);
    
    try {
      // Build the request payload
      const payload = {
        playerId: playerId,
        gameId: gameInfo._id,
      };

      // Only include serverId if it's provided (some games may not require it)
      if (serverId) {
        payload.serverId = serverId;
      }

      // Call the backend API directly
      const response = await fetch('https://api.cptopup.in/api/v1/games/validate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      console.log('Validation result:', result);
      
      // Handle response from API
      // Response format: { valid, name, server, msg, authenticated }
      if (result.valid === true) {
        setValidationResult({ 
          status: true, 
          message: result.msg || 'User validated successfully!', 
          username: result.name 
        });
      } else {
        setValidationResult({ 
          status: false, 
          message: result.msg || 'Invalid User ID or Server ID' 
        });
      }
    } catch (err) {
      console.error('Validation error:', err);
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
    <div className="min-h-screen w-screen bg-primary">
      <div className="max-w-7xl mx-auto px-4 py-6">

      {/* <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 shadow-xl bg-clip-text text- mb-2">
              DIAMOND STORE
            </h1>
            <div className="w-28 h-1 bg-gradient-to-r from-[#FCF3A4] to-gray-300 mx-auto rounded-full"></div>
          </div> */}


        {/* Game Data Section */}
        {gameInfo && (
          <div className="px-2 mb-10">
            <div className="bg-linear-to-r from-[#FCF3A4] to-primary border-[3px] border-black rounded-[2rem] p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
              
              {/* Game Image */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border-[3px] border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary/10">
                  <img 
                    src={gameInfo.image} 
                    alt={gameInfo.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Game Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                  <h2 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight">
                    {gameInfo.name}
                  </h2>
                  <div className="bg-black text-primary px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] self-center md:self-auto">
                    {gameInfo.publisher}
                  </div>
                </div>
                
                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {[
                    { icon: Zap, text: 'Instant' },
                    { icon: Shield, text: 'Secure' },
                    { icon: Headphones, text: '24/7 Support' },
                    { icon: DollarSign, text: 'Best Price' }
                  ].map((feature, i) => (
                    <span key={i} className="bg-primary/10 border-2 border-black/5 px-2.5 py-1 rounded-xl text-[9px] font-black text-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-3 h-3" />
                      {feature.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Gaming Header with Glow Effect */}
        <div className="px-2 mb-8">
          <div className="bg-[#FCF3A4] border-[3px] border-black rounded-[2rem] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-black/5 rounded-full -mr-12 -mt-12"></div>
            
            <div className="text-black text-lg md:text-xl font-black mb-5 flex items-center gap-3 relative z-10 uppercase tracking-tight">
              <div className="w-1.5 h-6 bg-black rounded-full"></div>
              Verify Account
            </div>
            <div className="mb-5 relative z-10 space-y-3.5">
              {gameInfo?.validationFields?.map(field => (
                <div key={field}>
                  <label className="block text-black font-black text-[10px] uppercase tracking-widest mb-1.5 px-1" htmlFor={field}>
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <input
                    id={field}
                    type="text"
                    value={validationValues[field] || ''}
                    onChange={e => setValidationValues(vals => ({ ...vals, [field]: e.target.value }))}
                    placeholder={`ENTER ${field.replace(/([A-Z])/g, ' $1').toUpperCase()}`}
                    className="w-full bg-white text-black font-bold placeholder:text-black/20 rounded-xl px-4 py-3 border-[2.5px] border-black focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  />
                </div>
              ))}
            </div>
            <button
              className="w-full bg-black text-primary font-black py-4 rounded-xl shadow-[0_6px_0_0_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-1 active:translate-y-2 transition-all duration-150 uppercase tracking-[0.2em] relative z-10 text-sm"
              onClick={handleValidateUser}
              disabled={validationLoading}
            >
              {validationLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                  <span>VALIDATING...</span>
                </div>
              ) : (
                "VALIDATE NOW"
              )}
            </button>
            {validationResult && (
              <div className={`mt-5 p-3.5 rounded-xl border-[2.5px] relative z-10 flex flex-col gap-1 ${validationResult.status === true ? "bg-green-50 border-green-500 text-green-700 shadow-[3px_3px_0px_0px_rgba(34,197,94,0.2)]" : "bg-red-50 border-red-500 text-red-700 shadow-[3px_3px_0px_0px_rgba(239,68,68,0.2)]"}`}>
                <div className="flex items-center gap-2 font-black uppercase text-xs">
                  <FaCheckCircle className={validationResult.status === true ? "text-green-500" : "text-red-500"} />
                  {validationResult.message}
                </div>
                {validationResult.username && (
                  <div className="font-black mt-0.5 text-black uppercase text-base tracking-tight">Username: {validationResult.username}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Select Amount Section Title with How to Purchase Button */}
        <div className="px-2 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-black rounded-full"></div>
              <h2 className="text-lg md:text-xl font-black text-black uppercase tracking-tight">
                Select Diamond Pack
              </h2>
            </div>
            <button
              onClick={() => setShowHowToPurchase(true)}
              className="bg-black text-primary px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              How to Purchase
            </button>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="px-2 mb-4">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-300 border-2 ${
                  selectedCategory === null
                    ? 'bg-black text-primary border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white/40 text-gray-800 border-transparent hover:bg-white/60'
                }`}
              >
                All Packs
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-300 border-2 ${
                    selectedCategory === category
                      ? 'bg-black text-primary border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white/40 text-gray-800 border-transparent hover:bg-white/60'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Diamond Packs Selectable Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4 mb-6">
          {filteredPacks.map((pack) => {
            const isSelected = selectedPack === pack._id
            return (
              <div
                key={pack._id}
                className="relative"
                onClick={() => setSelectedPack(pack._id)}
              >
                <div
                  className={`relative h-full flex flex-col items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-300 transform border-2 ${
                    isSelected
                      ? 'bg-primary border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                      : 'bg-[#FCF3A4] border-transparent hover:border-black/10 hover:-translate-y-0.5'
                  }`}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 bg-black text-primary p-0.5 rounded-full shadow-md z-10">
                      <FaCheckCircle className="text-sm" />
                    </div>
                  )}

                  {/* Pack Logo */}
                  {pack.logo && (
                    <div className="mb-2 relative transition-transform duration-300">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center overflow-hidden ${isSelected ? 'bg-black/5' : 'bg-black/5'}`}>
                        <img 
                          src={pack.logo} 
                          alt={pack.description}
                          className="w-full h-full object-contain p-1.5"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Pack Info */}
                  <div className="text-center w-full mt-auto">
                    <div className={`font-bold text-xs md:text-sm mb-0.5 line-clamp-2 ${isSelected ? 'text-black' : 'text-gray-800'}`}>
                      {pack.description}
                    </div>
                    <div className={`text-lg md:text-xl font-black ${isSelected ? 'text-black' : 'text-gray-900'}`}>
                      ₹{pack.amount}
                    </div>
                  </div>

                  {/* Bonus Tag */}
                  {pack.description.toLowerCase().includes('bonus') && (
                    <div className="absolute top-1.5 left-1.5">
                      <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        Bonus
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Payment Section */}
        {selectedPack && (
          <div className="w-full max-w-xl mx-auto mt-6 mb-12 space-y-4">
            {/* Payment Selection Card */}
            <div className="rounded-2xl bg-[#FCF3A4] p-5 shadow-xl border-2 border-black/5">
              <h3 className="text-black text-sm font-black mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-black rounded-full"></div>
                SELECT PAYMENT METHOD
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* UPI Payment Option */}
                <button
                  onClick={() => setSelectedPaymentMethod('upi')}
                  className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-300 ${
                    selectedPaymentMethod === 'upi'
                      ? 'bg-primary border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-[1.02]'
                      : 'bg-white border-black/5 hover:border-black/10'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${selectedPaymentMethod === 'upi' ? 'bg-black text-primary' : 'bg-black/10 text-black'}`}>
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor">
                      <rect x="2" y="4" width="20" height="14" rx="2" strokeWidth="2"/>
                      <path d="M2 10h20" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className={`font-bold uppercase tracking-wider text-[10px] ${selectedPaymentMethod === 'upi' ? 'text-black' : 'text-black/60'}`}>UPI</span>
                  {selectedPaymentMethod === 'upi' && (
                    <div className="absolute top-1.5 right-1.5">
                      <FaCheckCircle className="text-black text-sm" />
                    </div>
                  )}
                </button>

                {/* CP Coins Payment Option */}
                <button
                  onClick={() => setSelectedPaymentMethod('cp-coins')}
                  className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-300 ${
                    selectedPaymentMethod === 'cp-coins'
                      ? 'bg-primary border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-[1.02]'
                      : 'bg-white border-black/5 hover:border-black/10'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs ${selectedPaymentMethod === 'cp-coins' ? 'bg-black text-primary' : 'bg-black/10 text-black'}`}>
                    CP
                  </div>
                  <span className={`font-bold uppercase tracking-wider text-[10px] ${selectedPaymentMethod === 'cp-coins' ? 'text-black' : 'text-black/60'}`}>CP Coins</span>
                  {selectedPaymentMethod === 'cp-coins' && (
                    <div className="absolute top-1.5 right-1.5">
                      <FaCheckCircle className="text-black text-sm" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Buy Now Card */}
            {selectedPaymentMethod && (
              <div className="rounded-2xl bg-white p-5 shadow-xl border-[3px] border-black mb-24 transform transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="text-black/50 text-[10px] font-bold uppercase tracking-widest mb-0.5">Total Payable</div>
                    <div className="text-black text-3xl font-black flex items-center gap-0.5">
                      <span className="text-xl mt-0.5">₹</span>
                      {diamondPacks.find(p => p._id === selectedPack)?.amount}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-black/50 text-[10px] font-bold uppercase tracking-widest mb-0.5">Payment via</div>
                    <div className="bg-black text-primary px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest">
                      {selectedPaymentMethod === 'upi' ? 'UPI' : 'CP COINS'}
                    </div>
                  </div>
                </div>
                
                <button 
                  className="w-full py-3.5 rounded-xl bg-black text-primary font-black text-lg tracking-[0.15em] shadow-[0_6px_0_0_rgba(0,0,0,0.15)] hover:shadow-none hover:translate-y-0.5 transition-all duration-150 transform disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3" 
                  onClick={handleCreateOrder} 
                  disabled={orderLoading || upiLoading}
                >
                  {(orderLoading || upiLoading) ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                      <span className="text-sm">PROCESSING...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm">PROCEED TO PAY</span>
                      <FaBolt className="text-primary text-sm group-hover:animate-pulse" />
                    </>
                  )}
                </button>
                <p className="text-center text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-3">
                  Secure Encrypted Transaction
                </p>
              </div>
            )}
          </div>
        )}

        {filteredPacks.length === 0 && !loading && (
          <div className="flex items-center justify-center flex-1 px-4">
            <div className="text-center text-gray-800 opacity-70">
              <div className="text-xl md:text-2xl mb-2">
                {selectedCategory 
                  ? `No packs available in "${selectedCategory}" category` 
                  : 'No diamond packs available'}
              </div>
              <div className="text-sm md:text-base">
                {selectedCategory 
                  ? 'Try selecting a different category' 
                  : 'Check back later for new packs'}
              </div>
            </div>
          </div>
        )}

        {/* How to Purchase Modal */}
        {showHowToPurchase && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-100 p-4">
            <div className="bg-white border-[6px] border-black rounded-[2.5rem] p-6 md:p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-black rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight">
                    How to Purchase
                  </h2>
                </div>
                <button
                  onClick={() => setShowHowToPurchase(false)}
                  className="bg-black text-primary w-10 h-10 rounded-full flex items-center justify-center hover:rotate-90 transition-transform"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              {/* MLBB Purchasing Guide Image */}
              <div className="flex justify-center mb-8">
                <div className="relative max-w-full border-4 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
                  <img 
                    src="/mlbb purchasing guide.jpg" 
                    alt="MLBB Purchasing Guide"
                    className="w-full h-auto max-h-[60vh] object-contain"
                    onError={(e) => {
                      console.error('Failed to load MLBB purchasing guide image');
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-primary border-4 border-black rounded-3xl p-6 mb-8 text-center">
                <p className="text-black font-black uppercase text-sm md:text-base tracking-widest leading-relaxed">
                  📱 FOLLOW THE GUIDE ABOVE TO COMPLETE YOUR PURCHASE SUCCESSFULLY!
                </p>
              </div>
              
              <button
                onClick={() => setShowHowToPurchase(false)}
                className="w-full bg-black text-primary py-5 rounded-2xl font-black text-xl uppercase tracking-[0.2em] shadow-[0_8px_0_0_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-1 active:translate-y-2 transition-all"
              >
                GOT IT!
              </button>
            </div>
          </div>
        )}

        {upiModalOpen && upiTransaction && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-white border-[6px] border-black rounded-[2.5rem] p-8 max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-300">
              <button
                className="absolute -top-4 -right-4 w-12 h-12 flex items-center justify-center bg-black text-primary rounded-full border-[3px] border-white shadow-lg hover:rotate-90 transition-transform duration-300 z-10"
                onClick={() => setUpiModalOpen(false)}
              >
                <FaTimes className="text-xl" />
              </button>
              
              <div className="text-center">
                <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-tight">Scan & Pay</h2>
                
                <div className="flex flex-col items-center mb-8">
                  <div className="p-3 bg-white border-4 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] mb-4">
                    <img
                      src={upiTransaction.paymentUrl}
                      alt="UPI QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <span className="text-black/50 font-black text-[10px] uppercase tracking-widest">Scan with any UPI app</span>
                </div>

                <div className="mb-8">
                  <div className="text-black font-black text-xs uppercase tracking-widest mb-4">Quick Links</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { link: upiTransaction.upiIntent?.gpay_link, label: 'GPay' },
                      { link: upiTransaction.upiIntent?.phonepe_link, label: 'PhonePe' },
                      { link: upiTransaction.upiIntent?.paytm_link, label: 'Paytm' },
                      { link: upiTransaction.upiIntent?.bhim_link, label: 'BHIM' }
                    ].filter(app => app.link).map((app, i) => (
                      <a 
                        key={i}
                        href={app.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-4 py-3 rounded-xl bg-black/5 border-2 border-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-primary transition-all"
                      >
                        {app.label}
                      </a>
                    ))}
                  </div>
                </div>

                <button
                  className="w-full py-4 rounded-xl bg-black text-primary font-black text-lg uppercase tracking-widest shadow-[0_6px_0_0_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-1 active:translate-y-2 transition-all"
                  onClick={() => {
                    setUpiModalOpen(false);
                    if (upiOrder?.id) router.push(`/status?orderId=${upiOrder.id}`);
                  }}
                >
                  Payment Done
                </button>
                <p className="text-[10px] text-black/30 font-black uppercase tracking-widest mt-4 text-center">
                  Click after completion
                </p>
              </div>
            </div>
          </div>
        )}

        <BottomNavbar />
      </div>
    </div>
  )
}