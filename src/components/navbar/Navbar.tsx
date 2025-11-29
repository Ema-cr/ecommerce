"use client";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";
import { useI18n } from '@/app/i18n/I18nProvider'
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'

function Navbar() {
  const { data: session } = useSession();
  const { locale, setLocale, t } = useI18n()
  const [userImage, setUserImage] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<{ _id: string; brand: string; model: string; year: number; price: number; currency: string; imageUrl: string }>>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  
  // Fetch user details once per session email to avoid repeated calls
  const lastEmailFetchedRef = useRef<string | null>(null)
  useEffect(() => {
    const fetchUser = async () => {
      const email = session?.user?.email || null
      if (!email) return
      // Prevent duplicate fetches for the same email
      if (lastEmailFetchedRef.current === email) return
      lastEmailFetchedRef.current = email
      try {
        const res = await fetch('/api/users/me', { credentials: 'include', cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        setUserImage(data.user?.image || null)
        setUserName(data.user?.name || session?.user?.name || null)
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
      }
    }

    if (dropdownOpen || searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen, searchOpen])

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
              <p className="text-gray-300 text-sm">{t('navbar.subtitle') || 'Concesionario Oficial'}</p>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-10">
          <div className="relative w-full max-w-md" ref={searchRef}>
            <input
              type="text"
              value={query}
              onFocus={() => setSearchOpen(true)}
              onChange={e => {
                const val = e.target.value
                setQuery(val)
                if (debounceRef.current) clearTimeout(debounceRef.current)
                debounceRef.current = setTimeout(async () => {
                  const q = val.trim()
                  if (!q) {
                    setSearchResults([])
                    return
                  }
                  try {
                    setSearchLoading(true)
                    if (abortRef.current) abortRef.current.abort()
                    abortRef.current = new AbortController()
                    const res = await fetch(`/api/cars?q=${encodeURIComponent(q)}&limit=5`, { signal: abortRef.current.signal, cache: 'no-store' })
                    if (res.ok) {
                      const data: unknown = await res.json()
                      type CarLite = { _id: string; brand: string; model: string; year: number; price: number; currency: string; imageUrl: string }
                      let items: CarLite[] = []
                      if (data && typeof data === 'object' && 'items' in (data as Record<string, unknown>)) {
                        const arr = (data as Record<string, unknown>).items as unknown
                        if (Array.isArray(arr)) items = arr as CarLite[]
                      } else if (data && typeof data === 'object' && 'cars' in (data as Record<string, unknown>)) {
                        const arr = (data as Record<string, unknown>).cars as unknown
                        if (Array.isArray(arr)) items = arr as CarLite[]
                      } else if (Array.isArray(data)) {
                        items = data as CarLite[]
                      }
                      setSearchResults(items)
                    } else {
                      setSearchResults([])
                    }
                  } catch {
                    setSearchResults([])
                  } finally {
                    setSearchLoading(false)
                  }
                }, 250)
              }}
              onKeyDown={e => { if (e.key === 'Enter') doSearch(query) }}
              placeholder={t('navbar.searchPlaceholder') || "Buscar vehículos, marcas, modelos..."}
              className="w-full px-4 py-2 rounded-lg 
              bg-white/10 border border-white/20 text-white placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-400/60 backdrop-blur-md"
            />

            {searchOpen && (
              <div className="absolute mt-2 w-full rounded-lg border border-white/10 bg-[#0d1f4a]/95 backdrop-blur-xl shadow-2xl z-50">
                {searchLoading ? (
                  <div className="p-3 text-gray-300 text-sm">{t('navbar.searching') || 'Buscando...'}</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-3 text-gray-300 text-sm">{t('navbar.noResults') || 'Sin resultados'}</div>
                ) : (
                  <ul className="max-h-80 overflow-auto">
                    {searchResults.map(item => (
                      <li key={item._id}>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 text-left"
                          onClick={() => {
                            const q = encodeURIComponent(item.brand)
                            router.push(`/cars?q=${q}&modal=${encodeURIComponent(item._id)}`)
                            setSearchOpen(false)
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.imageUrl} alt={`${item.brand} ${item.model}`} className="w-12 h-10 object-cover rounded" />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{item.brand} {item.model}</p>
                            <p className="text-gray-300 text-xs">{item.year} • ${item.price.toLocaleString()} {item.currency}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/cars"
            className="hidden md:block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition"
          >
            {t('navbar.viewCars') || 'Ver Vehículos'}
          </Link>
          {userRole === 'admin' && (
            <Link
              href="/create"
              className="hidden md:block px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition"
            >
              {t('navbar.createVehicle')}
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
                      {t('navbar.profile')}
                    </button>

                    <button
                      onClick={() => handleNavigate('/cars')}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition flex items-center gap-3 text-gray-200 hover:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-6-4m6 4l6-4" />
                      </svg>
                      {t('navbar.vehicles')}
                    </button>

                    <button
                      onClick={() => handleNavigate('/dashboard')}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition flex items-center gap-3 text-gray-200 hover:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {t('navbar.dashboard')}
                    </button>

                    <div className="border-t border-white/10 my-2"></div>

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-3 hover:bg-red-500/20 transition flex items-center gap-3 text-red-300 hover:text-red-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('navbar.logout')}
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
              {t('navbar.login') || 'Iniciar sesión'}
            </Link>
          )}
          {/* Locale switch */}
          <div className="ml-2 flex items-center gap-1">
            <button
              onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-200 hover:bg-white/20"
            >
              {locale === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
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
            placeholder={t('navbar.searchPlaceholder') || "Buscar..."}
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
              {t('navbar.login') || 'Iniciar Sesión'}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
