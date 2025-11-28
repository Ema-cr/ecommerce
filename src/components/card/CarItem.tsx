'use client'

import Image from 'next/image'
import { Car } from '@/services/types'
import { FaGasPump, FaCog, FaTachometerAlt, FaWrench, FaStar } from 'react-icons/fa'
import { MdElectricBolt } from 'react-icons/md'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

export default function CarItem({ car }: { car: Car }) {
  const { data: session } = useSession()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if car is in user's favorites (single check, not full list)
    const checkFavorite = async () => {
      if (!session?.user?.email) return
      try {
        const res = await fetch(`/api/users/favorites?carId=${car._id}`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setIsFavorite(Boolean(data.isFavorite))
        }
      } catch {
        // silent
      }
    }
    checkFavorite()
  }, [session?.user?.email, car._id])

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!session?.user?.email) {
      toast.info('Por favor inicia sesión para usar favoritos')
      return
    }

    setLoading(true)
    try {
      const method = isFavorite ? 'DELETE' : 'POST'
      const res = await fetch('/api/users/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: car._id }),
        credentials: 'include',
      })

      if (res.ok) {
        setIsFavorite(!isFavorite)
        toast.success(isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos')
      } else {
        toast.error('No se pudo actualizar el favorito')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error actualizando favorito')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">

      <div className="relative w-full h-64 bg-gray-200">
        <Image
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
              car.status === 'Available'
                ? 'bg-green-500'
                : car.status === 'Sold'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
            }`}
          >
            {car.status}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className="absolute top-3 left-3 p-2 rounded-full bg-white/80 hover:bg-white transition disabled:opacity-50"
        >
          <FaStar
            className={`text-lg ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand and Model */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {car.brand} {car.model}
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          {car.year} • {car.condition}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <FaWrench className="text-gray-600 text-lg" />
            <span className="text-gray-600">{car.engine.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <MdElectricBolt className="text-gray-600 text-lg" />
            <span className="text-gray-600">{car.engine.hp} HP</span>
          </div>
          <div className="flex items-center gap-2">
            <FaGasPump className="text-gray-600 text-lg" />
            <span className="text-gray-600">{car.engine.fuel}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCog className="text-gray-600 text-lg" />
            <span className="text-gray-600">{car.engine.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaTachometerAlt className="text-gray-600 text-lg" />
            <span className="text-gray-600">{car.km} km</span>
          </div>
        </div>

        {/* Tags */}
        {car.tags && car.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {car.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="border-t pt-3 mb-3">
          <p className="text-2xl font-bold text-blue-600">
            ${car.price.toLocaleString()} {car.currency}
          </p>
        </div>

        {/* Action Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
          View Details
        </button>
      </div>
    </div>
  )
}
