"use client"

import { useState, useEffect, useCallback } from 'react'
import { Car } from '@/services/types'
import CarItem from './CarItem'

export default function CarCard() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const itemsPerPage = 12
  const [seed, setSeed] = useState<string | undefined>(undefined)

  const fetchCars = useCallback(async () => {
    try {
      const randomParam = 'random=true'
      const seedParam = seed ? `&seed=${encodeURIComponent(seed)}` : ''
      const response = await fetch(`/api/cars?page=${currentPage}&limit=${itemsPerPage}&${randomParam}${seedParam}`, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Failed to fetch cars')
      }
      const data = await response.json()
      const items = data.items || data
      setCars(items)
      setTotal(data.total || 0)
      // store seed returned by server so subsequent page requests use same permutation
      if (!seed && data.seed) {
        setSeed(String(data.seed))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [currentPage, seed, setTotal])

  useEffect(() => {
    setLoading(true)
    fetchCars()
    
    // Refrescar cada 2 minutos para ver cambios en tiempo real
    const interval = setInterval(fetchCars, 120000)
    return () => clearInterval(interval)
  }, [currentPage, fetchCars])

  const totalPages = Math.ceil(total / itemsPerPage)

  if (loading) {
    return <div className="text-center py-10">Loading cars...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>
  }

  if (cars.length === 0) {
    return <div className="text-center py-10">No cars available</div>
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {cars.map((car) => (
          <CarItem key={car._id} car={car} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
