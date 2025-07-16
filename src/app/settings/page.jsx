"use client"
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWalletBalance } from '../features/auth/authSlice'
import { apiClient } from '../apiClient'

const generalOptions = [
  { icon: '🛒', label: 'My Orders', href: '/orders' },
  { icon: '🏠', label: 'My Address', href: '/address' },
  { icon: '✏️', label: 'Edit Profile', href: '/edit-profile' },
  { icon: '🔒', label: 'Change Password', href: '/change-password' },
]

const aboutOptions = [
  { icon: '🏢', label: 'About Company', href: '/about' },
  { icon: '📄', label: 'Privacy Policy', href: '/privacy-policy' },
  { icon: '📜', label: 'Terms & Conditions', href: '/terms' },
]

export default function SettingsPage() {
  const balance = useSelector((state) => state.auth.balance)
  const dispatch = useDispatch()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    status: '',
  })

  useEffect(() => {
    dispatch(fetchWalletBalance())
  }, [dispatch])

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiClient.get('/user/me')
        setProfile({
          name: data.name || '',
          email: data.email || '',
          avatar: data.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
          status: data.status || 'check',
        })
      } catch (e) {
        // fallback or error handling
      }
    }
    fetchProfile()
  }, [])

  return (
    <main className="min-h-screen bg-bg py-4 px-2 md:px-0">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        {/* Profile Card */}
        <div className="rounded-2xl bg-surface-light border border-border shadow-md p-5 flex items-center gap-4 relative mt-2">
          <img src={profile.avatar} alt="avatar" className="w-16 h-16 rounded-full border-2 border-primary object-cover" />
          <div className="flex-1">
            <div className="font-semibold text-lg text-text mb-0.5">{profile.name}</div>
            <div className="text-sm text-text-muted mb-1">{profile.email}</div>
            <span className="inline-block text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{profile.status}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-text-muted">Balance</span>
            <span className="font-bold text-primary text-lg">${balance.toFixed(2)}</span>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center justify-between rounded-xl bg-surface border border-border px-2 py-2 text-sm font-medium">
          <button className="flex-1 py-2 rounded-lg text-primary bg-surface-light">Settings</button>
          <button className="flex-1 py-2 rounded-lg text-text hover:bg-surface-light transition">Payment</button>
          <button className="flex-1 py-2 rounded-lg text-text hover:bg-surface-light transition">Notification</button>
        </div>

        {/* General Section */}
        <section className="rounded-2xl bg-surface border border-border shadow p-0 overflow-hidden">
          <div className="px-5 pt-4 pb-2 text-xs font-bold text-text-muted tracking-widest">GENERAL</div>
          <ul>
            {generalOptions.map((opt, i) => (
              <li key={opt.label} className={`flex items-center px-5 py-4 text-text text-base border-b border-border last:border-b-0 cursor-pointer hover:bg-surface-light transition`}> 
                <span className="mr-4 text-lg">{opt.icon}</span>
                <span className="flex-1">{opt.label}</span>
                <span className="text-text-muted">›</span>
              </li>
            ))}
          </ul>
        </section>

        {/* About & Terms Section */}
        <section className="rounded-2xl bg-surface border border-border shadow p-0 overflow-hidden">
          <div className="px-5 pt-4 pb-2 text-xs font-bold text-text-muted tracking-widest">ABOUT & TERMS</div>
          <ul>
            {aboutOptions.map((opt, i) => (
              <li key={opt.label} className={`flex items-center px-5 py-4 text-text text-base border-b border-border last:border-b-0 cursor-pointer hover:bg-surface-light transition`}> 
                <span className="mr-4 text-lg">{opt.icon}</span>
                <span className="flex-1">{opt.label}</span>
                <span className="text-text-muted">›</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Notifications Section */}
        <section className="rounded-2xl bg-surface border border-border shadow p-0 overflow-hidden">
          <div className="px-5 pt-4 pb-2 text-xs font-bold text-text-muted tracking-widest">NOTIFICATIONS</div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <span className="text-text">Shop Updates</span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-10 h-6 bg-surface-light border border-border rounded-full peer peer-checked:bg-primary relative transition">
                <div className="absolute left-1 top-1 w-4 h-4 bg-bg rounded-full transition peer-checked:translate-x-4"></div>
              </div>
            </label>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-text">Notifications</span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-6 bg-surface-light border border-border rounded-full peer peer-checked:bg-primary relative transition">
                <div className="absolute left-1 top-1 w-4 h-4 bg-bg rounded-full transition peer-checked:translate-x-4"></div>
              </div>
            </label>
          </div>
        </section>
      </div>
    </main>
  )
}