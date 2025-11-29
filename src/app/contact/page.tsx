"use client"

import React from 'react'
import { useI18n } from '../i18n/I18nProvider'

export default function ContactPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">{t('contact.title')}</h1>
          <p className="text-gray-600 mt-2">{t('contact.subtitle')}</p>
        </header>

        {/* Contact grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Contact details & socials */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-semibold text-gray-900">{t('contact.linesTitle')}</h2>
              <ul className="mt-3 space-y-2 text-gray-700">
                <li>
                  {t('contact.generalPhone')} <span className="font-medium">+57 4 555 0000</span>
                </li>
                <li>
                  {t('contact.salesWhatsapp')} <span className="font-medium">+57 300 555 0000</span>
                </li>
                <li>
                  {t('contact.email')} <span className="font-medium">contacto@gtautomarket.com</span>
                </li>
                <li>
                  {t('contact.hours')} <span className="font-medium">{t('contact.hoursValue')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-semibold text-gray-900">{t('contact.socialTitle')}</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border hover:bg-gray-50">Instagram</a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border hover:bg-gray-50">Facebook</a>
                <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border hover:bg-gray-50">TikTok</a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border hover:bg-gray-50">YouTube</a>
                <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border hover:bg-gray-50">X (Twitter)</a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border hover:bg-gray-50">LinkedIn</a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-semibold text-gray-900">{t('contact.branchesTitle')}</h2>
              <ul className="mt-3 space-y-4">
                <li>
                  <p className="font-medium text-gray-900">{t('contact.branch1')}</p>
                  <p className="text-gray-700">{t('contact.address1')}</p>
                  <p className="text-gray-700">Tel: +57 4 555 1234 • WhatsApp: +57 300 555 1111</p>
                  <p className="text-gray-700">Email: poblado@gtautomarket.com</p>
                  <p className="text-gray-700">{t('contact.hours')} {t('contact.hours1')}</p>
                </li>
                <li>
                  <p className="font-medium text-gray-900">{t('contact.branch2')}</p>
                  <p className="text-gray-700">{t('contact.address2')}</p>
                  <p className="text-gray-700">Tel: +57 4 555 5678 • WhatsApp: +57 301 555 2222</p>
                  <p className="text-gray-700">Email: laureles@gtautomarket.com</p>
                  <p className="text-gray-700">{t('contact.hours')} {t('contact.hours2')}</p>
                </li>
                <li>
                  <p className="font-medium text-gray-900">{t('contact.branch3')}</p>
                  <p className="text-gray-700">{t('contact.address3')}</p>
                  <p className="text-gray-700">Tel: +57 4 555 9012 • WhatsApp: +57 302 555 3333</p>
                  <p className="text-gray-700">Email: centro@gtautomarket.com</p>
                  <p className="text-gray-700">{t('contact.hours')} {t('contact.hours3')}</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('contact.formTitle')}</h2>
              <p className="text-gray-600">{t('contact.formSubtitle')}</p>
              <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">{t('contact.formName')}</label>
                  <input className="mt-1 w-full p-2 border rounded-lg bg-gray-50" placeholder={t('contact.formNamePlaceholder')} />
                </div>
                <div>
                  <label className="text-sm text-gray-700">{t('contact.formEmail')}</label>
                  <input type="email" className="mt-1 w-full p-2 border rounded-lg bg-gray-50" placeholder={t('contact.formEmailPlaceholder')} />
                </div>
                <div>
                  <label className="text-sm text-gray-700">{t('contact.formPhone')}</label>
                  <input className="mt-1 w-full p-2 border rounded-lg bg-gray-50" placeholder={t('contact.formPhonePlaceholder')} />
                </div>
                <div>
                  <label className="text-sm text-gray-700">{t('contact.formSubject')}</label>
                  <input className="mt-1 w-full p-2 border rounded-lg bg-gray-50" placeholder={t('contact.formSubjectPlaceholder')} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">{t('contact.formMessage')}</label>
                  <textarea rows={5} className="mt-1 w-full p-2 border rounded-lg bg-gray-50" placeholder={t('contact.formMessagePlaceholder')} />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="button" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{t('contact.formSend')}</button>
                  <a href="https://wa.me/573005550000" target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">{t('contact.formWhatsapp')}</a>
                </div>
              </form>
            </div>

            {/* Map embed */}
            <div className="mt-6 bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900">{t('contact.mapTitle')}</h2>
              <div className="mt-3 aspect-video w-full overflow-hidden rounded-lg border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.114931873621!2d-75.576	!3d6.223	!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428f2b0e9e6e5%3A0x8d5a9e37af5cb4c9!2sMedell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1700000001000!5m2!1ses!2sco"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa Medellín"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}