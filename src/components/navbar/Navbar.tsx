"use client";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'

function Navbar() {
  const { data: session } = useSession();
  const [userImage, setUserImage] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState('')
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.email) return
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        setUserImage(data.user?.image || null)
        setUserName(data.user?.name || session.user.name || null)
        setUserRole(data.user?.role || null)
      } catch {
        // ignore
      }
    }
    fetchUser()
  }, [session?.user?.email, session?.user?.name])

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const doSearch = (q: string) => {
    const encoded = encodeURIComponent(q.trim())
    if (!encoded) {
      router.push('/cars')
    } else {
      router.push(`/cars?q=${encoded}`)
    }
  }

  const handleNavigate = (href: string) => {
    router.push(href)
    setDropdownOpen(false)
  }

  return (
    
    <nav
      className="fixed w-full top-0 z-50 border-b border-white/10 
      bg-linear-to-l from-[#0a1b3c] via-[#0e2a67] to-[#0d1f4a] backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        <div className="flex items-center space-x-3">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon-gt.png"
              alt="GT AutoMarket"
              className="h-20 cursor-pointer drop-shadow-lg"
            />
          </Link>

          <Link href="/" className="text-white">
            <div className="leading-5">
              <h1 className="text-lg font-semibold">GT AutoMarket</h1>
              <p className="text-gray-300 text-sm">Concesionario Oficial</p>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-10">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') doSearch(query) }}
            placeholder="Buscar vehículos, marcas, modelos..."
            className="w-full max-w-md px-4 py-2 rounded-lg 
            bg-white/10 border border-white/20 text-white placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-400/60 backdrop-blur-md"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/cars"
            className="hidden md:block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition"
          >
            Ver Vehiculos
          </Link>
          {userRole === 'admin' && (
            <Link
              href="/create"
              className="hidden md:block px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition"
            >
              Crear Vehículo
            </Link>
          )}
          {session?.user ? (
            <div className="flex items-center gap-3 relative" ref={dropdownRef}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={userImage || session.user.image || '/default-avatar.svg'}
                alt="user"
                className="w-12 h-12 rounded cursor-pointer border border-white/20 hover:border-white/40 transition object-cover"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              { (userName || session.user.name) && (
                <span className="hidden md:inline text-white text-sm font-medium">
                  {userName || session.user.name}
                </span>
              )}

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-12 w-56 
                bg-[#0d1f4a]/95 border border-white/20 backdrop-blur-xl
                rounded-lg shadow-2xl p-0 text-white z-50"
                >
                  {/* User info section */}
                  <div className="border-b border-white/10 p-4">
                    <p className="font-semibold text-base">{session.user.name}</p>
                    <p className="text-gray-300 text-xs truncate mt-1">
                      {session.user.email}
                    </p>
                  </div>
                  

                  {/* Menu items */}
                  <div className="py-2">
                    <button
                      onClick={() => handleNavigate('/profile')}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition flex items-center gap-3 text-gray-200 hover:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi Perfil
                    </button>

                    <button
                      onClick={() => handleNavigate('/cars')}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition flex items-center gap-3 text-gray-200 hover:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-6-4m6 4l6-4" />
                      </svg>
                      Ver Vehículos
                    </button>

                    <button
                      onClick={() => handleNavigate('/dashboard')}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition flex items-center gap-3 text-gray-200 hover:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Panel
                    </button>

                    <div className="border-t border-white/10 my-2"></div>

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-3 hover:bg-red-500/20 transition flex items-center gap-3 text-red-300 hover:text-red-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition"
            >
              Iniciar sesión
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-200 hover:text-white"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden bg-[#0d1f4a]/90 border-t border-white/10 
        px-6 py-4 space-y-3 backdrop-blur-xl"
        >
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { doSearch(query); setMenuOpen(false) } }}
            placeholder="Buscar..."
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
            text-gray-200 placeholder-gray-300 focus:outline-none"
          />

          <Link href="/" className="block text-gray-200 hover:text-white">
            Home
          </Link>
          <Link href="/cars" className="block text-gray-200 hover:text-white">
            Vehículos
          </Link>
          <Link href="/dashboard" className="block text-gray-200 hover:text-white">
            Panel
          </Link>

          {!session?.user && (
            <button
              onClick={() => signIn()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
