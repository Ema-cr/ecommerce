"use client"

import Link from "next/link";
import { useI18n } from '@/app/i18n/I18nProvider'
import { useState } from "react";

export default function Footer() {
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubscribe = async () => {
    setMessage(null)
    const trimmed = email.trim()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    if (!valid) { setMessage("Ingresa un correo válido"); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      if (res.ok) {
        setMessage("¡Suscripción exitosa! Recibirás ofertas diarias.")
        setEmail("")
      } else {
        const data = await res.json().catch(() => ({}))
        setMessage(data?.error || "No se pudo suscribir. Intenta de nuevo.")
      }
    } catch {
      setMessage("Error de red. Intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <footer className="bg-linear-to-l from-[#0d1f4a] via-[#0e2a67] to-[#0a1b3c] text-white pt-12 pb-6 mt- border-t border-white/10">
      {/* CONTENEDOR */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* LOGO + DESCRIPCIÓN */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon-gt.png"
            alt="GT AutoMarket"
            className="h-25 mb-4 drop-shadow-lg"
          />
          <p className="text-gray-300 text-sm leading-relaxed">
            GT AutoMarket — Concesionario oficial con la mejor selección de
            vehículos nuevos y usados.
          </p>
        </div>

        {/* SECCIÓN ENLACES */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{t('footer.links.title') || 'Enlaces'}</h3>
          <ul className="space-y-2 text-gray-300">
            <Link href="/">
              <li className="hover:text-white cursor-pointer">{t('footer.links.home')}</li>
            </Link>
            <ul className="space-y-2 text-gray-300"></ul>
            <Link href="/cars">
              <li className="hover:text-white cursor-pointer">{t('footer.links.cars')}</li>
            </Link>
            <ul className="space-y-2 text-gray-300"></ul>
            <Link href="/visit">
              <li className="hover:text-white cursor-pointer">
                {t('footer.links.visit')}
              </li>
            </Link>
          </ul>
        </div>

        {/* SOPORTE */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{t('footer.support.title') || 'Soporte'}</h3>
          <ul className="space-y-2 text-gray-300">
            <Link href="/contact">
              <li className="hover:text-white cursor-pointer">{t('footer.support.contact')}</li>
            </Link>
             <ul className="space-y-2 text-gray-300"></ul>
          <Link href="/faq">
            <li className="hover:text-white cursor-pointer">{t('footer.support.faq')}</li>
            </Link>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{t('footer.newsletter.title')}</h3>
          <p className="text-gray-300 text-sm mb-3">
            {t('footer.newsletter.copy')}
          </p>

          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.newsletter.placeholder')}
              className="w-full px-4 py-2 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={handleSubscribe}
              disabled={submitting}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-medium"
            >
              {submitting ? (t('footer.newsletter.submit') + '…') : t('footer.newsletter.submit')}
            </button>
          </div>
          {message && (
            <p className="mt-2 text-sm text-gray-200">{message}</p>
          )}
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-400 text-sm mt-10 border-t border-white/10 pt-4">
        © {new Date().getFullYear()} GT AutoMarket — {t('footer.copyright')}
      </div>
    </footer>
  );
}
