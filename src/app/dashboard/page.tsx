"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useI18n } from '@/app/i18n/I18nProvider'

type Stat = { label: string; value: string; delta?: string }

const topModels: { name: string; sold: number }[] = [
  { name: 'BMW M3', sold: 42 },
  { name: 'Porsche 911', sold: 37 },
  { name: 'Mercedes-AMG GT', sold: 29 },
  { name: 'Audi R8', sold: 24 },
]

const branchesPerformance: { branch: string; sold: number; revenue: number }[] = [
  { branch: 'Poblado', sold: 86, revenue: 19_800_000 },
  { branch: 'Laureles', sold: 41, revenue: 9_750_000 },
  { branch: 'Centro', sold: 18, revenue: 4_200_000 },
]

function DashboardPage() {
  const { data: session } = useSession()
  const [role, setRole] = useState<string | null>(null)
  const { t } = useI18n()

  const stats: Stat[] = [
    { label: t('dashboard.carsSold'), value: '145', delta: `+28% ${t('dashboard.vsLastMonth')}` },
    { label: t('dashboard.revenue'), value: '$38,750,000 USD', delta: `+24% ${t('dashboard.vsLastMonth')}` },
    { label: t('dashboard.avgTicket'), value: '$267,000 USD', delta: `+12% ${t('dashboard.vsLastMonth')}` },
    { label: t('dashboard.newClients'), value: '1,042', delta: `+31% ${t('dashboard.vsLastMonth')}` },
  ]

  useEffect(() => {
    const fetchRole = async () => {
      if (!session?.user?.email) { setRole(null); return }
      try {
        const res = await fetch('/api/users/me', { credentials: 'include', cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        setRole(data?.user?.role || null)
      } catch {}
    }
    fetchRole()
  }, [session?.user?.email])
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
          {role === 'admin' && (
            <div className="mt-4">
              <Link href="/create" className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                {t('dashboard.createVehicle')}
              </Link>
            </div>
          )}
        </header>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{s.value}</p>
              {s.delta && (
                <p className="mt-1 text-xs text-green-600">{s.delta}</p>
              )}
            </div>
          ))}
        </section>

        {/* Two-column sections */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top models */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.topModels')}</h2>
            <ul className="mt-4 space-y-3">
              {topModels.map((m) => (
                <li key={m.name} className="flex items-center justify-between">
                  <span className="text-gray-700">{m.name}</span>
                  <span className="text-gray-900 font-medium">{m.sold}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Branch performance */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.branchPerformance')}</h2>
            <div className="mt-4 space-y-3">
              {branchesPerformance.map((b) => (
                <div key={b.branch}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{b.branch}</span>
                    <span className="text-gray-900 font-medium">{b.sold} {t('dashboard.sold')}</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-100 rounded">
                    <div
                      className="h-2 bg-blue-600 rounded"
                      style={{ width: `${Math.min(100, (b.sold / 22) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{t('dashboard.income')} ${b.revenue.toLocaleString()} USD</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple trend area */}
        <section className="mt-10 bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.salesTrend')}</h2>
          <div className="mt-4 grid grid-cols-6 gap-4">
            {[22, 34, 41, 57, 63, 78].map((v: number, i: number) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 bg-blue-500/20 rounded" style={{ height: `${v * 8}px` }} />
                <span className="mt-2 text-xs text-gray-600">{t('dashboard.week')} {i + 1}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default DashboardPage