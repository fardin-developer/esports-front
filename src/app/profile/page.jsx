'use client'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const userMobile = useSelector((state) => state.auth.userMobile)
  // Placeholder values for name/email
  const name = 'John Doe'
  const email = 'johndoe@email.com'
  // You can get balance from Redux or hardcode for now
  const balance = 1250.75

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] flex flex-col items-center px-4 py-8">
      {/* Profile Card */}
      <div className="w-full max-w-sm bg-[rgba(255,255,255,0.04)] rounded-2xl shadow-lg border border-[rgba(100,255,218,0.12)] p-6 flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#64ffda] to-[#00bcd4] flex items-center justify-center text-4xl font-bold text-[#0f0f23] mb-4">
          {userMobile ? userMobile.slice(-2) : '👤'}
        </div>
        <div className="text-xl font-semibold text-white mb-1">{name}</div>
        <div className="text-sm text-white/70 mb-1">{email}</div>
        <div className="text-sm text-white/70">+91 {userMobile}</div>
      </div>

      {/* Wallet Balance Card */}
      <div className="w-full max-w-sm bg-gradient-to-r from-[#ffd700] to-[#ffb300] rounded-2xl shadow-md flex flex-col items-center py-6 mb-8 border-2 border-[#ffe082]">
        <div className="text-3xl font-bold text-[#0f0f23] mb-2">${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        <div className="text-sm font-semibold text-[#0f0f23] tracking-wide">Wallet Balance</div>
      </div>

      {/* Options (future: edit profile, etc.) */}
      <div className="w-full max-w-sm flex flex-col gap-4 mb-8">
        <button className="w-full py-3 bg-[rgba(100,255,218,0.08)] text-[#64ffda] rounded-xl font-semibold text-base border border-[rgba(100,255,218,0.2)] hover:bg-[rgba(100,255,218,0.15)] transition-all duration-300">
          Edit Profile
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full max-w-sm py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl font-semibold text-base shadow-md hover:from-red-500 hover:to-red-600 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  )
} 