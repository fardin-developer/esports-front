"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { apiClient } from '../../apiClient'
import BottomNavbar from '../../components/BottomNavbar'
import { FaBolt } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { fetchWalletBalance } from '../../features/auth/authSlice'
import React from 'react';
import { useRouter } from 'next/navigation';

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
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-text text-lg">Loading...</div>
      </div>
    )
  }

  // Remove handleBuyNow and update Buy Now button to use handleCreateOrder
  // const handleBuyNow = async () => {
  //   if (!selectedPack) return;
  //   // Add your order creation logic here
  //   try {
  //     // Example: replace with your actual API call
  //     const res = await apiClient.post(`/order/create`, {
  //       gameId,
  //       packId: selectedPack,
  //       ...validationValues,
  //     })
  //     if (res.success) {
  //       // Order created, update wallet balance
  //       dispatch(fetchWalletBalance())
  //       // Optionally show success message
  //     } else {
  //       // Optionally show error
  //     }
  //   } catch (e) {
  //     // Optionally show error
  //   }
  // }

  const handleValidateUser = async () => {
    if (!selectedPack) {
      setValidationResult({ status: false, message: "Please select a diamond pack first." });
      return;
    }
    // Find the selected pack object
    const pack = diamondPacks.find(p => p._id === selectedPack);
    console.log(pack);
    if (!pack) {
      setValidationResult({ status: false, message: "Invalid pack selected." });
      return;
    }
    // Use gameInfo._id for validation
    if (!gameInfo?._id) {
      setValidationResult({ status: false, message: 'No game_id found for this game. Cannot validate user.' });
      return;
    }
    // Prepare data for validation API
    const data = {
      "product-id": String(gameInfo._id),
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
    // console.log(data);
    
    try {
      // Use apiClient.post to call the validation API
      const result = await apiClient.post('/moogold/product/validate', {
        path: 'product/validate',
        data
      });
      let status = result.success;
      let message = result.message;
      let username = result.username;
      if (result.data && typeof result.data.status !== 'undefined') {
        status = result.data.status === 'true' || result.data.status === true;
        message = result.data.message || message;
        username = result.data.username || username;
      }
      const validationObj = { status, message, username };
      // console.log('validationResult:', validationObj);
      setValidationResult(validationObj);
    } catch (err) {
      setValidationResult({ status: false, message: "Validation failed. Please try again." });
    } finally {
      setValidationLoading(false);
    }
  };

  // Create Order handler (updated for /api/v1/order/diamond-pack)
  const handleCreateOrder = async () => {
    if (!selectedPack) return;
    const pack = diamondPacks.find(p => p._id === selectedPack);
    if (!pack) return;
  
    // Remove productId check since it's not in the new response format
    // const productId = pack.apiMappings && pack.apiMappings.length > 0 ? pack.apiMappings[0].productId : undefined;
    // if (!productId) {
    //   setOrderResult({ success: false, message: 'No productId found for this pack. Cannot create order.' });
    //   return;
    // }
  
    setOrderLoading(true);
    setOrderResult(null);
  
    try {
      const payload = {
        diamondPackId: pack._id,
        // Remove productId from payload since it's not available in new format
        // productId: productId,
        playerId: validationValues.userId || validationValues.UserId || validationValues['User ID'],
        server: validationValues.serverId || validationValues.ServerId || validationValues['Server ID'],
        quantity: 1,
      };
  
      const result = await apiClient.post('/order/diamond-pack', payload);
      const orderId = result.externalApiResponse.partnerOrderId
      console.log(orderId);
      setOrderResult(result);
      console.log("2 ");
      
  
      if (result.success && orderId) {
        dispatch(fetchWalletBalance());
  
        // ✅ Navigate to the order page with order ID
        router.push(`/status?orderId=${orderId}`);
      }
    } catch (err) {
      setOrderResult({ success: false, message: 'Order creation failed. Please try again.' });
    } finally {
      setOrderLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col pb-24 relative pt-6 bg-bg w-full max-w-7xl mx-auto">
      {/* Check User ID Section */}
      <div className="px-4 mb-8">
        <div className="text-text text-lg md:text-xl font-bold mb-4">CHECK USER ID</div>
        <div className="mb-4">
          {gameInfo?.validationFields?.map(field => (
            <div key={field} className="mb-4">
              <label className="block text-gray font-semibold mb-1" htmlFor={field}>
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <input
                id={field}
                type="text"
                value={validationValues[field] || ''}
                onChange={e => setValidationValues(vals => ({ ...vals, [field]: e.target.value }))}
                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
                className="w-full bg-[#23272f] text-white placeholder:text-text/40 rounded-lg px-4 py-3 mb-4 border border-border focus:outline-none focus:border-primary transition"
              />
            </div>
          ))}
        </div>
        <button
          className="w-full bg-gradient-to-r from-primary to-blue-500 text-white font-semibold py-3 rounded-xl shadow-md hover:from-blue-500 hover:to-primary transition-all duration-300"
          onClick={handleValidateUser}
          disabled={validationLoading}
        >
          {validationLoading ? "Validating..." : "Validate Now"}
        </button>
        {validationResult && (
          <div className={`mt-2 text-sm ${validationResult.status === true ? "text-green-400" : "text-red-400"}`}>
            {validationResult.message}
            {validationResult.username && (
              <div className="font-bold">Username: {validationResult.username}</div>
            )}
          </div>
        )}
      </div>

      {/* Select Amount Section Title */}
      <div className="px-4 mb-4">
        <div className="text-text text-lg md:text-xl font-bold mb-2">SELECT THE AMOUNT YOU WANT TO BUY</div>
      </div>

      {/* Diamond Packs Selectable Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-4 mb-8">
        {diamondPacks.map((pack) => {
          const isSelected = selectedPack === pack._id
          return (
            <div
              key={pack._id}
              className={`relative flex flex-col justify-between bg-[#23272f] rounded-2xl p-4 border-2 transition-all duration-200 cursor-pointer min-h-[90px] ${isSelected ? 'border-primary shadow-lg' : 'border-border hover:border-primary'}`}
              onClick={() => setSelectedPack(pack._id)}
            >
              {/* Green Lightning Icon */}
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 bg-opacity-20">
                  <FaBolt className="text-green-400 text-lg" />
                </span>
              </div>
              {/* Radio Circle */}
              <div className="absolute top-3 left-3">
                <span className={`inline-block w-5 h-5 rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-border bg-bg'}`}></span>
              </div>
              {/* Pack Info */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-text font-semibold text-base md:text-lg mb-1">
                {pack.description} 
                {/* this is actual number of diamons */}
                </div>
                <div className="text-primary font-bold text-lg md:text-xl mb-1">₹ {pack.amount}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Payment Section */}
      <div className="w-full max-w-xl mx-auto mt-4 mb-8">
        <div className="rounded-2xl border border-border bg-surface-light/80 backdrop-blur-md shadow-lg p-4 md:p-6 flex flex-col gap-6">
          {/* Payment Option */}
          {/* <div>
            <div className="text-white text-lg font-bold mb-4 text-center tracking-wide">SELECT PAYMENT OPTION</div>
            <div className="flex gap-4 justify-center">
              <button className="flex-1 min-w-0 rounded-xl border-2 border-primary/30 bg-surface py-4 px-2 flex flex-col items-center gap-2 transition-all duration-200 hover:border-primary focus:border-primary outline-none">
                <span className="flex items-center gap-2 text-2xl mb-1">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo4x8kSTmPUq4PFzl4HNT0gObFuEhivHOFYg&s" alt="UPI" className="w-6 h-6" />
                  <img src="https://i.pinimg.com/736x/76/a8/17/76a81707455d435794782797a7fedf67.jpg" alt="GPay" className="w-6 h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/UPI-Logo.png" alt="PhonePe" className="w-6 h-6" />
                </span>
                <span className="text-text font-semibold text-base">GPay,Phonepe,UPI</span>
              </button>
              <button className="flex-1 min-w-0 rounded-xl border-2 border-border bg-surface py-4 px-2 flex flex-col items-center gap-2 transition-all duration-200 hover:border-primary focus:border-primary outline-none">
                <span className="flex items-center gap-2 text-2xl mb-1">
                  <img src="/wallet.svg" alt="Wallet" className="w-6 h-6" />
                </span>
                <span className="text-text font-semibold text-base">Wallet</span>
                <span className="text-text-muted text-xs">Balance: ₹0</span>
              </button>
            </div>
          </div> */}
          {/* Payment Summary */}
          {/* <div className="rounded-xl border border-border bg-surface p-4">
            <div className="text-white font-bold mb-2 text-base">PAYMENT SUMMARY</div>
            <div className="border-t border-border mb-2"></div>
            <div className="text-text-muted text-sm">Select a service and payment method to see details</div>
          </div> */}
          {/* Buy Now Button */}
          <button className="w-full py-3 rounded-xl bg-primary text-white font-bold text-lg tracking-wide shadow-lg hover:bg-primary-dark transition-all duration-200" onClick={handleCreateOrder} disabled={orderLoading}>
            {orderLoading ? "Processing..." : "BUY NOW"}
          </button>
        </div>
      </div>

      {diamondPacks.length === 0 && !loading && (
        <div className="flex items-center justify-center flex-1 px-4">
          <div className="text-center text-text opacity-70">
            <div className="text-xl md:text-2xl mb-2">No diamond packs available</div>
            <div className="text-sm md:text-base">Check back later for new packs</div>
          </div>
        </div>
      )}

      <BottomNavbar />
    </div>
  )
} 