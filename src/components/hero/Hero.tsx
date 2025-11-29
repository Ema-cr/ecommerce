'use client'

import Link from 'next/link'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useI18n } from '@/app/i18n/I18nProvider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Hero() {
  const { t } = useI18n()
  const { data: session } = useSession()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Array of image URLs - you can replace these with your own images
  const heroImages = [
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764298112/a9bcoq2k3kbr75iphzju.jpg',
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764296211/l34lbak76brvgbjro0rn.webp',
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764094850/xv7v6xqnk0xneopcjwob.jpg',
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764296704/eaetvqzvm19o2pih3mqs.jpg',
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764294942/yn5y6coknbqegxg1cp7b.jpg',
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764296567/ip7hz4mckxk6zpnoz00d.webp',
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764295986/ldj7sy3nssrljxne2x6s.jpg',
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764295107/t1frtkif4sluyibw3s3l.avif'
  ]

  // Auto-rotate images every 5 seconds. Keep interval in a ref so we can reset it on manual navigation.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // pause duration after manual navigation (ms)
  const pauseDuration = 8000

  const startAutoRotate = useCallback(() => {
    // clear existing interval if any
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000)
  }, [heroImages.length])

  const stopAutoRotate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    startAutoRotate()
    return () => {
      stopAutoRotate()
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
        restartTimeoutRef.current = null
      }
    }
  }, [startAutoRotate, stopAutoRotate])

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    )
    // pause auto-rotate and restart after a short interval
    stopAutoRotate()
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current)
    restartTimeoutRef.current = setTimeout(() => startAutoRotate(), pauseDuration)
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    // pause auto-rotate and restart after a short interval
    stopAutoRotate()
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current)
    restartTimeoutRef.current = setTimeout(() => startAutoRotate(), pauseDuration)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('hero.title')}</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          {t('hero.subtitle')}
        </p>
      <button
        onClick={() => {
          if (session?.user?.email) {
            router.push('/cars')
          } else {
            router.push('/register')
          }
        }}
        className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition"
      >
        {t('hero.buyNow')}
      </button>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-50 hover:bg-opacity-75 text-black rounded-full p-2 transition"
      >
        &#10094;
      </button>
      <button
        onClick={handleNextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-50 hover:bg-opacity-75 text-black rounded-full p-2 transition"
      >
        &#10095;
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentImageIndex(index)
              // pause auto-rotate and restart after pauseDuration when user selects a dot
              stopAutoRotate()
              if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current)
              restartTimeoutRef.current = setTimeout(() => startAutoRotate(), pauseDuration)
            }}
            className={`w-3 h-3 rounded-full transition ${
              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero