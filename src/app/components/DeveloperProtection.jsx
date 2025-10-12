"use client"
import { useState, useEffect } from 'react'
import { Shield, Clock } from 'lucide-react'

// Maintenance Page Component
function MaintenancePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 10000)

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) return 850
        return prev + Math.random() * 2
      })
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(progressTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl text-center">
          {/* Header */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            System Migration in Progress
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            We're upgrading our infrastructure with enhanced security protocols and advanced encryption to provide you with the best gaming experience.
          </p>
          
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-white">Migration Progress</span>
              <span className="text-lg font-bold text-blue-400">55%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${55}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 mb-8 border border-blue-500/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center">
              <Shield className="w-6 h-6 mr-2 text-blue-400" />
              Enhanced Security Features
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-gray-300">•  Encryption</div>
              <div className="text-gray-300">• Advanced Data Protection</div>
              <div className="text-gray-300">• Secure Authentication</div>
              <div className="text-gray-300">• Performance Optimization</div>
              <div className="text-gray-300">• Real-time Monitoring</div>
              <div className="text-gray-300">• Backup Systems</div>
            </div>
          </div>

          {/* Status Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Systems Online</span>
              </div>
              <div className="w-px h-6 bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-[#a6f2da] font-medium">
                🔄 Expected completion: Within the next few hours
              </p>
              <p className="text-gray-400 text-sm mt-1">
                We appreciate your patience as we implement these critical security enhancements.
              </p>
            </div>

            <div className="pt-4">
              <p className="text-gray-400 text-sm">
                For urgent inquiries, please contact our support team.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Last updated: {currentTime.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Thank you for your patience during this important upgrade process.
          </p>
        </div>
      </div>
    </div>
  )
}

// Developer Access Control Component
export default function DeveloperProtection({ children }) {
  const [isDeveloper, setIsDeveloper] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has developer role in localStorage
    try {
      const role = localStorage.getItem('role')
      if (role === 'developer') {
        setIsDeveloper(true)
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Show loading spinner while checking localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing...</p>
        </div>
      </div>
    )
  }

  // Show maintenance page if not developer
  if (!isDeveloper) {
    return <MaintenancePage />
  }

  // Show normal site for developers
  return <>{children}</>
}