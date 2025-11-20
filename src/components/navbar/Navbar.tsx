"use client";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";
import { useState } from "react";

function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav
      className="fixed w-full top-0 z-50 border-b border-white/10 
      bg-linear-to-l from-[#0a1b3c] via-[#0e2a67] to-[#0d1f4a] backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        <div className="flex items-center space-x-3">
          <Link href="/">
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
            placeholder="Buscar vehículos, marcas, modelos..."
            className="w-full max-w-md px-4 py-2 rounded-lg 
            bg-white/10 border border-white/20 text-white placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-400/60 backdrop-blur-md"
          />
        </div>

        <div className="flex items-center space-x-4">
          {session?.user ? (
            <div className="flex items-center gap-3 relative">
              <Link
                href="/dashboard"
                className="text-gray-200 hover:text-white"
              >
                Dashboard
              </Link>

              <img
                src={session.user.image}
                alt="user"
                className="w-9 h-9 rounded-full cursor-pointer border border-white/20"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-12 w-48 
                bg-[#0d1f4a]/90 border border-white/20 backdrop-blur-xl
                rounded-lg shadow-xl p-3 text-white"
                >
                  <div className="border-b border-white/10 pb-2 mb-2">
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-gray-300 text-xs truncate">
                      {session.user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-3 py-2 rounded 
                    hover:bg-white/10 text-gray-200"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600  text-white rounded-xl  transition"
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
            placeholder="Buscar..."
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 
            text-gray-200 placeholder-gray-300 focus:outline-none"
          />

          <Link href="/" className="block text-gray-200 hover:text-white">
            Home
          </Link>
          <Link href="/about" className="block text-gray-200 hover:text-white">
            About
          </Link>
          <Link
            href="/services"
            className="block text-gray-200 hover:text-white"
          >
            Servicios
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
