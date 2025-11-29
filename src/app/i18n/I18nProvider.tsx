"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from './locales/en.json'
import es from './locales/es.json'

type Locale = 'en' | 'es'
type Dict = Record<string, string>

type I18nContextType = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && (localStorage.getItem('locale') as Locale)) || null
    if (saved === 'en' || saved === 'es') setLocaleState(saved)
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    if (typeof window !== 'undefined') localStorage.setItem('locale', l)
  }

  const dict: Dict = useMemo(() => (locale === 'en' ? (en as Dict) : (es as Dict)), [locale])

  const t = (key: string) => dict[key] ?? key

  const value: I18nContextType = { locale, setLocale, t }
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}