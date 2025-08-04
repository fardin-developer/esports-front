"use client"
import { useEffect, useState } from 'react'
import { Shield, Server, Database, Clock, CheckCircle, ArrowRight } from 'lucide-react'

export default function MaintenancePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simulate migration progress
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) return 85 // Keep at 85% to show ongoing migration
        return prev + Math.random() * 2
      })
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(progressTimer)
    }
  }, [])

  const migrationSteps = [
    { step: "Database Encryption Upgrade", status: "completed", icon: Database },
    { step: "Security Protocol Enhancement", status: "completed", icon: Shield },
    { step: "Data Migration", status: "in-progress", icon: Server },
    { step: "System Verification", status: "pending", icon: CheckCircle }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold  mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              System Migration in Progress
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We're upgrading our infrastructure with enhanced security protocols and advanced encryption to provide you with the best gaming experience.
            </p>
          </div>

          {/* Progress Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-white">Migration Progress</span>
              <span className="text-lg font-bold text-blue-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Migration Steps */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {migrationSteps.map((item, index) => {
              const IconComponent = item.icon
              return (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className={`p-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    item.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.step}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {item.status === 'completed' && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">Completed</span>
                        </>
                      )}
                      {item.status === 'in-progress' && (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-400">In Progress</span>
                        </>
                      )}
                      {item.status === 'pending' && (
                        <>
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Security Features */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 mb-8 border border-blue-500/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-400" />
              Enhanced Security Features
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">End-to-End Encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Advanced Data Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Secure Authentication</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Performance Optimization</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Real-time Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Backup Systems</span>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="text-center space-y-4">
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
              <p className="text-yellow-300 font-medium">
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