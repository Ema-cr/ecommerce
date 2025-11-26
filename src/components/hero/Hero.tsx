'use client'

import React, { useState, useEffect } from 'react'

function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Array of image URLs - you can replace these with your own images
  const heroImages = [
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764087098/nzjthifdfajnumeczxga.jpg',
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764087569/maery3md4ujbiuakcomg.jpg',
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764094850/xv7v6xqnk0xneopcjwob.jpg',
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764095436/hwmck1fddrrqrlmpqize.jpg',
    'https://res.cloudinary.com/dg9ppbm9z/image/upload/v1764096057/nro2tqysuqq5kk5ffq0s.jpg'
  ]

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
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
      <div className="absolute inset-0 bg-black opacity-40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Bienvenido a GT Auto Market</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Descubre productos increíbles con ofertas exclusivas
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition">
          Comprar Ahora
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
            onClick={() => setCurrentImageIndex(index)}
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