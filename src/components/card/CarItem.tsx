'use client'

import Image from 'next/image'
import { Car } from '@/services/types'
import { FaGasPump, FaCog, FaTachometerAlt, FaWrench, FaStar } from 'react-icons/fa'
import { MdElectricBolt } from 'react-icons/md'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useI18n } from '@/app/i18n/I18nProvider'

export default function CarItem({ car, favoriteIds = [], role, onEdit, onViewDetails }: { car: Car, favoriteIds?: string[], role?: string | null, onEdit?: (car: Car) => void, onViewDetails?: (car: Car) => void }) {
  const { data: session } = useSession()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useI18n()
  // role not needed in card (admin controls removed)

  // Modal removed from card; handled in parent page

  useEffect(() => {
    if (!session?.user?.email) {
      setIsFavorite(false)
      return
    }
    const isFav = favoriteIds.some((id) => id === car._id)
    setIsFavorite(isFav)
  }, [session?.user?.email, car._id, favoriteIds])

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!session?.user?.email) {
      toast.info(t('carItem.loginForFavorites'))
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
        toast.success(isFavorite ? t('cars.card.favoriteRemoved') : t('cars.card.favoriteAdded'))
      } else {
        toast.error(t('carItem.favoriteUpdateError'))
      }
    } catch (err) {
      console.error(err)
      toast.error(t('carItem.favoriteError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">

      <div className="relative w-full h-64 bg-gray-200">
        <Image
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover"
        />
        {/* Hover Overlay: Schedule Visit */}
        <a
          href="/visit"
          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors duration-300"
          aria-label="Schedule a visit at the dealership"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-600 font-semibold bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full">
            {t('carItem.scheduleVisit')}
          </span>
        </a>
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

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition" onClick={() => onViewDetails && onViewDetails(car)}>
            {t('carItem.details')}
          </button>
          {role === 'admin' && (
            <button
              className="px-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
              onClick={() => onEdit && onEdit(car)}
            >
              {t('carItem.edit')}
            </button>
          )}
        </div>
      </div>
      
    </div>
  )
}
