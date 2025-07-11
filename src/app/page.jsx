'use client'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

import Hero from './components/Hero'
import GamesSection from './components/gameSection'




export default function RootPage() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/home')
    }
  }, [isLoggedIn, router])

  return (
    <>
      <Hero />
      <GamesSection />

    </>
  )
}