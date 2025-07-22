"use client"
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { 
  ShoppingBag, 
  Home, 
  UserPen, 
  Building2, 
  Shield, 
  FileText, 
  Users, 
  Mail,
  LogOut 
} from 'lucide-react'

import { fetchWalletBalance } from '../features/auth/authSlice'
import { apiClient } from '../apiClient'

const generalOptions = [
  { icon: ShoppingBag, label: 'My Orders', href: '/orders' },
  { icon: Home, label: 'My Address', href: '/address' },
  { icon: UserPen, label: 'Edit Profile', href: '/edit-profile' },
]

const aboutOptions = [
  { icon: Building2, label: 'About Company', href: '/about-us' },
  { icon: Shield, label: 'Privacy Policy', href: '/privacy-policy' },
  { icon: FileText, label: 'Website Terms & Conditions', href: '/terms-website' },
  { icon: Users, label: 'User Terms & Conditions', href: '/user-terms' },
  { icon: Mail, label: 'Contact Us', href: '/contact-us' },
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
          avatar: data?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
          status: data.status || 'check',
        })
      } catch (e) {
        // fallback or error handling
      }
    }
    fetchProfile()
  }, [])
  const router = useRouter()

  return (
    <main className="min-h-screen bg-bg py-4 px-2 md:px-0">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        {/* Profile Card */}
        <div className="rounded-2xl bg-surface-light border border-border shadow-md p-5 flex items-center gap-4 relative mt-2">
          <img
            src={profile?.avatar?.trim() ? profile.avatar : 'https://randomuser.me/api/portraits/lego/1.jpg'}
            alt="avatar"
            className="w-16 h-16 rounded-full border-2 border-primary object-cover"
          />
          <div className="flex-1">
            <div className="font-semibold text-lg text-text mb-0.5">{profile.name}</div>
            <div className="text-sm text-text-muted mb-1">{profile.email}</div>
            <span className="inline-block text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{profile.status}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-text-muted">Balance</span>
            <span className="font-bold text-primary text-lg">{balance.toFixed(2)}</span>
          </div>
        </div>

        {/* General Section */}
        <section className="rounded-2xl bg-surface border border-border shadow p-0 overflow-hidden">
          <div className="px-5 pt-4 pb-2 text-xs font-bold text-text-muted tracking-widest">GENERAL</div>
          <ul>
            {generalOptions.map((opt, i) => {
              const IconComponent = opt.icon
              return (
                <li
                  key={opt.label}
                  onClick={() => router.push(opt.href)}
                  className="flex items-center px-5 py-4 text-text text-base border-b border-border last:border-b-0 cursor-pointer hover:bg-surface-light transition"
                >
                  <IconComponent className="mr-4 w-5 h-5 text-primary" />
                  <span className="flex-1">{opt.label}</span>
                  <span className="text-text-muted">›</span>
                </li>
              )
            })}
          </ul>
        </section>

        {/* About & Terms Section */}
        <section className="rounded-2xl bg-surface border border-border shadow p-0 overflow-hidden">
          <div className="px-5 pt-4 pb-2 text-xs font-bold text-text-muted tracking-widest">ABOUT & TERMS</div>
          <ul>
            {aboutOptions.map((opt, i) => {
              const IconComponent = opt.icon
              return (
                <li
                  key={opt.label}
                  onClick={() => router.push(opt.href)}
                  className="flex items-center px-5 py-4 text-text text-base border-b border-border last:border-b-0 cursor-pointer hover:bg-surface-light transition"
                >
                  <IconComponent className="mr-4 w-5 h-5 text-primary" />
                  <span className="flex-1">{opt.label}</span>
                  <span className="text-text-muted">›</span>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Logout Section */}
        <section className="rounded-2xl bg-surface border border-border shadow p-0 overflow-hidden">
          <button
            className="w-full flex items-center px-5 py-4 text-red-600 text-base font-semibold cursor-pointer hover:bg-red-50 transition border-0 bg-transparent outline-none"
            onClick={async () => {
              try {
                await apiClient.post('/user/logout')
                setProfile({ name: '', email: '', avatar: '', status: '' })
                dispatch({ type: 'auth/logout' })
                window.location.href = '/login'
              } catch (e) {
                // handle error (optional)
              }
            }}
          >
            <LogOut className="mr-4 w-5 h-5" />
            <span className="flex-1">Logout</span>
          </button>
        </section>
      </div>
    </main>
  )
}