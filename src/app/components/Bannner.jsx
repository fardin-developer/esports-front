'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight,Wallet,Rocket, Play,Gamepad2, Users, Trophy, Zap } from 'lucide-react'

const Bannner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "Top-Up & Dominate",
      subtitle: "Instant UC, Diamonds & More",
      image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/43540f45-280c-4c78-af85-38632715b2c7/dgenqdv-85278212-30ca-4817-a577-db710634b0d1.png/v1/fill/w_1131,h_707/mobile_legends_nolan_mlbb_nolan_cosmi_hd_wallpaper_by_keyadfdf_dgenqdv-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTU5MCIsInBhdGgiOiJcL2ZcLzQzNTQwZjQ1LTI4MGMtNGM3OC1hZjg1LTM4NjMyNzE1YjJjN1wvZGdlbnFkdi04NTI3ODIxMi0zMGNhLTQ4MTctYTU3Ny1kYjcxMDYzNGIwZDEucG5nIiwid2lkdGgiOiI8PTI1NDQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.mFdnLFxDGf2tRRllAKDAuYdZa556695VdBToZfgFP50",
      accent: "bg-blue-600",
      icon: <Wallet className="w-8 h-8" />
    },
    {
      id: 2,
      title: "Fast Delivery Guaranteed",
      subtitle: "No Wait. Just Play.",
      image: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
      accent: "bg-emerald-600",
      icon: <Rocket className="w-8 h-8" />
    },
    {
      id: 3,
      title: "Boost Your Gameplay",
      subtitle: "Top-Up & Join the Action",
      image: "https://e1.pxfuel.com/desktop-wallpaper/283/269/desktop-wallpaper-mobile-legends-logo.jpg",
      accent: "bg-purple-600",
      icon: <Gamepad2 className="w-8 h-8" />
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative  h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden bg-black mx-4 sm:mx-0 my-4 sm:my-0 rounded-lg sm:rounded-none">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content - Positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  {/* Text Content */}
                  <div className="text-white">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                      {slide.title}
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200">
                      {slide.subtitle}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button className="bg-white text-black px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg self-start sm:self-auto">
                    <Play className="inline-block w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-black/80 transition-all duration-300 z-20 border border-gray-600"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-black/80 transition-all duration-300 z-20 border border-gray-600"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full z-20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  )
}

export default Bannner