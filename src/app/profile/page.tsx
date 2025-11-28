"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

type UserSafe = {
  name?: string
  email?: string
  role?: string
  cart?: unknown[]
  image?: string
  _id?: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [user, setUser] = useState<UserSafe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/users/me')
        if (!res.ok) throw new Error('No autorizado')
        const data = await res.json()
        setUser(data.user)
      } catch {
          setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
  }, [])

  if (loading) return <div className="p-8">Cargando perfil...</div>
  if (!user) return <div className="p-8 text-red-500">No hay usuario autenticado.</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-6 mb-6">
        {session?.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={session.user.image} alt="avatar" className="w-28 h-28 rounded-full object-cover" />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">?</div>
        )}

        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">Role: {user.role}</p>
        </div>
      </div>

      <section className="bg-white rounded p-4 shadow">
        <h3 className="font-medium mb-3">Carrito</h3>
        {Array.isArray(user.cart) && user.cart.length > 0 ? (
          <ul className="list-disc pl-5">
            {user.cart.map((c: unknown, idx: number) => (
              <li key={idx}>{String(c)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay items en el carrito.</p>
        )}
      </section>
    </div>
  )
}
