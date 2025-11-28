"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Car } from '@/services/types'
import CarItem from '@/components/card/CarItem'
import { MdSearch } from 'react-icons/md'

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        // request a large limit to fetch all cars; server supports limit param
        const res = await fetch('/api/cars?page=1&limit=1000', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch cars')
        const data = await res.json()
        setCars(data.items || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

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
        <h3 className="text-lg font-semibold mb-3">Filters</h3>

        <label className="block text-sm font-medium mt-2">Search Brand</label>
        <div className="flex items-center gap-2 mt-1">
          <MdSearch className="text-gray-500" />
          <input value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. Toyota" />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <label className="text-sm">Min Price</label>
            <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm">Max Price</label>
            <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-sm">Tags (comma separated)</label>
          <input value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="w-full p-2 border rounded mt-1" placeholder="JDM, Rotary" />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <label className="text-sm">Year Min</label>
            <input type="number" value={yearMin} onChange={e => setYearMin(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm">Year Max</label>
            <input type="number" value={yearMax} onChange={e => setYearMax(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-sm">Condition</label>
          <select value={conditionFilter} onChange={e => setConditionFilter(e.target.value)} className="w-full p-2 border rounded mt-1">
            <option value="">Any</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>

        <div className="mt-3">
          <label className="text-sm">Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 border rounded mt-1">
            <option value="">Any</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={clearFilters} className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded">Clear</button>
        </div>
      </aside>

      {/* Cards grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((car) => (
            <CarItem key={car._id} car={car} />
          ))}
        </div>
      </div>
    </div>
  )
}