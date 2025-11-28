"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Car } from '@/services/types'
import { toast } from 'react-toastify'

type UserSafe = {
  name?: string
  email?: string
  role?: string
  cart?: unknown[]
  image?: string
  address?: string
  _id?: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [user, setUser] = useState<UserSafe | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [passwordMode, setPasswordMode] = useState(false)
  const [favorites, setFavorites] = useState<Car[]>([])
  const [formData, setFormData] = useState({ name: '', email: '', address: '' })
  const [passwordData, setPasswordData] = useState({ current: '', newPassword: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'profile' | 'favorites' | 'orders' | 'settings'>('profile')

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' })
        if (!res.ok) throw new Error('No autorizado')
        const data = await res.json()
        setUser(data.user)
        setFormData({ 
          name: data.user.name || '', 
          email: data.user.email || '',
          address: data.user.address || ''
        })
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
  }, [])

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.email) return
      try {
        const res = await fetch('/api/users/favorites', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setFavorites(data.favorites || [])
        }
      } catch {
        // ignore
      }
    }
    fetchFavorites()
  }, [session?.user?.email])

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null)
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', selectedFile)

      const upRes = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' })
      if (!upRes.ok) throw new Error('Upload failed')
      const upData = await upRes.json()
      const url = upData.url

      const patchRes = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: url }),
        credentials: 'include',
      })
      if (!patchRes.ok) throw new Error('Update failed')
      const patched = await patchRes.json()
      setUser(patched.user)
      setSelectedFile(null)
      setPreview(null)
      toast.success('Avatar actualizado')
    } catch (err) {
      console.error(err)
      toast.error('Error subiendo la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
      toast.info('Por favor completa los campos requeridos')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email,
          address: formData.address
        }),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Update failed')
      const data = await res.json()
      setUser(data.user)
      setEditMode(false)
      toast.success('Perfil actualizado')
    } catch (err) {
      console.error(err)
      toast.error('Error actualizando perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.current || !passwordData.newPassword || !passwordData.confirm) {
      toast.info('Por favor completa todos los campos')
      return
    }

    if (passwordData.newPassword !== passwordData.confirm) {
      toast.warning('Las contraseñas no coinciden')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.info('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password: passwordData.current,
          newPassword: passwordData.newPassword
        }),
        credentials: 'include',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Update failed')
      }
      toast.success('Contraseña actualizada correctamente')
      setPasswordMode(false)
      setPasswordData({ current: '', newPassword: '', confirm: '' })
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Error actualizando contraseña')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 pt-28">Cargando perfil...</div>
  if (!user) return <div className="p-8 pt-28 text-red-500">No hay usuario autenticado.</div>

  return (
    <div className="max-w-6xl mx-auto p-6 pt-28 bg-gray-50">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user?.image || session?.user?.image || '/default-avatar.svg'}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Usuario'}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500">Miembro desde 2025</p>
          </div>
        </div>
        <button
          onClick={() => setEditMode(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow p-2 mb-6 flex gap-2">
        <button
          onClick={() => setTab('profile')}
          className={`px-4 py-2 rounded ${tab === 'profile' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600'}`}
        >
          Profile
        </button>
        <button
          onClick={() => setTab('favorites')}
          className={`px-4 py-2 rounded ${tab === 'favorites' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600'}`}
        >
          Favorites ({favorites.length})
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 rounded ${tab === 'orders' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600'}`}
        >
          Orders
        </button>
        <button
          onClick={() => setTab('settings')}
          className={`px-4 py-2 rounded ${tab === 'settings' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600'}`}
        >
          Settings
        </button>
      </div>

      {/* TAB: MI PERFIL */}
      {tab === 'profile' && (
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 bg-white rounded-lg shadow p-6">
            {user?.image || session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user?.image || session?.user?.image || '/default-avatar.svg'}
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400">
                {user.name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}

            <div>
              {!editMode ? (
                <>
                  <h2 className="text-3xl font-bold">{user.name}</h2>
                  <p className="text-gray-600 mb-1">{user.email}</p>
                  <p className="text-sm text-gray-500 mb-4">Role: {user.role}</p>
                  {user.address && <p className="text-gray-600">Dirección: {user.address}</p>}
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Editar perfil
                  </button>
                </>
              ) : (
                <div className="space-y-3 w-full">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nombre"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Dirección"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false)
                        setFormData({ name: user.name || '', email: user.email || '', address: user.address || '' })
                      }}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Cambiar avatar</h3>
            <div className="flex items-center gap-6">
              <div>
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="preview" className="w-20 h-20 rounded-full object-cover border-2 border-blue-400" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image || session?.user?.image || '/default-avatar.svg'} alt="current" className="w-20 h-20 rounded-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <span className="text-gray-700 block mb-2">Selecciona una imagen</span>
                  <input id="avatar-file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="avatar-file" className="inline-block px-4 py-2 bg-gray-100 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 border">
                    Elegir archivo
                  </label>
                  {selectedFile && (
                    <span className="ml-3 text-sm text-gray-600">{selectedFile.name}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {uploading ? 'Subiendo...' : 'Subir imagen'}
                  </button>
                  <button
                    onClick={() => { setSelectedFile(null); setPreview(null) }}
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Cambiar contraseña</h3>
            {!passwordMode ? (
              <button
                onClick={() => setPasswordMode(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Cambiar contraseña
              </button>
            ) : (
              <div className="space-y-3 max-w-md">
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  placeholder="Contraseña actual"
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Nueva contraseña"
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  placeholder="Confirmar contraseña"
                  className="w-full px-3 py-2 border rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                  >
                    {saving ? 'Cambiando...' : 'Cambiar'}
                  </button>
                  <button
                    onClick={() => {
                      setPasswordMode(false)
                      setPasswordData({ current: '', newPassword: '', confirm: '' })
                    }}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: FAVORITOS */}
      {tab === 'favorites' && (
        <div>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((car) => (
                <div key={car._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{car.brand} {car.model}</h3>
                    <p className="text-sm text-gray-500">{car.year}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">${car.price.toLocaleString()}</p>
                    <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-700 text-lg">No tienes autos favoritos aún</p>
              <button
                onClick={() => setTab('profile')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Explorar autos
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB: ORDERS */}
      {tab === 'orders' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Order History</h3>
          <p className="text-gray-600 mb-6">View your past purchases and inquiries</p>
          <div className="text-center py-12">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">📦</div>
            <p className="text-gray-700 mt-4">No orders yet</p>
            <button
              onClick={() => setTab('favorites')}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Browse Cars
            </button>
          </div>
        </div>
      )}

      {/* TAB: SETTINGS */}
      {tab === 'settings' && (
        <div className="space-y-6">
          {/* Password Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Account Settings</h3>
            <p className="text-gray-600 mb-6">Manage your account preferences</p>
            <div className="max-w-md space-y-3">
              <input
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                placeholder="Current Password"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="New Password"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                placeholder="Confirm New Password"
                className="w-full px-3 py-2 border rounded"
              />
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </div>

          {/* Notifications Section (visual only) */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Notifications</h3>
            <p className="text-gray-600 mb-6">Manage your notification preferences</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates about new cars</p>
                </div>
                <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Enable</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Price Drop Alerts</p>
                  <p className="text-sm text-gray-600">Get notified when prices drop</p>
                </div>
                <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Enable</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
