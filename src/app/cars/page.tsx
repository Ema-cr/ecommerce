"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Car } from '@/services/types'
import CarItem from '@/components/card/CarItem'
import { MdSearch } from 'react-icons/md'
import { useSession } from 'next-auth/react'
import CarsModal from '@/components/carsmodal/CarsModal'
import DetailsModal from '@/components/detailsmodal/DetailsModal'
import { useSearchParams } from 'next/navigation'
import { useI18n } from '@/app/i18n/I18nProvider'

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [role, setRole] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsCar, setDetailsCar] = useState<Car | null>(null)
  const searchParams = useSearchParams()
  const { t } = useI18n()

  // Filters
  const [brandFilter, setBrandFilter] = useState('')
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [tagFilter, setTagFilter] = useState('')
  const [conditionFilter, setConditionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [yearMin, setYearMin] = useState<number | ''>('')
  const [yearMax, setYearMax] = useState<number | ''>('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/cars?page=1&limit=1000', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch cars')
        const data = await res.json()
        setCars(data.items || [])
        const q = searchParams.get('q')
        if (q) setBrandFilter(q)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [searchParams])

  // Fetch favorites once for the logged-in user
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.email) { setFavoriteIds([]); return }
      try {
        const res = await fetch('/api/users/favorites', { credentials: 'include', cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const ids = (data.favorites || []).map((c: { _id: string | { toString: () => string } }) =>
          typeof c._id === 'string' ? c._id : c._id.toString()
        )
        setFavoriteIds(ids)
      } catch {
        // ignore
      }
    }
    fetchFavorites()
  }, [session?.user?.email])

  // Fetch role once
  useEffect(() => {
    const fetchRole = async () => {
      if (!session?.user?.email) { setRole(null); return }
      try {
        const res = await fetch('/api/users/me', { credentials: 'include', cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        setRole(data?.user?.role || null)
      } catch {
        // ignore
      }
    }
    fetchRole()
  }, [session?.user?.email])

  const handleEdit = (car: Car) => {
    setSelectedCar(car)
    setEditOpen(true)
  }

  const handleSave = async (update: Partial<Car>) => {
    if (!selectedCar) return
    try {
      const res = await fetch('/api/cars', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ carId: selectedCar._id, ...update }),
      })
      if (!res.ok) throw new Error('Update failed')
      const data = await res.json()
      const updated = data.car as Car
      setCars(prev => prev.map(c => (c._id === updated._id ? updated : c)))
      setEditOpen(false)
      setSelectedCar(null)
    } catch (e) {
      console.error(e)
    }
  }

  const handleViewDetails = (car: Car) => {
    setDetailsCar(car)
    setDetailsOpen(true)
  }

  // Open details modal if URL has ?modal=<carId>
  useEffect(() => {
    const modalId = searchParams.get('modal')
    if (!modalId || cars.length === 0) return
    const found = cars.find(c => c._id === modalId)
    if (found) {
      setDetailsCar(found)
      setDetailsOpen(true)
    }
  }, [searchParams, cars])

  const clearFilters = () => {
    setBrandFilter('')
    setMinPrice('')
    setMaxPrice('')
    setTagFilter('')
    setConditionFilter('')
    setStatusFilter('')
    setYearMin('')
    setYearMax('')
  }

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      if (brandFilter && !(`${c.brand}`.toLowerCase().includes(brandFilter.toLowerCase()))) return false
      if (conditionFilter && c.condition !== conditionFilter) return false
      if (statusFilter && c.status !== statusFilter) return false
      if (minPrice !== '' && c.price < Number(minPrice)) return false
      if (maxPrice !== '' && c.price > Number(maxPrice)) return false
      if (yearMin !== '' && c.year < Number(yearMin)) return false
      if (yearMax !== '' && c.year > Number(yearMax)) return false
      if (tagFilter) {
        const tags = tagFilter.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
        if (tags.length > 0) {
          const carTags = (c.tags || []).map((t) => t.toLowerCase())
          if (!tags.every(t => carTags.includes(t))) return false
        }
      }
      return true
    })
  }, [cars, brandFilter, conditionFilter, statusFilter, minPrice, maxPrice, tagFilter, yearMin, yearMax])

  if (loading) return <div className="p-8">Loading cars...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="flex gap-6 p-6">
      {/* Sidebar filters */}
      <aside className="w-72 bg-white rounded-lg shadow p-4 sticky top-32 h-[calc(100vh-48px)] overflow-auto">
        <h3 className="text-lg font-semibold mb-3">{t('cars.filters.title')}</h3>

        <label className="block text-sm font-medium mt-2">{t('cars.filters.brand')}</label>
        <div className="flex items-center gap-2 mt-1">
          <MdSearch className="text-gray-500" />
          <input value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. Toyota" />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <label className="text-sm">{t('cars.filters.minPrice')}</label>
            <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm">{t('cars.filters.maxPrice')}</label>
            <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-sm">{t('cars.filters.tags')}</label>
          <input value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="w-full p-2 border rounded mt-1" placeholder="JDM, Rotary" />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <label className="text-sm">{t('cars.filters.yearMin')}</label>
            <input type="number" value={yearMin} onChange={e => setYearMin(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm">{t('cars.filters.yearMax')}</label>
            <input type="number" value={yearMax} onChange={e => setYearMax(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-sm">{t('cars.filters.condition')}</label>
          <select value={conditionFilter} onChange={e => setConditionFilter(e.target.value)} className="w-full p-2 border rounded mt-1">
            <option value="">{t('cars.filters.any')}</option>
            <option value="New">{t('cars.filters.new')}</option>
            <option value="Used">{t('cars.filters.used')}</option>
          </select>
        </div>

        <div className="mt-3">
          <label className="text-sm">{t('cars.filters.status')}</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 border rounded mt-1">
            <option value="">{t('cars.filters.any')}</option>
            <option value="Available">{t('cars.filters.available')}</option>
            <option value="Sold">{t('cars.filters.sold')}</option>
            <option value="Reserved">{t('cars.filters.reserved')}</option>
          </select>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={clearFilters} className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded">{t('cars.filters.clear')}</button>
        </div>
      </aside>

      {/* Cards grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((car) => (
            <div key={car._id} onClick={() => setBrandFilter(car.brand)}>
              <CarItem car={car} favoriteIds={favoriteIds} role={role} onEdit={handleEdit} onViewDetails={handleViewDetails} />
            </div>
          ))}
        </div>
      </div>

      <CarsModal
        isOpen={editOpen}
        onOpenChange={setEditOpen}
        car={selectedCar}
        onSave={handleSave}
      />

      <DetailsModal
        isOpen={detailsOpen}
        onOpenChange={setDetailsOpen}
        car={detailsCar}
      />
    </div>
  )
}