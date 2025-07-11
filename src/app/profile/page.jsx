'use client'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const userMobile = useSelector((state) => state.auth.userMobile)
  // Placeholder values for name/email
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('johndoe@email.com')
  const balance = 1250.75
  const [showEdit, setShowEdit] = useState(false)
  const [avatar, setAvatar] = useState(null)

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]))
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-black">
      {/* Profile Card */}
      <div className="w-full max-w-sm rounded-2xl shadow-lg border p-6 flex flex-col items-center mb-6"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <div className="relative w-24 h-24 mb-4">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4" style={{ borderColor: 'var(--color-primary)' }} />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'var(--color-bg)' }}>
              {userMobile ? userMobile.slice(-2) : '👤'}
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-full p-2 cursor-pointer shadow" title="Change avatar">
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
          </label>
        </div>
        <div className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text)', fontFamily: 'Sora, var(--font-sans), sans-serif' }}>{name}</div>
        <div className="text-sm mb-1" style={{ color: 'var(--color-text)', opacity: 0.7 }}>{email}</div>
        <div className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>+91 {userMobile}</div>
      </div>

      {/* Wallet Balance Card */}
      <div className="w-full max-w-sm rounded-2xl shadow-md flex flex-col items-center py-6 mb-8 border-2"
        style={{ background: 'linear-gradient(90deg, var(--color-secondary), var(--color-primary))', borderColor: 'var(--color-secondary)' }}>
        <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-bg)', fontFamily: 'Sora, var(--font-sans), sans-serif' }}>${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        <div className="text-sm font-semibold tracking-wide" style={{ color: 'var(--color-bg)' }}>Wallet Balance</div>
        <button className="mt-4 px-6 py-2 rounded-lg font-semibold text-base shadow border transition-all duration-300"
          style={{ background: 'var(--color-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
          Add Money
        </button>
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm flex flex-col gap-4 mb-8">
        <button className="w-full py-3 rounded-xl font-semibold text-base border transition-all duration-300"
          style={{ background: 'var(--color-card)', color: 'var(--color-primary)', borderColor: 'var(--color-border)' }}
          onClick={() => setShowEdit(true)}>
          Edit Profile
        </button>
        <button className="w-full py-3 rounded-xl font-semibold text-base border transition-all duration-300"
          style={{ background: 'var(--color-card)', color: 'var(--color-accent)', borderColor: 'var(--color-border)' }}>
          Change Password
        </button>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="w-full max-w-sm mb-8">
        <div className="text-lg font-semibold mb-2" style={{ color: 'var(--color-primary)', fontFamily: 'Sora, var(--font-sans), sans-serif' }}>Recent Activity</div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 text-sm text-[var(--color-text)] opacity-70 text-center">
          No recent activity yet.
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full max-w-sm py-3 rounded-xl font-semibold text-base shadow-md transition-all duration-300"
        style={{ background: 'linear-gradient(90deg, var(--color-accent), #ff1744)', color: 'var(--color-bg)' }}
      >
        Logout
      </button>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)', fontFamily: 'Sora, var(--font-sans), sans-serif' }}>Edit Profile</div>
            <form onSubmit={e => { e.preventDefault(); setShowEdit(false); }} className="flex flex-col gap-4">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Name"
                style={{ fontFamily: 'Manrope, var(--font-sans), sans-serif' }}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Email"
                style={{ fontFamily: 'Manrope, var(--font-sans), sans-serif' }}
              />
              <div className="flex gap-2 mt-2">
                <button type="submit" className="flex-1 py-2 rounded-lg font-semibold" style={{ background: 'var(--color-primary)', color: 'var(--color-bg)' }}>Save</button>
                <button type="button" className="flex-1 py-2 rounded-lg font-semibold" style={{ background: 'var(--color-card)', color: 'var(--color-accent)' }} onClick={() => setShowEdit(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 