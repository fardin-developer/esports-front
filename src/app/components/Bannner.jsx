'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { apiClient } from '../apiClient'

const Bannner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState([])

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await apiClient.get('/banners/public/banners')

        if (res?.success && Array.isArray(res.data)) {
          const primaryBanners = res.data
            .filter((item) => item.type === 'primary banner')
            .sort((a, b) => (a.priority || 0) - (b.priority || 0))

          setSlides(primaryBanners)
          setCurrentSlide(0)
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error)
      }
    }

    fetchBanners()
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!slides.length) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    if (!slides.length) return
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    if (!slides.length) return
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    if (!slides.length) return
    setCurrentSlide(index)
  }

  const handleCtaClick = (url) => {
    if (!url) return
    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="relative  h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden bg-black mx-4 sm:mx-0 my-4 sm:my-0 rounded-lg sm:rounded-none">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const hasTitle = Boolean(slide.title && slide.title.trim())

          return (
            <div
              key={slide._id || index}
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
                {/* Subtle Overlay - lighter when no title so image is clearer */}
                <div className={`absolute inset-0 ${hasTitle ? 'bg-black/50' : 'bg-black/10'}`} />
              </div>

              {/* Content - show only when title exists */}
              {hasTitle && (
                <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                      {/* Text Content */}
                      <div className="text-white">
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                          {slide.title}
                        </h1>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleCtaClick(slide.url)}
                        className="bg-white text-black px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg self-start sm:self-auto"
                      >
                        <Play className="inline-block w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Visit Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
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
          style={{ width: `${slides.length ? ((currentSlide + 1) / slides.length) * 100 : 0}%` }}
        />
      </div>
    </div>
  )
}

export default Bannner